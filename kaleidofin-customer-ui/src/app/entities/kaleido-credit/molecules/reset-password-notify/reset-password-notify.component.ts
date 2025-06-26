import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-reset-password-notify',
  templateUrl: './reset-password-notify.component.html',
  styleUrls: ['./reset-password-notify.component.scss']
})
export class ResetPasswordNotifyComponent {
  
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  handleClick(): void {
    this.onClick.emit();
  }

}
