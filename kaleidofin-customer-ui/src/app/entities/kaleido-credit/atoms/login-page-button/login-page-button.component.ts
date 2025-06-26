import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-login-page-button",
  templateUrl: "./login-page-button.component.html",
  styleUrls: ["./login-page-button.component.scss"],
})
export class LoginPageButtonComponent {
  @Input()
  title: string = "Login";
  @Input()
  disabled: boolean = false;
  
  @Input() padding: string = '2.5vh'

  @Output()
  onButtonClick: EventEmitter<void> = new EventEmitter<void>();

  handleButtonClick() {
    this.onButtonClick.emit();
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if(event.key === 'Enter') {
      this.handleButtonClick();
    }
  }

}
