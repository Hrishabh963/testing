import { Component, Input } from '@angular/core';
import { UiFields } from 'src/app/constants/ui-config';

@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.scss']
})
export class InsuranceDataComponent {

  @Input() title: string;
  @Input() uiFields: UiFields;
  @Input() uiFieldsMap: Array<any>;
  @Input() isSubHeading: boolean;
  @Input() loanId: number;
  @Input() editSections: boolean;
  @Input() enableEdit: boolean;
  @Input() hideEditAction: boolean;
  @Input() dropDownValues: Array<string>;

  disableInput: boolean = true;

  checkCondition(value: string = ""): void {
    this.disableInput = !(value.trim().toLowerCase().includes("other"));
  }


}
