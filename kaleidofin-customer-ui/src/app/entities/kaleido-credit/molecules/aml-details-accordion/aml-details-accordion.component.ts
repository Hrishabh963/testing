import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { AML } from "../../services/anti-money-laundering/anti-money-laundering.constants";

const match = "assets/images/aml/match.svg";
const noMatch = "assets/images/aml/no-match.svg";
const error = "assets/images/common/error.svg";

@Component({
  selector: "app-aml-details-accordion",
  templateUrl: "./aml-details-accordion.component.html",
  styleUrls: ["./aml-details-accordion.component.scss"],
})
export class AmlDetailsAccordionComponent implements OnInit {
  @Input() AMLDetail: any = {};
  @Input() loanApplicationId: any = "";
  @Input() branchCode: any = "";
  @Output() refreshAmlData: EventEmitter<any> = new EventEmitter<any>();
  @Output() initiateAml: EventEmitter<any> = new EventEmitter<any>();

  nameLabel: string = "";
  hasMatch: boolean = false;
  panelState: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.nameLabel =
      getProperty(this.AMLDetail, "type", "Applicant").toLowerCase() ===
      "applicant"
        ? "Applicant Name"
        : "Co-Applicant Name";
    this.hasMatch =
      getProperty(this.AMLDetail, "matchStatus", "").toLowerCase() !==
      "no match";
  }

  fetchDisplayIcon(amlStatus: AML): string {
    if (amlStatus?.error) {
      return error;
    }

    if (amlStatus?.matchStatus?.toLowerCase() === "no match") {
      return noMatch;
    }
    return match;
  }

  getMatchStatus(amlstatus: AML): string {
    if (amlstatus?.error) {
      return "Error";
    }
    return amlstatus?.matchStatus ?? "--";
  }

  showRefreshButton(): boolean {
    const status: string = getProperty(this.AMLDetail, "status", "failed");
    return status.toLowerCase() === "in progress";
  }

  getMatchClass(amlStatus: AML): string {
    if (amlStatus?.error) {
      return "error";
    }
    if (!amlStatus?.matchStatus?.length) {
      return "";
    }
    return amlStatus.matchStatus?.toLowerCase() === "no match"
      ? "no-match"
      : "match";
  }

  retryAml(event: Event): void {
    event.stopPropagation();
    const payload: any = {};
    payload.name = getProperty(this.AMLDetail, "name", "");
    payload.yearOfBirth = getProperty(this.AMLDetail, "yearOfBirth", "");
    payload.type = getProperty(this.AMLDetail, "type", "");
    payload.loanApplicationId = this.loanApplicationId;
    this.initiateAml.emit(payload);
  }

  refreshAml(): void {
    this.refreshAmlData.emit();
  }
}
