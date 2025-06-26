import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { UiFields } from "src/app/constants/ui-config";
import { UiConfigService } from "../../../services/ui-config.service";
import { BreValidationService } from "../bre-validation.service";

const failed = "assets/images/common/mdi_close-circle.svg";
const pass = `assets/images/common/success-check-circle-outlined.svg`;
const deviation = `assets/images/common/deviation.svg`;
@Component({
  selector: "app-bre-subsections",
  templateUrl: "./bre-subsections.component.html",
  styleUrls: ["./bre-subsections.component.scss"],
})
export class BreSubsectionsComponent implements OnInit, OnChanges {
  @Input() uiFields: UiFields = {};
  @Input() uiFieldKey: string = "";
  @Input() uiFieldsMap: any[] = [];
  @Input() title: UiFields = {};
  @Input() editSections: boolean = false;
  @Input() hideEditAction: boolean = false;
  @Output() saveSubsection: EventEmitter<void> = new EventEmitter<void>();

  enableEdit: boolean = false;
  initialFields: UiFields = {};
  validations: string[] = [];

  isFormValid: boolean = false;
  
  constructor(
    private readonly breValidationService: BreValidationService,
    private readonly uiConfigService: UiConfigService
  ) {}

  ngOnInit(): void {
    this.initialFields = JSON.parse(JSON.stringify(this.uiFields));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const uiFieldChange = changes["uiFields"];
    if (uiFieldChange?.previousValue !== uiFieldChange?.currentValue) {
      this.initialFields = JSON.parse(JSON.stringify(this.uiFields));
    }
  }
  
  toggleEdit(): void {
    this.enableEdit = !this.enableEdit;
  }

  cancelEdit(): void {
    this.enableEdit = false;
    this.uiFields = JSON.parse(JSON.stringify(this.initialFields));
  }

  save(): void {
    const currentFormData = this.uiConfigService.extractData(this.uiFields);
    const { currentForm, isValid } = this.breValidationService.validateForm(
      this.uiFields,
      currentFormData,
      this.uiFieldsMap
    );
    this.breValidationService.setFormData(this.uiFieldKey, currentForm);

    this.uiFields = currentForm;
    
    if (isValid) {
      this.saveSubsection.emit();
      this.enableEdit = false;
    }
  }

  getIcon(decision: string): string {
    if (!decision?.length) {
      return null;
    }
    let icon = failed;
    if (decision) {
      switch (decision.toLowerCase()) {
        case "pass":
          icon = pass;
          break;
        case "fail":
          icon = failed;
          break;
        default:
          icon = deviation;
      }
    }
    return icon;
  }
}
