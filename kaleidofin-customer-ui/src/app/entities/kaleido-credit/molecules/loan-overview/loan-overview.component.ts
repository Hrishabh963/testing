import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { get, set } from "lodash";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { determineStatus, getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "../../services/ui-config.service";

@Component({
  selector: "app-loan-overview",
  templateUrl: "./loan-overview.component.html",
  styleUrls: [
    "./loan-overview.component.scss",
    "../review-section-fields.scss",
  ],
})
export class LoanOverviewComponent implements OnInit, OnChanges {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;
  @Input() workflow: string = "";
  loanStatus: string = "";
  constructor(
    private readonly uiConfigService: UiConfigService,
  ) {}

  uiFields: any = {};
  uiFieldsMap = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["workflow"].previousValue !== changes["workflow"].currentValue
    ) {
      this.workflow = changes["workflow"].currentValue;
      this.updateLoanStatus();
    }
  }
  updateLoanStatus() {
    let newStatus = determineStatus(this.loanStatus, this.workflow);
    set(this.uiFields, "loanStatus.value", newStatus);
  }

  ngOnInit(): void {
    this.uiConfigService
      .getUiInformationBySections("LOAN_OVERVIEW", this.loanId)
      .subscribe(
        (response: any) => {
          this.uiFields = getProperty(response, "subSections[0].fields", {});
          this.loanStatus = get(this.uiFields, "loanStatus.value", "");
          this.updateLoanStatus();
        },
        (error) => console.error(error)
      );
    this.uiConfigService.getUiConfig(UI_COMPONENTS.LOAN_REVIEW).subscribe(
      (response) => {
        const sectionConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          "LOAN_OVERVIEW_SECTION",
          true
        );

        this.uiFieldsMap = getProperty(sectionConfig, "uiFieldsMap", []);
      },
      (error) => console.error(error)
    );
  }
}
