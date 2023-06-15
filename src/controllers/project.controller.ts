import { Project } from "@prisma/client";
import debug from "debug";
import { Response } from "express";
import { abilitiesFilter } from "../abilities/filter.ability";
import { deleteProject, getAllProjects, getProjectById, getProjectByParam, registerProject, updateProject } from "../services/project.service";
import { ICustomRequest } from "../types/app.type";
import { outItemFromList } from "../utils/out-item-from-list.helper";
import { handlePrismaError } from "../utils/prisma-error.helper";
import CustomResponse from "../utils/response.helper";

export const list = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:project:list');

    try {
        // const { tenantId } = req.auth!;
        const { page, perPage } = req.params;
        // const { can } = req.abilities!;
        const projects = await getAllProjects({ page: Number(page), perPage: Number(perPage) });

        // const filteredProjects = await abilitiesFilter({
        //     subject: "Project",
        //     abilities: req.abilities as Required<ICustomRequest>["abilities"],
        //     input: projects,
        //     // selfInput: testOwner || !can("manage", "Project") ? false : true
        // }, ({ action, subject, abilities, input, selfInput }) => {
        //     const projects = [];

        //     for (const project of input) {
        //         const testOwner = project.owner !== tenantId;
        //         selfInput = testOwner || !can("manage", "Project") ? false : true

        //         if (selfInput || !project.disabled) {
        //             let filteredValue: Record<string, any> = {};

        //             Object.keys(project).forEach((item) => {
        //                 if (abilities.can(action!, subject, selfInput ? item : `${item}Other`))
        //                     filteredValue[item] = project[item as keyof Project];
        //             });

        //             projects.push(filteredValue as Project);
        //         }
        //     }

        //     return projects;
        // });
        // const finalProjects = await outItemFromList(filteredProjects);

        response[200]({ data: projects });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const retrive = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:project:retrive');

    try {
        const { tenantId } = req.auth!;
        const { projectId } = req.params;
        const { can } = req.abilities!;

        if (isNaN(Number(projectId)))
            return response[400]({ message: 'Invalid query parameter projectId.' });

        const project = await getProjectById(Number(projectId));

        if (!project)
            return response[404]({ message: "Record not found!" });

        const testOwner = project.owner !== tenantId;
        const filteredProject = await abilitiesFilter({
            subject: "Project",
            abilities: req.abilities as Required<ICustomRequest>["abilities"],
            input: [project],
            selfInput: testOwner || !can("manage", "Project") ? false : true
        }, ({ action, subject, abilities, input, selfInput }) => {
            const projects = [];

            for (const project of input) {

                if (selfInput || !project.disabled) {
                    let filteredValue: Record<string, any> = {};

                    Object.keys(project).forEach((item) => {
                        if (abilities.can(action!, subject, selfInput ? item : `${item}Other`))
                            filteredValue[item] = project[item as keyof Project];
                    });

                    projects.push(filteredValue as Project);
                }
            }

            return projects;
        });
        const finalProject = await outItemFromList(filteredProject);

        response[200]({ data: finalProject });
    } catch (err) {
        logger(err);
        response[500]({ message: "An error occurred while reading information." });
    }
};


export const remove = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:project:delete');

    try {
        const { tenantId } = req.auth!;
        const { projectId } = req.params;

        if (isNaN(Number(projectId)))
            return response[400]({ message: 'Invalid query parameter projectId.' });

        const project = await getProjectById(Number(projectId));

        if (!project)
            return response[404]({ message: "The record to delete not found!" });

        if (project.owner !== tenantId)
            return response[403]({ message: "You do not have permission to delete the selected record!" });

        await deleteProject(Number(projectId));
        response[204]({ message: 'Successfully deleted.' });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0 && errors[0].field === "RecordNotFound") {
            response[404]({ message: "The record to delete not found!" });
        } else {
            logger(err);
            response[500]({ message: "An error occurred while deleting information." });
        }
    }
};


export const update = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:project:update');

    try {
        const { tenantId } = req.auth!;
        const { projectId } = req.params;
        const { can } = req.abilities!;

        if (isNaN(Number(projectId)))
            return response[400]({ message: 'Invalid query parameter projectId.' });

        const project = await getProjectById(Number(projectId));

        if (!project)
            return response[404]({ message: "The record to update not found!" });

        if (project.owner !== tenantId && !can("manage", "Project"))
            return response[403]({ message: "You do not have permission to update the selected record!" });

        await updateProject(project.id, { disabled: true, treat: false, ...req.body});
        response[200]({ message: 'Informations updated successfully.' });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while updating information." });
        }
    }
};


export const register = async (req: ICustomRequest, res: Response) => {
    const response = new CustomResponse(res);
    const logger = debug('coollionfi:project:register');

    try {
        const { projectTitle } = req.body;
        const { userId, tenantId } = req.auth!;

        const project = await getProjectByParam({ projectTitle, owner: tenantId, deleted: false });

        if (project)
            return response[400]({
                message: "Duplicate record",
                errors: [{
                    field: "projectTitle",
                    message: "You already have a project with that title: " + projectTitle,
                }]
            });

        await registerProject({ ...req.body, owner: tenantId });
        logger(`New project registered successfully. Owner:  ${tenantId}, creator: ${userId}`);

        response[201]({ message: "Project registered successfully." });
    } catch (err) {
        const errors = handlePrismaError(err, logger);

        if (errors.length > 0)
            response[409]({
                message: "Conflict in database.",
                errors
            });
        else {
            logger(err);
            response[500]({ message: "An error occurred while registering the project." });
        }
    }

};
