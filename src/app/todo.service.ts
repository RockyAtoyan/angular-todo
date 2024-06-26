import { Injectable, signal } from '@angular/core';
import { ServerService } from './server.service';
import { Todo } from './types/todo';
import { catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { Room } from './types/room';
import { User } from './types/user';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos = signal<Todo[]>([]);

  room = signal<Room | null>(null);

  users = signal<User[]>([]);

  constructor(
    private server: ServerService,
    private authService: AuthService,
  ) {}

  getTodos() {
    return this.server.getTodos().subscribe(
      (value) => {
        this.todos.set(value);
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  addTodo(dto: { text: string; roomId?: string }) {
    return this.server.addTodo(dto).subscribe(
      (value) => {
        this.getTodos();
        if (value.roomId) {
          this.getRoom(value.roomId);
        }
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  updateTodo(id: string, dto: { text: string }) {
    return this.server.updateTodo(id, dto).subscribe(
      (value) => {
        this.getTodos();
        if (value.roomId) {
          this.getRoom(value.roomId);
        }
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  deleteTodo(id: string) {
    return this.server.deleteTodo(id).subscribe(
      (value) => {
        this.getTodos();
        if (value.roomId) {
          this.getRoom(value.roomId);
        }
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  changeTodoOrder(draggedId: string, dropId: string) {
    return this.server.changeTodoOrder(draggedId, dropId).subscribe(
      (value) => {
        this.getTodos();
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  addTask(todoId: string, dto: { text: string }) {
    return this.server.addTask(todoId, dto).subscribe(
      (value) => {
        this.getTodos();
        const roomId = this.room()?.id;
        if (roomId) {
          this.getRoom(roomId);
        }
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  updateTask(
    id: string,
    dto: { text: string; isDone: boolean; deadline: Date | string | null },
  ) {
    return this.server.updateTask(id, dto).subscribe(
      (value) => {
        this.getTodos();
        const roomId = this.room()?.id;
        if (roomId) {
          this.getRoom(roomId);
        }
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  deleteTask(id: string) {
    return this.server.deleteTask(id).subscribe(
      (value) => {
        this.getTodos();
        const roomId = this.room()?.id;
        if (roomId) {
          this.getRoom(roomId);
        }
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  changeTaskOrder(draggedId: string, dropId: string) {
    return this.server.changeTaskOrder(draggedId, dropId).subscribe(
      (value) => {
        this.getTodos();
        const roomId = this.room()?.id;
        if (roomId) {
          this.getRoom(roomId);
        }
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  pushTaskToTodo(
    taskId: string,
    todoId: string,
    prevTodoId: string,
    dropTaskId?: string,
    direction?: 'top' | 'bottom',
    order?: number,
  ) {
    return this.server
      .pushTaskToTodo(taskId, todoId, prevTodoId, dropTaskId, direction, order)
      .subscribe(
        (value) => {
          this.getTodos();
          const roomId = this.room()?.id;
          if (roomId) {
            this.getRoom(roomId);
          }
        },
        catchError((err) => {
          console.log(err.message);
          return err;
        }),
      );
  }

  getRoom(id: string) {
    return this.server.getRoom(id).subscribe(
      (value) => {
        this.room.set(value);
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  createRoom(name: string) {
    return this.server.createRoom(name).subscribe(
      (value) => {
        this.authService.auth();
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  deleteRoom(id: string) {
    return this.server.deleteRoom(id).subscribe(
      (value) => {
        this.authService.auth();
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  editRoom(id: string, dto: { name: string }) {
    return this.server.editRoom(id, dto).subscribe(
      (value) => {
        this.getRoom(value.id);
        this.authService.auth();
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  addUserToRoom(roomId: string, userId: string) {
    return this.server.addUserToRoom(roomId, userId).subscribe(
      (value) => {
        this.getRoom(value.roomId);
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  removeUserFromRoom(roomId: string, userId: string) {
    return this.server.removeUserFromRoom(roomId, userId);
  }

  acceptInviteToRoom(roomId: string, userId: string) {
    return this.server.acceptInviteToRoom(roomId, userId).subscribe(
      (value) => {
        this.authService.auth();
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  rejectInviteToRoom(roomId: string, userId: string) {
    return this.server.rejectInviteToRoom(roomId, userId).subscribe(
      (value) => {
        this.authService.auth();
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  getUsers(search?: string) {
    return this.server.getUsers(search).subscribe(
      (value) => {
        this.users.set(value);
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }

  leaveRoom(roomId: string) {
    return this.server.leaveRoom(roomId).subscribe(
      (value) => {
        this.room.set(null);
        this.authService.auth();
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      }),
    );
  }
}
