export interface Task {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  isDone: boolean;
  deadline: Date;
  order: number;
  todoId: string;
}
