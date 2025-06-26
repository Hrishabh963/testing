import { Input, Component } from "@angular/core";

@Component({
  selector: "app-text-field",
  templateUrl: "./text-field.component.html"
})
export class TextFieldComponent{
  @Input() label: string = "";
  @Input() value: any = undefined;
  @Input() placeholder:string = "";
  constructor() {}

}
