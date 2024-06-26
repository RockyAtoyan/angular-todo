import {
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Room } from '../../types/room';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoComponent } from '../../components/todo/todo.component';
import { MatIcon } from '@angular/material/icon';
import { TaskComponent } from '../../components/task/task.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TodoService } from '../../todo.service';
import { User } from '../../types/user';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
} from 'rxjs';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CdkDropListGroup,
    ReactiveFormsModule,
    TodoComponent,
    MatIcon,
    TaskComponent,
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent
  extends DashboardComponent
  implements OnInit, OnDestroy
{
  router = inject(Router);
  route = inject(ActivatedRoute);
  room: Signal<Room | null> = this.todoService.room;

  dialog = inject(MatDialog);

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (!id) return;
      this.todoService.getRoom(id);
    });
  }

  ngOnDestroy() {
    this.todoService.room.set(null);
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialog, {
      data: { roomId: this.room()?.id },
      width: '40%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.todoService.users.set([]);
    });
  }

  openUsersDialog(): void {
    const dialogRef = this.dialog.open(UsersDialog, {
      data: {
        roomId: this.room()?.id,
        admin: this.room()?.admin,
        users: this.room()?.users,
      },
      width: '40%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditDialog, {
      data: {
        roomId: this.room()?.id,
        name: this.room()?.name,
      },
      width: '40%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  override addTodo() {
    if (!this.room()?.isAdmin) return;
    if (!this.todoText) {
      return;
    }
    this.todoService.addTodo({ text: this.todoText, roomId: this.room()?.id });
    this.todoText = '';
  }

  edit() {}

  leave() {
    const id = this.room()?.id;
    if (!id) return;
    this.todoService.leaveRoom(id);
    this.router.navigate(['/dashboard']);
  }

  delete() {
    if (!this.room()?.isAdmin) return;
    const id = this.room()?.id;
    if (!id) return;
    this.todoService.deleteRoom(id);
    this.todoService.room.set(null);
    this.router.navigate(['/dashboard']);
  }
}

interface DialogData {
  roomId: string;
}

interface UsersDialogData extends DialogData {
  users: User[];
  admin: User;
}

@Component({
  selector: 'users-dialog',
  templateUrl: './users-dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
  ],
})
export class UsersDialog {
  todoService = inject(TodoService);

  constructor(
    public dialogRef: MatDialogRef<UsersDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: UsersDialogData
  ) {}

  removeUser(user: User) {
    const roomId = this.data.roomId;
    if (!roomId) return;
    this.todoService.removeUserFromRoom(roomId, user.id).subscribe(
      (value) => {
        this.todoService.getRoom(value.id);
        this.data.users = value.users;
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      })
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-user-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
  ],
})
export class AddUserDialog {
  todoService = inject(TodoService);
  searchUser = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<AddUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    {
      this.searchUser
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe((value) => {
          if (!value) this.todoService.users.set([]);
          else this.todoService.getUsers(value);
        });
    }
  }

  search = '';

  addUser(user: User) {
    if (!this.data.roomId) {
      this.dialogRef.close();
      return;
    }
    if (this.todoService.room()?.admin.id === user.id) return;
    this.todoService.addUserToRoom(this.data.roomId, user.id);
    this.todoService.users.set([]);
    this.dialogRef.close(user);
  }

  onNoClick(): void {
    this.todoService.users.set([]);
    this.dialogRef.close();
  }
}

interface EditDialogData {
  roomId: string;
  name: string;
}

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
    FormsModule,
  ],
})
export class EditDialog {
  todoService = inject(TodoService);

  constructor(
    public dialogRef: MatDialogRef<EditDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData
  ) {}

  name = this.data.name;

  edit() {
    if (!this.name) return;
    this.todoService.editRoom(this.data.roomId, { name: this.name });
    this.dialogRef.close(this.name);
  }

  onNoClick(): void {
    this.name = this.data.name;
    this.dialogRef.close();
  }
}
