import { Input, Component, OnInit } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../../loan/kcredit-loanDetails.model";
import { UiConfigService } from "../../../services/ui-config.service";
import { getProperty } from "src/app/utils/app.utils";
import { UI_COMPONENTS } from "src/app/constants/ui-config";

@Component({
  selector: "app-applicant-details",
  templateUrl: "./applicant-details.component.html",
  styleUrls: [
    "../../review-section-fields.scss",
  ],
})
export class ApplicantDetailsComponent implements OnInit {
  @Input() data;
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() editSections: boolean = true;
  @Input() showEditButton: boolean = false;
  constructor(private readonly uiConfigService: UiConfigService) {}

  uiFields: any = {};
  uiFieldsMap = [];
  readonly uiApiKey = "BORROWER_DETAILS"


  ngOnInit(): void {
    this.data.forEach((data)=>{
      this.uiFields = getProperty(data,"fields",{});
    })
    console.log(this.uiFields);
    this.uiConfigService.getUiConfig(UI_COMPONENTS.LOAN_REVIEW).subscribe(
      (response) => {
        const sectionConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          "APPLICANT_DETAILS",
          true
        );
        this.uiFieldsMap = getProperty(sectionConfig, "uiFieldsMap", []);
      },
      (error) => console.error(error)
    );
  }
}
