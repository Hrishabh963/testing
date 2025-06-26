import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { SECTION_INFORMATION } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-dedupe-info",
  templateUrl: "./dedupe-info.component.html",
})
export class DedupeInfoComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;

  applicantDedupe: any = {};
  coApplicantDedupe: any[] = [];
  guarantorDedupe: any[] = [];

  uiFieldMap: Array<any> = [];

  constructor(private readonly uiConfigService: UiConfigService) {}

  ngOnInit(): void {
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.DEDUPE.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          const dedupeInfo = getProperty(response, "subSections", []);
          this.applicantDedupe = this.extractData(dedupeInfo, "applicant");
          this.coApplicantDedupe = this.extractSubSections(
            dedupeInfo,
            "coapplicant"
          );
          this.guarantorDedupe = this.extractSubSections(
            dedupeInfo,
            "guarantor"
          );
        },
        (error) => console.error(error)
      );

    this.getUiFields();
  }

  extractData(dedupeInfo: any[], title: string): any {
    return (
      dedupeInfo.find(
        (info) => getProperty(info, "title", "").toLowerCase() === title
      )?.fields || {}
    );
  }

  extractSubSections(dedupeInfo: any[], title: string): any[] {
    return (
      dedupeInfo.find(
        (info) => getProperty(info, "title", "").toLowerCase() === title
      )?.subSections || []
    );
  }

  toggleEditDetails(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  getUiFields(): void {
    this.uiConfigService
      .getUiConfigBySection(SECTION_INFORMATION.DEDUPE.sectionKey)
      .subscribe((response: any = {}) => {
        this.uiFieldMap = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.DEDUPE.sectionKey,
          true
        );
        this.uiFieldMap = getProperty(this.uiFieldMap, "uiFieldsMap", []);
      });
  }
}
