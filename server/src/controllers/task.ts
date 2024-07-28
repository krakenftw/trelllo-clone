import { Request, Response } from "express";
import User from "../common/schema/user.schema";
import Board, { IBoard } from "../common/schema/board.schema";
import Task from "../common/schema/task.schema";

export const handleUpdateTasks = async (req: Request, res: Response) => {
    const user = req.session.user;
    const { tasks } = req.body;

    if (!tasks || !tasks.todo || !tasks.in_progress || !tasks.under_review || !tasks.completed) {
        return res.status(400).json({ message: "Invalid fields" });
    }

    const userData = await User.findOne({ _id: user?.id }).populate("board");

    if (!userData) {
        return res.status(400).json({ message: "User not found" });
    }

    let board = userData?.board;

    if (!board) {
        const board = new Board({
            userId: userData?._id,
            todo: tasks.todo,
            in_progress: tasks.in_progress,
            under_review: tasks.under_review,
            completed: tasks.completed
        })
        await board.save()
    }

    res.status(200)
}

export const handleAddTask = async (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userData = await User.findOne({ _id: user?.id }).populate("board");

    if (!userData) {
        return res.status(400).json({ message: "User not found" });
    }

    const { title, description, status, priority, deadline } = req.body;

    if (!title || !status) {
        return res.status(400).json({ message: "Invalid fields" });
    }
    try {
        let board: any = userData.board;

        if (!board) {
            board = new Board({
                userId: user.id
            });
            await board.save();
            userData.board = board._id;
            await userData.save();
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            deadline
        });


        await task.save();

        switch (status) {
            case "todo":
                board.todo.push(task._id);
                break;
            case "in_progress":
                board.in_progress.push(task._id);
                break;
            case "under_review":
                board.under_review.push(task._id);
                break;
            case "completed":
                board.completed.push(task._id);
                break;
            default:
                return res.status(400).json({ message: "Invalid status" });
        }
        await board.save();

        return res.status(201).json({ message: "Task added successfully", task });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Server error" });
    }
};
