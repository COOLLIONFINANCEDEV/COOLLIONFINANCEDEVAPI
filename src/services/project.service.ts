import { Prisma, Project } from '@prisma/client';
import { app as appConfig } from '../configs/app.conf';
import * as model from '../models/project.model';

const pagination = appConfig.pagination;

export const getAllProjects = async ({ where, page, perPage }: { where?: Prisma.ProjectWhereInput; page?: number; perPage?: number; } = {}): Promise<Project[]> => {
    page = page || pagination.page;
    perPage = perPage || pagination.perPage;
    return await model.getAllProjects({ where, page, perPage });
}

export const getProjectById = async (id: number): Promise<Project | null> => {
    return await model.getProjectById(id);
}

export const getProjectByParam = async (where: Prisma.ProjectWhereInput): Promise<Project | null> => {
    return await model.getProjectByParam(where);
}

export const deleteProject = async (id: number): Promise<Project> => {
    return await model.updateProject(id, { deleted: true });
}

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
    return await model.updateProject(id, project);
}

export const registerProject = async (project: Partial<Project>): Promise<Project> => {
    return await model.createProject(project as Required<Project>);
}
