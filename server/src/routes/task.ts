import { Router } from "express";
import {
  getUserTasks,
  handleAddTask,
  handleDeleteTask,
  handleUpdateTasks,
} from "../controllers/task";

export const TaskRouter: Router = Router();

TaskRouter.get("/", getUserTasks);
TaskRouter.post("/update", handleUpdateTasks);
TaskRouter.post("/add", handleAddTask);
TaskRouter.post("/delete", handleDeleteTask);
