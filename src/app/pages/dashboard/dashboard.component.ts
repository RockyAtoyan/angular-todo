import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { TodoService } from '../../todo.service';
import { TodoComponent } from '../../components/todo/todo.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [TodoComponent, CdkDropListGroup, FormsModule],
})
export class DashboardComponent {
  authService = inject(AuthService);
  todoService = inject(TodoService);

  todoText: string = '';

  roomName = '';

  changeTodoText(event: Event) {
    const target = event.target as HTMLInputElement;
    this.todoText = target.value;
  }

  addTodo() {
    if (!this.todoText) {
      return;
    }
    this.todoService.addTodo({ text: this.todoText });
    this.todoText = '';
  }

  createRoom() {
    if (!this.roomName) {
      return;
    }
    this.todoService.createRoom(this.roomName);
    this.roomName = '';
  }
}
