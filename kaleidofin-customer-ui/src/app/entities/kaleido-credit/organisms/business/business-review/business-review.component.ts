import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { get } from "lodash";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { getProperty } from "src/app/utils/app.utils";
import { getBusinessReviewPopupConstant } from "../../../report/ki-credit-popup-constants";
import { BusinessInvoiceService } from "../../../services/business-invoice/business-invoice.service";
import { DocumentsService } from "../../../services/documents.service";
import { LoanApplicationSearchFilterService } from "../../../services/loan-application-search-filter.service";
import { UiConfigService } from "../../../services/ui-config.service";
import { BusinessReviewApprovePopupComponent } from "../../business-review-popups/business-review-approve-popup/business-review-approve-popup.component";

const VALUE_MAP = {
  businessName: "businessDetailsDTO.businessName",
  businessCategory: "businessDetailsDTO.businessCategory",
  businessKRA:
    "documents['Kyc Details'].KRACertificate[0].customerDocumentAdditionalData.businessKraNumber",
  businessId: "businessDetailsDTO.businessName",
  mobileNumber: "businessDetailsDTO.businessMobileNumber",
  location: "tenantAddressDTO.city",
};

@Component({
  selector: "app-business-review",
  templateUrl: "./business-review.component.html",
  styleUrls: [
    "./business-review.component.scss",
    "../../../molecules/business-invoice-discount/business-review-details.scss",
  ],
})
export class BusinessReviewComponent implements OnInit {
  sections = {};
  rejectReasons: Array<any> = [];
  readonly objectKeys = Object.keys;

  navSectionList: any = {};
  navSectionMoreList: any = {};
  showMoreButton: boolean = false;
  businessId: number = null;
  businessReviewDetails = null;

  modalRef: NgbModalRef;

  disableReviewButton: boolean = false;

  disableApprove: boolean = false;
  disableEvaluation: boolean = false;

