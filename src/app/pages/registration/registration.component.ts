import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServerService } from '../../server.service';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../ui/button/button.component';
import { MatIcon } from '@angular/material/icon';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ToastrService } from 'ngx-toastr';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    RouterLink,
    MatIcon,
    HlmButtonDirective,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  @ViewChild('imageRef') input: ElementRef | undefined;

  image = null;

  form = this.formBuilder.group({
    login: '',
    password: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private server: ServerService,
    private router: Router
  ) {}

  onFileChanged(event: any) {
    if (event.target.files && event.target.files.length && this.input) {
      const file = event.target.files[0];
      this.image = file || null;
    } else {
      this.image = null;
    }
  }

  onSubmit(): void {
    const { login, password } = this.form.value;
    if (!login || !password) return;
    const formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);
    if (this.image) {
      formData.append('image', this.image);
    }
    this.server.registration(formData)?.subscribe({
      next: (value) => {
        toast.info('You signed up!');
        this.router.navigateByUrl('/login');
      },
    });
    this.form.reset();
    this.image = null;
    if (this.input?.nativeElement.value) this.input.nativeElement.value = null;
  }
}
