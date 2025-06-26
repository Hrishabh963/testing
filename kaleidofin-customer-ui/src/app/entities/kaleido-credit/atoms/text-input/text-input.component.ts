import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
@Component({
  selector: "app-text-input",
  templateUrl: "./text-input.component.html",
  styleUrls: ["./text-input.component.scss"],
})
export class TextInputComponent {
  @Input() title: string;
  @Input() myForm: FormGroup;
  @Input() id: string;
  @Input() disablePaste = false;
}
