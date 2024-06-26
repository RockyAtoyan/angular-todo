import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { RegistrationDto } from './dto/registration.dto';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from './dto/login.dto';
import { User } from './types/user';
import { Todo } from './types/todo';
import { Task } from './types/task';
import { Room } from './types/room';
import { Order } from './types/order';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registration(dto: RegistrationDto) {
    const payload = {
      login: dto.get('login') || null,
      password: dto.get('password') || null,
      image: dto.get('image') || null,
    };
    if (!payload.login || !payload.password) return;
    return this.http.post('/auth/registration', dto);
  }

  login(dto: LoginDto) {
    const payload = {
      login: dto.get('login') || null,
      password: dto.get('password') || null,
    };
    if (!payload.login || !payload.password) return;
    return this.http.post<{ user: User; accessToken: string }>(
      '/auth/login',
      payload,
    );
  }

  logout() {
    return this.http.get('/auth/logout');
  }

  auth() {
    return this.http.get<{ user: User; accessToken: string }>('/auth/refresh');
  }

  async isAuthenticated() {
    try {
      const { data } = await axios.get(this.url + '/auth/refresh', {
        withCredentials: true,
      });
      return !!data;
    } catch (e) {
      return false;
    }
  }

  getTodos() {
    return this.http.get<Todo[]>('/todo');
  }

  addTodo(dto: { text: string; roomId?: string }) {
    return this.http.post<Todo>('/todo', dto);
  }

  updateTodo(id: string, dto: { text: string }) {
    return this.http.put<Todo>(`/todo/${id}`, dto);
  }

  deleteTodo(id: string) {
    return this.http.delete<Todo>(`/todo/${id}`);
  }

  changeTodoOrder(draggeId: string, dropId: string) {
    return this.http.get<boolean>(`/todo/${draggeId}/order/${dropId}`);
  }

  addTask(todoId: string, dto: { text: string }) {
    return this.http.post<Task>(`/todo/${todoId}`, dto);
  }

  updateTask(id: string, dto: { text: string }) {
    return this.http.put<Task>(`/todo/task/${id}`, dto);
  }

  deleteTask(id: string) {
    return this.http.delete<Task>(`/todo/task/${id}`);
  }

  changeTaskOrder(draggedId: string, dropId: string) {
    return this.http.get<boolean>(`/todo/task/${draggedId}/order/${dropId}`);
  }

  pushTaskToTodo(
    taskId: string,
    todoId: string,
    prevTodoId: string,
    dropTaskId?: string,
    direction?: 'top' | 'bottom',
    order?: number,
  ) {
    return this.http.put<boolean>(`/todo/task/push/${todoId}`, {
      taskId,
      prevTodoId,
      dropTaskId,
      direction,
      order,
    });
  }

  getRoom(id: string) {
    return this.http.get<Room>(`/todo/room/${id}`);
  }

  createRoom(name: string) {
    return this.http.post<Room>(`/todo/room`, {
      name,
    });
  }

  deleteRoom(id: string) {
    return this.http.delete<Room>(`/todo/room/${id}`);
  }

  editRoom(id: string, dto: { name: string }) {
    return this.http.put<Room>(`/todo/room/${id}`, { ...dto });
  }

  addUserToRoom(roomId: string, userId: string) {
    return this.http.put<Order>(`/todo/room/${roomId}/add/${userId}`, {});
  }

  removeUserFromRoom(roomId: string, userId: string) {
    return this.http.put<Room>(`/todo/room/${roomId}/remove/${userId}`, {});
  }

  acceptInviteToRoom(roomId: string, userId: string) {
    return this.http.post<Order>(`/todo/room/${roomId}/accept/${userId}`, {});
  }

  rejectInviteToRoom(roomId: string, userId: string) {
    return this.http.post<Order>(`/todo/room/${roomId}/reject/${userId}`, {});
  }

  getUsers(search?: string) {
    return this.http.get<User[]>(`/todo/users?search=${search || ''}`);
  }

  leaveRoom(roomId: string) {
    return this.http.put<Room>(`/todo/room/${roomId}/leave`, {});
  }
}
