import { prisma } from "../../config/db";

export const createTask = async (
    userId: number,
    title: string,
    description?: string
) => {
    return prisma.task.create({
        data: {
            title,
            description,
            userId,
        },
    });
};

export const getTasks = async (
    userId: number,
    page: number,
    limit: number,
    status?: string,
    search?: string
) => {
    const skip = (page - 1) * limit;

    return prisma.task.findMany({
        where: {
            userId,
            status: status || undefined,
            title: search
                ? {
                    contains: search,
                }
                : undefined,
        },
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getTaskById = async (
    userId: number,
    taskId: number
) => {
    return prisma.task.findFirst({
        where: {
            id: taskId,
            userId,
        },
    });
};

export const updateTask = async (
    userId: number,
    taskId: number,
    data: any
) => {
    return prisma.task.updateMany({
        where: {
            id: taskId,
            userId,
        },
        data,
    });
};

export const deleteTask = async (
    userId: number,
    taskId: number
) => {
    return prisma.task.deleteMany({
        where: {
            id: taskId,
            userId,
        },
    });
};

export const toggleTask = async (
    userId: number,
    taskId: number
) => {
    const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
    });

    if (!task) throw new Error("Task not found");

    const newStatus =
        task.status === "DONE" ? "TODO" : "DONE";

    return prisma.task.update({
        where: { id: taskId },
        data: { status: newStatus },
    });
};
