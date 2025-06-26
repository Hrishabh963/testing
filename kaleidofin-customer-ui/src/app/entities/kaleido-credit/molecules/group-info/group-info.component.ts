import { Input, Component, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { getProperty } from "src/app/utils/app.utils";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { KGroupInfoDetails } from "./group-info.model";

@Component({
  selector: "group-info-details",
  templateUrl: "./group-info.html",
  styleUrls: ['group-info.scss']
})

export class GroupInfoComponent implements OnInit {
  @Input() groupInfo: KGroupInfoDetails;
  @Input() loanId: any = undefined;
  constructor(private readonly uiConfigService: UiConfigService) { }

  uiFields: any = {};
  uiFieldsMap = [];
  tableData = [];

  ngOnInit(): void {

    this.uiConfigService
      .getUiInformationBySections("LOAN_GROUP", this.loanId)
      .subscribe(
        (response: any) => {
          this.uiFields = getProperty(response, "fields", {});
          this.tableData = getProperty(response, "fields.commonGroupDetails.value")
        },
        (error) => console.error(error)
      );
    this.uiConfigService.getUiConfig(UI_COMPONENTS.LOAN_REVIEW).subscribe(
      (response) => {
        const sectionConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          "LOAN_GROUP",
          true
        );
        this.uiFieldsMap = getProperty(sectionConfig, "uiFieldsMap", []);
      },
      (error) => console.error(error)
    );
  }
}