import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
