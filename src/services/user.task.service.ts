import { AppError } from "../errors/AppError";
import {
  createTask,
  deleteUserByTaskId,
  fetchSingleTask,
  fetchTaskByUserId,
  updateTaskTitle,
} from "../repositories/user.task.repository";
import { Task } from "../types/task";

function validateTitle(title: unknown): string {
  if (typeof title !== "string" || !title.trim()) {
    throw new AppError(400, "Title is required");
  }
  const trimTitle = title.trim();

  if (trimTitle.length > 100) {
    throw new AppError(400, "Title must be 100 char or less");
  }
  return trimTitle;
}

export async function createUserTask(
  userId: string,
  title: unknown,
): Promise<Task> {
  const validTitle = validateTitle(title);
  return createTask(userId, validTitle);
}

export async function geteUserTask(userId: string): Promise<Task[]> {
  return fetchTaskByUserId(userId);
}

export async function getUserTaskById(
  userId: string,
  taskId: string,
): Promise<Task> {
  const task = await fetchSingleTask(userId, taskId);
  if (!task) {
    throw new AppError(2404, "Task not found");
  }
  return task;
}
export async function updateUserTask(
  userId: string,
  taskId: string,
  title: string,
): Promise<Task> {
  const validTitle = validateTitle(title);
  const task = await updateTaskTitle(userId, taskId, validTitle);
  if (!task) {
    throw new AppError(2404, "Task not found");
  }
  return task;
}
export async function deleteUserTask(
  userId: string,
  taskId: string,
): Promise<void> {
  const deleted = await deleteUserByTaskId(userId, taskId);
  if (!deleted) {
    throw new AppError(2404, "Task not found");
  }
}
