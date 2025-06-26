import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { SECTION_INFORMATION } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-nominee-details",
  templateUrl: "./nominee-details.component.html"
})
export class NomineeDetailsComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  panelOpenState: boolean = true;

  uiFields: any = {};
  initialNomineeInfo: any = {};
  uiFieldsMap: any[] = [];

  constructor(private readonly uiConfigService: UiConfigService) {}

  ngOnInit(): void {
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.NOMINEE_DETAILS.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          let sections = getProperty(response, "subSections", []);
          this.uiFields = sections;
          this.initialNomineeInfo = JSON.parse(JSON.stringify(sections));
        },
        (error) => console.error(error)
      );
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.NOMINEE_DETAILS.sectionKey)
      .subscribe((response: any = {}) => {
        const map: any = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.NOMINEE_DETAILS.sectionKey,
          true
        );
        this.uiFieldsMap = getProperty(map, "uiFieldsMap", []);
      });
  }
}
