import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'Button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Output() onClick = new EventEmitter<boolean>();
  @Input() class = '';
  @Input() type: 'submit' | 'button' | 'reset' = 'button';
  @Input() asChild = false;

  click(event: any) {
    this.onClick.emit(event);
  }
}
