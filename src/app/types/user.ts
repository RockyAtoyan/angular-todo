import { Todo } from './todo';
import { Room } from './room';
import { Order } from './order';

export interface User {
  id: string;
  login: string;
  image: string | null;
  todos: Todo[];
  rooms: Room[];
  adminRooms: Room[];
  orders: Order[];
}
