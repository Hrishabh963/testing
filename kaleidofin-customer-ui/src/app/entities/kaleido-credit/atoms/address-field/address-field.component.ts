import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-address-field',
  templateUrl: './address-field.component.html'
})
export class AddressFieldComponent {

  @Input() dataObj: any = {};
  @Input() editable: boolean;
  @Input() label : string = "";
  @Input() key: string = "";
  @Input() showToolTip: boolean = false;
  @Input() toolTipLabel: string = null;

}
