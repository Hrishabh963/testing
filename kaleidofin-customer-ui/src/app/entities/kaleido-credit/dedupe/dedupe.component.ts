import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { get } from "lodash";
import { KcreditLoanDetailsModel } from "../loan/kcredit-loanDetails.model";
import { DedupeData } from "./dedupe.models";

@Component({
  selector: "app-dedupe",
  templateUrl: "./dedupe.component.html",
})
export class DedupesComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel = undefined;
  @Input() applicantKycDetailList = [];
  @Input() coApplicationKycList = [];

  dedupeData: Array<any> = [];
  disableDedupe: boolean = true;

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.disableDedupe = data["dedupe"];
    });
    if (this.loanDetails) {
      const customerNumber = get(
        this.loanDetails,
        "loanApplicationDTO.customerNumber",
        ""
      );
      const customerDTO = get(this.loanDetails, "customerDTO", "");
      const loanApplicationDTO = get(
        this.loanDetails,
        "loanApplicationDTO",
        ""
      );
      const bankDto = get(this.loanDetails, "bankDetail", {});
      this.dedupeData.push(
        new DedupeData(customerNumber, "Applicant", "APPLICANT", {
          ...loanApplicationDTO,
          ...customerDTO,
          accountNum: bankDto?.bankAccountNum ?? null,
          kycDocuments: this.applicantKycDetailList
        })
      );

      let loanObligators = get(this.loanDetails, "loanObligatorDTOList", []);
      let idNoMap = this.createIdNoMap(this.coApplicationKycList);
      loanObligators = this.addIdNoToLoanObligatorList(loanObligators, idNoMap);
      let obligators = loanObligators.map(
        (loanObligator, index) =>
          new DedupeData(
            loanObligator.id,
            `Co Applicant - ${index + 1}`,
            "CO_APPLICANT",
            {
              ...loanApplicationDTO,
              ...loanObligator,
              ...loanObligator["addressDTO"],
            }
          )
      );
      this.dedupeData = this.dedupeData.concat(obligators);
    }
  }

  createIdNoMap(coapplicantKycDetailsList: Array<any> = []) {
    let idNoMap = {};
    coapplicantKycDetailsList.forEach((kycDetail) => {
      if (!idNoMap[kycDetail.entityId]) {
        idNoMap[kycDetail.entityId] = { poiNumber: null, poaNumber: null };
      }
      if (kycDetail.purpose === "POI") {
        idNoMap[kycDetail.entityId].poiNumber = kycDetail.idNo;
      } else if (kycDetail.purpose === "POA") {
        idNoMap[kycDetail.entityId].poaNumber = kycDetail.idNo;
      }
    });

    return idNoMap;
  }

  addIdNoToLoanObligatorList(
    obligatorList: Array<any> = [],
    idNoMap: Object = {}
  ) {
    return obligatorList.map((loanObligator) => {
      const idValues = idNoMap[loanObligator["id"]];
      return { ...loanObligator, ...idValues };
    });
  }
}
