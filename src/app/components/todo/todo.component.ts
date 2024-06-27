import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { Todo } from '../../types/todo';
import { TodoService } from '../../todo.service';
import { TaskComponent } from '../task/task.component';
import { MatIcon } from '@angular/material/icon';
import { Task } from '../../types/task';
import { ButtonComponent } from '../../ui/button/button.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MatDivider } from '@angular/material/divider';
import { HlmButtonDirective } from '../../ui/ui-button-helm/src/lib/hlm-button.directive';

export type TaskFilter = 'all' | 'done' | 'active';

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  imports: [
    TaskComponent,
    MatIcon,
    ButtonComponent,
    CdkDropList,
    CdkDrag,
    MatDivider,
    HlmButtonDirective
  ],
})
export class TodoComponent implements OnInit, OnChanges {
  todoService = inject(TodoService);

  input = viewChild<ElementRef>('edit');
  taskInput = viewChild<ElementRef>('editTask');

  @Input() todo!: Todo;
  @Input() isInRoom: boolean = false;
  @Input() isAdmin: boolean = false;

  editMode = false;
  editTextValue = '';

  addTaskMode = false;
  taskTextValue = '';

  filter: TaskFilter = 'all';

  ngOnInit() {
    this.editTextValue = this.todo.text;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.editTextValue = this.todo.text;
  }

  setEditMode(mode: boolean) {
    if (this.isInRoom && !this.isAdmin) return;
    if (mode) {
      this.editMode = true;
      setTimeout(() => {
        this.input()?.nativeElement.focus();
      });
    } else {
      this.editMode = false;
      this.editTextValue = this.todo.text;
    }
  }

  setAddTaskMode(mode: boolean) {
    if (this.isInRoom && !this.isAdmin) return;
    if (mode) {
      this.addTaskMode = true;
      setTimeout(() => {
        this.taskInput()?.nativeElement.focus();
      });
    } else {
      this.addTaskMode = false;
      this.taskTextValue = '';
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.isInRoom && !this.isAdmin) return;
    if (event.container.id === event.previousContainer.id) {
      const draggedId = this.todo.tasks[event.previousIndex].id;
      const dropId =
        this.todo.tasks[
          event.currentIndex > event.previousIndex || event.currentIndex === 0
            ? event.currentIndex
            : event.currentIndex - 1
        ].id;
      if (!draggedId || !dropId || draggedId === dropId) return;
      // this.todoService.changeTaskOrder(draggedId, dropId);
      this.todoService.pushTaskToTodo(
        draggedId,
        event.container.id,
        event.container.id,
        dropId,
        event.currentIndex === 0 ? 'top' : 'bottom',
      );
      return;
    }
    if (!this.isInRoom) {
      const draggedId = this.todoService
        .todos()
        .find((todo) => todo.id === event.previousContainer.id)?.tasks[
        event.previousIndex
      ].id;
      if (!draggedId) return;
      const dropTodo = this.todoService.todos().find((todo) => {
        return event.container.id === todo.id;
      });
      if (!dropTodo) return;
      const dropTask =
        this.todo.tasks[
          event.currentIndex === 0 ? event.currentIndex : event.currentIndex - 1
        ];
      this.todoService.pushTaskToTodo(
        draggedId,
        dropTodo.id,
        event.previousContainer.id,
        dropTask && dropTask.id,
        event.currentIndex === 0 ? 'top' : 'bottom',
      );
      return;
    }
    const todos = this.todoService.room()?.todos;
    if (!todos) return;
    const draggedId = todos.find(
      (todo) => todo.id === event.previousContainer.id,
    )?.tasks[event.previousIndex].id;
    if (!draggedId) return;
    const dropTodo = todos.find((todo) => {
      return event.container.id === todo.id;
    });
    if (!dropTodo) return;
    const dropTask =
      this.todo.tasks[
        event.currentIndex === 0 ? event.currentIndex : event.currentIndex - 1
      ];
    this.todoService.pushTaskToTodo(
      draggedId,
      dropTodo.id,
      event.previousContainer.id,
      dropTask && dropTask.id,
      event.currentIndex === 0 ? 'top' : 'bottom',
    );
  }

  setFilter(fitler: TaskFilter) {
    this.filter = fitler;
  }

  changeTaskText(event: Event) {
    if (this.isInRoom && !this.isAdmin) return;
    const target = event.target as HTMLInputElement;
    this.taskTextValue = target.value;
  }

  addTask() {
    if (this.isInRoom && !this.isAdmin) return;
    if (this.taskTextValue) {
      this.todoService.addTask(this.todo.id, { text: this.taskTextValue });
      this.addTaskMode = false;
      this.filter = 'all';
    }
  }

  changeEditText(event: Event) {
    if (this.isInRoom && !this.isAdmin) return;
    const target = event.target as HTMLInputElement;
    this.editTextValue = target.value;
  }

  editTodo() {
    if (this.isInRoom && !this.isAdmin) return;
    if (this.todo?.id) {
      this.todoService.updateTodo(this.todo?.id, { text: this.editTextValue });
      this.editMode = false;
    }
  }

  filterTasks(tasks: Task[]) {
    if (this.filter === 'all') return tasks;
    if (this.filter === 'done') return tasks.filter((task) => task.isDone);
    return tasks.filter((task) => !task.isDone);
  }

  getTasksGroups() {
    const todos = this.todoService.todos();
    if (!todos) return [];
    return todos
      .filter((todo) => todo.id === this.todo.id)
      .map((todo) => todo.id.toString());
  }

  delete() {
    if (this.isInRoom && !this.isAdmin) return;
    if (this.todo?.id) {
      this.todoService.deleteTodo(this.todo?.id);
    }
  }
}
