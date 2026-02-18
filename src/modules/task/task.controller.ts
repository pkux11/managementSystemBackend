import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import * as taskService from "./task.service";

export const createTask = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { title, description } = req.body;

        const task = await taskService.createTask(
            req.userId!,
            title,
            description
        );

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: "Task creation failed" });
    }
};

export const getTasks = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const status = req.query.status as string;
        const search = req.query.search as string;

        const tasks = await taskService.getTasks(
            req.userId!,
            page,
            limit,
            status,
            search
        );

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

export const updateTask = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        await taskService.updateTask(
            req.userId!,
            id,
            req.body
        );

        res.json({ message: "Task updated" });
    } catch {
        res.status(400).json({ error: "Update failed" });
    }
};

export const deleteTask = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        await taskService.deleteTask(req.userId!, id);

        res.json({ message: "Task deleted" });
    } catch {
        res.status(400).json({ error: "Delete failed" });
    }
};

export const toggleTask = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const task = await taskService.toggleTask(
            req.userId!,
            id
        );

        res.json(task);
    } catch {
        res.status(400).json({ error: "Toggle failed" });
    }
};

export const getTaskById = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const task = await taskService.getTaskById(
            req.userId!,
            id
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found",
            });
        }

        res.json(task);
    } catch {
        res.status(500).json({
            error: "Error fetching task",
        });
    }
};
