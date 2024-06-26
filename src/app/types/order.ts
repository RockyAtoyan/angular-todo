import { User } from './user';
import { Room } from './room';

export interface Order {
  id: string;
  roomId: string;
  room: Room;
  invitedId: string;
  invited: User;
}
