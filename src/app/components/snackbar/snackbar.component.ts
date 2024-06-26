import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'snackbar',
  standalone: true,
  templateUrl: './snackbar.component.html',
  styles: `
    :host {
      display: flex;
    }

    .label {
      color: hotpink;
    }
  `,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
})
export class SnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA);
}
