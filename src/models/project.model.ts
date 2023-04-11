import { Prisma, PrismaClient, Project } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProjects = async ({ where, page, perPage }: { where?: Prisma.ProjectWhereInput; page?: number; perPage?: number; } = {}): Promise<Project[]> => {
    const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : undefined;

    return await prisma.project.findMany({
        where,
        ...paginate
    });
}

export const getProjectById = async (id: number): Promise<Project | null> => {
    return await prisma.project.findFirst({ where: { id, deleted: false } });
}

export const getProjectByParam = async (params: Prisma.ProjectWhereInput): Promise<Project | null> => {
    return await prisma.project.findFirst({ where: params });
}

export const createProject = async (project: Project): Promise<Project> => {
    return await prisma.project.create({
        data: project,
    });
}

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
    return await prisma.project.update({
        where: { id },
        data: project
    });
}

