import { pool } from "../lib/db";
import { Task } from "../types/task";

type TaskRow = Task;
export async function createTask(userId: string, title: string): Promise<Task> {
  const result = await pool.query<TaskRow>(
    `
    INSERT INTO support_tasks (title, user_id) 
    VALUES ($1,$2)
    RETURNING id,title,status,user_id,created_at,updated_at
    `,
    [title, userId],
  );
  return result.rows[0];
}

export async function fetchTaskByUserId(userId: string): Promise<Task[]> {
  const result = await pool.query<Task>(
    `
    SELECT id,title,status, user_id,created_at, updated_at from support_tasks 
    WHERE user_id = $1 ORDER BY created_at DESC
    `,
    [userId],
  );
  return result.rows;
}
export async function fetchSingleTask(
  userId: string,
  taskId: string,
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
SELECT id,title,status,user_id,created_at,updated_at from support_tasks WHERE user_id = $1 AND id = $2
`,
    [userId, taskId],
  );
  return result.rows[0];
}
export async function updateTaskTitle(
  userId: string,
  taskId: string,
  title: string,
): Promise<Task | null> {
  const result = await pool.query<TaskRow>(
    `
    UPDATE support_tasks
    SET title = $1, updated_at = NOW() WHERE user_id = $2 AND id = $3
    RETURNING id,title,status,user_id,created_at,updated_at
`,
    [title, userId, taskId],
  );
  return result.rows[0];
}
export async function deleteUserByTaskId(
  userId: string,
  taskId: string,
): Promise<boolean> {
  const result = await pool.query<TaskRow>(
    `
    DELETE FROM support_tasks
     WHERE user_id = $1 AND id = $2
`,
    [userId, taskId],
  );
  return (result.rowCount ?? 0) > 0;
}
