import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './ui/layout/layout.component';
import { AuthService } from './auth.service';
import { TodoService } from './todo.service';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LayoutComponent, HlmToasterComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private todoService: TodoService,
  ) {}

  ngOnInit() {
    this.authService.auth();
    this.todoService.getTodos();
  }
}
