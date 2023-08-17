import { TasksController } from "../controllers/tasksController";
import express from "express";

const app = express()
const TaskController = new TasksController();

app.delete('/api/tasks/:id', TaskController.deleteById);
app.post('/api/tasks', TaskController.saveTask);
app.get('/api/tasks', TaskController.fetchTasks);
app.put('/api/tasks', TaskController.updateTasks)
app.put('/api/tasks/status', TaskController.updateStatus)

export const tasksRouter = app;