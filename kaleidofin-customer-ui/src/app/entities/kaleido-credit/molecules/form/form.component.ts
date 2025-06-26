import { Component, EventEmitter, Input, Output } from "@angular/core";

import {  FormGroup } from "@angular/forms";


@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent {

  @Input() header :string ='';
  @Input() showPasswordError: boolean = false;
  @Input() remainingRequirements: Array<string> = [];
  @Input() subheader :string='';
  @Input() myForm :FormGroup;
  @Input() formFields:Array<any>;

  @Output() handleKeyDownEvent: EventEmitter<any> = new EventEmitter<any>();

  handleKeyDown(event: KeyboardEvent): void {
    this.handleKeyDownEvent.emit(event)
  }

}
