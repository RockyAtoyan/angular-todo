import { Component } from '@angular/core';
import { HlmButtonDirective } from '../../ui/ui-button-helm/src/lib/hlm-button.directive';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [HlmButtonDirective],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
