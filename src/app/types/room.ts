import { User } from './user';
import { Todo } from './todo';

export interface Room {
  id: string;
  name: string;
  admin: User;
  userId: string;
  users: User[];
  todos: Todo[];
  isAdmin: boolean;
}
