import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ServerService } from '../../server.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'logout-button',
  standalone: true,
  templateUrl: './logout-button.component.html',
  imports: [ButtonComponent, HlmButtonDirective],
})
export class LogoutButtonComponent {
  authService = inject(AuthService);
  router = inject(Router);
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
