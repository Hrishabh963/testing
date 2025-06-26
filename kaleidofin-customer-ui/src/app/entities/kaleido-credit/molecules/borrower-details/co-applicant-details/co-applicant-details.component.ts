import { Component, Input } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "../../../services/ui-config.service";
import { KcreditLoanDetailsModel } from "../../../loan/kcredit-loanDetails.model";
import { UI_COMPONENTS } from "src/app/constants/ui-config";

@Component({
  selector: "app-co-applicant",
  templateUrl: "./co-applicant-details.component.html",
  styleUrls: [
    "../../review-section-fields.scss",
  ],
})
export class CoApplicantComponent {
  @Input() title: string = "";
  @Input() data;
  @Input() index: number = 0;
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() editSections: boolean = true;
  @Input() payloadTypeKey: string = "";
  @Input() uiConfigKey: string = "";
  @Input() showEditButton: boolean = false;
  constructor(private uiConfigService: UiConfigService) {}

  uiFields: any = {};
  uiFieldsMap = [];
  uiApikey = "BORROWER_DETAILS";

  ngOnInit(): void {
    this.uiFields = getProperty(this.data, `fields`, {});
    this.uiConfigService.getUiConfig(UI_COMPONENTS.LOAN_REVIEW).subscribe(
      (response) => {
        const sectionConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          this.uiConfigKey,
          true
        );

        this.uiFieldsMap = getProperty(sectionConfig, "uiFieldsMap", []);
      },
      (error) => console.error(error)
    );
  }
}
