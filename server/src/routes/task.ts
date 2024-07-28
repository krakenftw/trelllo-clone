import { Router } from "express";
import { handleAddTask, handleUpdateTasks } from "../controllers/task";

export const TaskRouter: Router = Router();

TaskRouter.post("/update", handleUpdateTasks);
TaskRouter.post("/add", handleAddTask)
