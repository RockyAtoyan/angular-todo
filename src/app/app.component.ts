import { PendingService } from './pending.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './ui/layout/layout.component';
import { AuthService } from './auth.service';
import { TodoService } from './todo.service';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { LoaderComponent } from './components/loader/loader.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LayoutComponent,
    HlmToasterComponent,
    LoaderComponent,
    AsyncPipe,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
  public isloading: boolean = false;

  constructor(
    private authService: AuthService,
    private todoService: TodoService,
    public pendingService: PendingService
  ) {}

  ngOnInit() {
    this.authService.auth();
    this.todoService.getTodos();
  }
}
