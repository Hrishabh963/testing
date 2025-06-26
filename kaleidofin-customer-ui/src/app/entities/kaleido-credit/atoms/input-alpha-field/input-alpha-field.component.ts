import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-alpha-field',
  templateUrl: './input-alpha-field.component.html'
})
export class InputAlphaFieldComponent  {
  
  @Input() dataObj: any = {};
  @Input() editable: boolean;
  @Input() label : string = "";
  @Input() isRequired: boolean = false;
  @Input() errors: any = {};
  @Input() inputLength :number ;
  @Input() showToolTip: boolean = false;
  @Input() toolTipLabel: string = null;

   onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^A-Za-z\s]/g, '');
    if (input.value !== filteredValue) {
      input.value = filteredValue;
      this.dataObj.value = filteredValue;
    }
  }

}
