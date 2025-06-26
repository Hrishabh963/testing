import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dedupe-info-details',
  templateUrl: './dedupe-info-details.component.html',
})
export class DedupeInfoDetailsComponent {

  @Input() loanId: number = null;
  @Input() title: string = null;
  @Input() editSections: boolean = true;
  @Input() enableEdit: boolean = true;
  @Input() hideEditAction: boolean = true;
  @Input() uiFields: any = {};
  @Input() uiFieldsMap = [];

}
