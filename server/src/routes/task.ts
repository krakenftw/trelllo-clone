import { Router } from "express";
import {
  getUserTasks,
  handleAddTask,
  handleUpdateTasks,
} from "../controllers/task";

export const TaskRouter: Router = Router();

TaskRouter.get("/", getUserTasks);
TaskRouter.post("/update", handleUpdateTasks);
TaskRouter.post("/add", handleAddTask);
