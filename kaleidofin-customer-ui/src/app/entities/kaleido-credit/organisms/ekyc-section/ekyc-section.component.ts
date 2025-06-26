import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { SECTION_INFORMATION } from "src/app/constants/ui-config";
import { KYCResponseObject } from "./ekyc.constants";
import { getProperty } from "src/app/utils/app.utils";
@Component({
  selector: "app-ekyc-section",
  templateUrl: "./ekyc-section.component.html",
  styleUrls: ["./ekyc-section.component.scss"],
})
export class EkycSectionComponent implements OnInit {
  @Input() loanId: number = null;
  panelOpenState: boolean = false;

  applicantKycData: KYCResponseObject = {};
  coApplicantKycData: Array<KYCResponseObject> = [];
  constructor(private readonly uiConfigService: UiConfigService) {}

  ngOnInit(): void {
    this.getKycData();
  }

  getKycData(): void {
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.EKYC_INFO.sectionKey,
        this.loanId
      )
      .subscribe((response) => {
        const kycData: Array<any> = getProperty(response, "subSections", []);
        this.applicantKycData = getProperty(kycData, "[0]", {});
        const coApplicantKyc = getProperty(kycData, "[1]", {});
        this.coApplicantKycData = getProperty(
          coApplicantKyc,
          "subSections",
          []
        );
      });
  }
}
