import { Task } from './task';
import { Room } from './room';

export interface Todo {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  order: number;
  room?: Room;
  roomId?: string;
}
