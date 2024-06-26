import { Component } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [MatTabGroup, MatTab, MatTabLabel],
})
export class HomeComponent {}
