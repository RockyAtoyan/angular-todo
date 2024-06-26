import {
  Component,
  ElementRef,
  Inject,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { Task } from '../../types/task';
import { TodoService } from '../../todo.service';
import { FormsModule } from '@angular/forms';
import { LibService } from '../../lib.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  imports: [FormsModule, MatIcon, CdkDragPlaceholder, CdkDragHandle],
})
export class TaskComponent implements OnInit, OnChanges {
  todoService = inject(TodoService);
  libService = inject(LibService);
  dialog = inject(MatDialog);

  @Input() task!: Task;
  @Input() isAdmin: boolean = false;
  @Input() isInRoom: boolean = false;

  input = viewChild<ElementRef>('edit');

  editMode = false;
  editTextValue = '';
  editDeadlineValue: string | null = null;

  ngOnInit() {
    this.editTextValue = this.task.text;
    this.editDeadlineValue = this.task.deadline
      ? this.libService.getValueToDateInput(new Date(this.task.deadline))
      : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.editTextValue = this.task.text;
    this.editDeadlineValue = this.task.deadline
      ? this.libService.getValueToDateInput(new Date(this.task.deadline))
      : null;
  }

  openDialog(): void {
    if (this.isInRoom && !this.isAdmin) return;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {
        text: this.editTextValue,
        deadline: this.editDeadlineValue,
      } as DialogData,
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        this.editTextValue = result.text;
        this.editDeadlineValue = result.deadline;
        this.editTask();
      }
    });
  }

  Deadline() {
    return new Date(this.task.deadline);
  }

  isExpired() {
    return this.Deadline() < new Date();
  }

  setEditMode(mode: boolean) {
    if (this.isInRoom && !this.isAdmin) return;
    if (mode) {
      this.editMode = true;
      setTimeout(() => {
        this.input()?.nativeElement.focus();
      });
    } else {
      this.editTextValue = this.task.text;
      this.editMode = false;
    }
  }

  editTask() {
    if (this.isInRoom && !this.isAdmin) return;
    if (this.editTextValue) {
      this.todoService.updateTask(this.task.id, {
        text: this.editTextValue,
        deadline: this.editDeadlineValue
          ? new Date(this.editDeadlineValue)
          : null,
        isDone: this.task.isDone,
      });
      this.setEditMode(false);
    }
  }

  deleteTask() {
    if (this.isInRoom && !this.isAdmin) return;
    this.todoService.deleteTask(this.task.id);
  }

  toggleTask() {
    if (this.isInRoom && !this.isAdmin) return;
    this.todoService.updateTask(this.task.id, {
      text: this.editTextValue,
      deadline: this.editDeadlineValue
        ? new Date(this.editDeadlineValue)
        : null,
      isDone: !this.task.isDone,
    });
  }
}

export interface DialogData {
  text: string;
  deadline: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.data);
  }
}
