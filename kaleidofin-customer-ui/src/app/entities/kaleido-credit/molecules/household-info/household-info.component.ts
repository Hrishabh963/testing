import { Component, Input } from "@angular/core";

@Component({
  selector: "app-household-info",
  templateUrl: "./household-info.component.html",
  styleUrls: ["./household-info.component.scss"],
})
export class HouseholdInfoComponent {
  @Input() loanId: number = null;
  @Input() title: string = null;
  @Input() editSections: boolean = true;
  @Input() enableEdit: boolean = true;
  @Input() hideEditAction: boolean = true;
  @Input() uiFields: any = {};
  @Input() uiFieldsMap: any = {};
}
