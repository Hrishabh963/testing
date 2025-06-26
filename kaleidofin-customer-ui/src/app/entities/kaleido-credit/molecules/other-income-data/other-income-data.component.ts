import { Component, Input } from '@angular/core';
import { CustomButton } from '../../models/CustomButton.model';

@Component({
  selector: 'app-other-income-data',
  templateUrl: './other-income-data.component.html',
})
export class OtherIncomeDataComponent {

  @Input() loanId: number = null;
  @Input() uiFields: any = {};
  @Input() title: string = null
  @Input() uiFieldsMap: Array<any> = [];
  @Input() hideEditAction: boolean = true;
  @Input() enableEdit: boolean = false;
  @Input() editSections: boolean = false;
  @Input() customButtons: Array<CustomButton> = [];  
  @Input() uiApiKey: string = null;
  @Input() sectionTitle: string = null;
}
 