  scrollTo(section: string) {
    const heading: HTMLHeadingElement = document.getElementById(
      section
    ) as HTMLHeadingElement;
    heading.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.scrollY > 300) {
      const stickyElement = document.getElementById(
        "business-review-sticky-header"
      );
      if (stickyElement) {
        stickyElement.classList.add("sticky");
      }
    } else {
      const stickyElement = document.getElementById(
        "business-review-sticky-header"
      );
      if (stickyElement) {
        stickyElement.classList.remove("sticky");
      }
    }
  }

  constructor(
    private readonly principalService: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly uiConfigService: UiConfigService,
    private readonly route: ActivatedRoute,
    private readonly businessService: BusinessInvoiceService,
    private readonly loanFilterService: LoanApplicationSearchFilterService,
    private readonly documentService: DocumentsService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.params["id"];

    this.principalService.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
      this.fetchLoanSections();
      this.fetchReviewInformation();
    });

    this.getRejectReason(this.businessId);
    this.businessService.businessReviewInfo.subscribe((reviewInfo) => {
      this.businessReviewDetails = reviewInfo;
      let status = getProperty(
        this.businessReviewDetails,
        "tenantCustomerDTO.reviewStatus",
        null
      );

      this.disableApprove = [
        "AGREEMENT_PENDING",
        "APPROVED",
        "REJECTED",
        "CANCELLED",
      ].includes(status);
      this.disableEvaluation = [
        "AGREEMENT_PENDING",
        "APPROVED",
        "REJECTED",
        "CANCELLED",
      ].includes(status);
      this.businessService.updateDefaultRejectedSections();
    });
  }

  fetchReviewInformation() {
    this.businessService.fetchBusinessReviewInformation(this.businessId);
  }

  fetchLoanSections() {
    this.uiConfigService
      .getUiConfigBySection("LOAN_REVIEW_SECTIONS", "LOAN_REVIEW")
      .subscribe(
        (sections: any) => {
          const configs = JSON.parse(get(sections, "[0].uiConfigurations", {}));
          this.sections = get(JSON.parse(configs), "sections", {});

          this.updateLoanDetailDocumentSections();
        },
        (error) => console.error(error)
      );
  }

  updateLoanDetailDocumentSections() {
    let tempSections = {};
    for (const key in this.sections) {
      const showInUi = get(this.sections[key], "showInUi", true);
      if (showInUi) {
        tempSections[key] = this.sections[key];
      }
    }

    this.sections = tempSections;
    this.getNavSections(this.sections);
  }

  getNavSections(sections: any = {}): void {
    const navSections: any = Object.fromEntries(
      Object.entries(sections).filter((value: any) => {
        return value[1].showInNav === true;
      })
    );

    if (Object.keys(navSections).length > 8) {
      const firstEnteries: any = Object.entries(navSections).slice(0, 7);
      const lastEnteries: any = Object.entries(navSections).slice(7);
      this.navSectionList = Object.fromEntries(firstEnteries);
      this.navSectionMoreList = Object.fromEntries(lastEnteries);
      this.showMoreButton = true;
    } else {
      this.navSectionList = navSections;
    }
  }

  getRejectReason(loanId: any): void {
    this.loanFilterService
      .fetchFilterData(["BUSINESS_APPLICATION_REJECTION_REASON"], loanId)
      .subscribe(
        (response) => {
          this.documentService.businessApplicationRejectionReasons =
            getProperty(response, "BUSINESS_APPLICATION_REJECTION_REASON", []);
        },
        () => {}
      );
  }

  handleEvaluateBusiness() {
    let status = getProperty(
      this.businessReviewDetails,
      "tenantCustomerDTO.reviewStatus",
      null
    );

    this.dialog
      .open(BusinessReviewApprovePopupComponent, {
        minWidth: "50vw",
        data: {
          ...getBusinessReviewPopupConstant(status),
          rejectReasons:
            this.documentService.businessApplicationRejectionReasons,
          title: `Are you sure you want to evaluate this  ${
            status.includes("AGREEMENT") ? "agreement" : "business profile"
          }?`,
          defaultRejectedSections:
            this.businessService.defaultRejectedSections.getValue(),
        },
      })
      .afterClosed()
      .subscribe((reviewResponse: any): any => {
        if (get(reviewResponse, "type", "") === "confirm")
          this.approveOrRejectBusiness(reviewResponse);
      });
  }

  handleApproveBusiness() {
    const status: string = get(
      this.businessReviewDetails,
      "tenantCustomerDTO.reviewStatus",
      ""
    );
    this.dialog
      .open(BusinessReviewApprovePopupComponent, {
        minWidth: "45vw",
        data: {
          isRemarksMandatory: false,
          rejectOptions: [],
          rejectReasons: [],
          rejectionType: "approve",
          title: `Are you sure you want to approve this ${
            status.includes("AGREEMENT") ? "agreement" : "business profile"
          }?`,
        },
      })
      .afterClosed()
      .subscribe((reviewResponse: any): any => {
        if (get(reviewResponse, "type", "") === "confirm")
          this.approveOrRejectBusiness({
            ...reviewResponse,
            rejectionType:
              status === "AGREEMENT_RECEIVED"
                ? "APPROVED"
                : "AGREEMENT_PENDING",
          });
      });
  }

  getValue(key = "") {
    return getProperty(this.businessReviewDetails, VALUE_MAP[key], "--");
  }

  approveOrRejectBusiness(reviewResponse: any = {}) {
    const status = getProperty(reviewResponse, "rejectionType", "");
    const reviewRemarks = getProperty(reviewResponse, "remarks", "");
    const discrepencies = getProperty(reviewResponse, "discrepencies", []);
    this.businessService
      .approveOrRejectBusiness(
        [this.businessId],
        status,
        reviewRemarks,
        discrepencies
      )
      .subscribe(() => {
        this.router.navigate(["/business/onboarding"]);
      });
  }

  getBusinessKra() {
    let documents = get(this.businessReviewDetails, "documents");
    console.log(documents);
    return get(this.businessReviewDetails, "", "--");
  }
}
