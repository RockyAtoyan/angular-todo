import {
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
  viewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { AuthService } from '../../auth.service';
import { User } from '../../types/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../todo.service';
import { Order } from '../../types/order';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '../ui-separator-helm/src/lib/hlm-separator.directive';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
  HlmDialogCloseDirective,
} from '@spartan-ng/ui-dialog-helm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    LogoutButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIcon,
    MatBadge,
    HlmBadgeDirective,
    HlmButtonDirective,
    HlmButtonDirective,
    BrnSeparatorComponent,
    HlmSeparatorDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    FormsModule,
    HlmDialogCloseDirective,
  ],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  public auth = inject(AuthService);
  public userSignal: WritableSignal<User | null> = this.auth.userSignal;
  public todoService = inject(TodoService);
  public router = inject(Router);

  public room = this.todoService.room;

  public select = viewChild<ElementRef>('select');
  public orders = viewChild<ElementRef>('orders');

  public roomName = '';

  constructor() {
    this.userSignal = this.auth.userSignal;
  }

  click(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.rooms_select')) {
      document.querySelector('.rooms')?.classList.remove('active');
    }
    if (!target.closest('.orders')) {
      document.querySelector('.orders_items')?.classList.remove('active');
    }
  }

  toggleRoomsSelect() {
    const active = this.select()?.nativeElement.classList.contains('active');
    if (active) {
      document.querySelector('.rooms')?.classList.remove('active');
      document.removeEventListener('click', this.click);
      return;
    }
    this.select()?.nativeElement.classList.add('active');
    document.addEventListener('click', this.click);
  }

  toggleOrders() {
    const active = this.orders()?.nativeElement.classList.contains('active');
    if (active) {
      document.querySelector('.orders_items')?.classList.remove('active');
      document.removeEventListener('click', this.click);
      return;
    }
    this.orders()?.nativeElement.classList.add('active');
    document.addEventListener('click', this.click);
  }

  acceptInvateToRoom(order: Order) {
    this.todoService.acceptInviteToRoom(order.roomId, order.invitedId);
    // this.toggleOrders();
  }

  rejectInvateToRoom(order: Order) {
    this.todoService.rejectInviteToRoom(order.roomId, order.invitedId);
    // this.toggleOrders();
  }

  createRoom() {
    if (!this.roomName) {
      return;
    }
    this.todoService.createRoom(this.roomName);
    this.roomName = '';
  }
}
