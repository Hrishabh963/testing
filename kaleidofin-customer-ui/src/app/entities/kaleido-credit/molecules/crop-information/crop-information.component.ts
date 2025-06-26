import { Component, Input } from "@angular/core";
import { CustomButton } from "../../models/CustomButton.model";
@Component({
  selector: "app-crop-information",
  templateUrl: "./crop-information.component.html",
})
export class CropInformationComponent {
  @Input() loanId: number = null;
  @Input() title: string = null;
  @Input() editSections: boolean = true;
  @Input() enableEdit: boolean = true;
  @Input() hideEditAction: boolean = true;
  @Input() uiFields: any = {};
  @Input() uiFieldsMap = [];
  @Input() customButtons: Array<CustomButton> = [];
  @Input() sectionTitle: string = null;
}
