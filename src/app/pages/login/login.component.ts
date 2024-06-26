import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ServerService } from '../../server.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../ui/button/button.component';
import { AuthService } from '../../auth.service';
import { TodoService } from '../../todo.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink,
    HlmButtonDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form = this.formBuilder.group({
    login: '',
    password: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private server: ServerService,
    private authService: AuthService,
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onSubmit(): void {
    const { login, password } = this.form.value;
    if (!login || !password) return;
    const formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);
    this.server.login(formData)?.subscribe({
      next: (value) => {
        this.authService.userSignal.set(value.user);
        localStorage.setItem('accessToken', value.accessToken);
        this.todoService.getTodos();
        const callbackUrl =
          this.route.snapshot?.queryParams['callbackUrl'] || null;
        this.router.navigateByUrl(callbackUrl || '/dashboard');
      },
    });
    this.form.reset();
  }
}
