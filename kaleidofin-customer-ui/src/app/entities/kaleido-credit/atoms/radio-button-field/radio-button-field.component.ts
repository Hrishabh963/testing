import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio-button-field',
  templateUrl: './radio-button-field.component.html',
  styleUrls: ['./radio-button-field.component.scss']
})
export class RadioButtonFieldComponent {
  @Input() dataObj: any = {};
  @Output() editDetails: EventEmitter<any> = new EventEmitter<any>;

  edit(): void{
    console.log(this.dataObj);
    
    this.editDetails.emit(this.dataObj);
  }

}
