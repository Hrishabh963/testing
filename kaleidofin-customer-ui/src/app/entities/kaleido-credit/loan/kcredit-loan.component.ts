import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { HttpResponse } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { Customer } from "../../customer/customer.model";
import { Address } from "../models/customer/address.model";
import {
  CoApplicantKycDetail,
  KycDetails,
  KycDetailsForLoan,
} from "../models/kyc-details.model";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { get } from "lodash";
import { Subscription } from "rxjs";
import { PrincipalService } from "src/app/core";
import { groupObjects } from "src/app/shared/util/loan-application-documents-utils";
import { getProperty } from "src/app/utils/app.utils";
import { DashboardService } from "../../dashboard/dashboard.service";
import { AUTHORITES } from "../constants/authorization.constants";
import { DedupeService } from "../dedupe/dedupe.service";
import { KcreditInterDataService } from "../kcredit-inter-data.service";
import { AssociateLender } from "../models/associate-lender.model";
import { DedupeEntityType } from "../models/kcredit-enum.model";
import { BreResultPopupComponent } from "../molecules/bre-result-popup/bre-result-popup.component";
import { RecalculateBrePopupComponent } from "../molecules/recalculate-bre-popup/recalculate-bre-popup.component";
import { LoanApplicationReviewAcceptDialogComponent } from "../report/kcredit-confirmation-accept-dialog";
import { LoanApplicationReviewDialogComponent } from "../report/kcredit-confirmation-dialog";
import { LoanApplicationReviewRejectDialogComponent } from "../report/kcredit-confirmation-reject-dialog";
import { KCreditLoanApplication } from "../report/kcredit-loan-application.model";
import { LoanReviewPopupService } from "../report/kcredit-popup-service";
import { LoanReviewService } from "../report/loan-review.service";
import { AmlService } from "../services/anti-money-laundering/anti-money-laundering.service";
import { AssociateLenderService } from "../services/associate-lender/associate-lender.service";
import { AuthorizationService } from "../services/authorization.service";
import { BusinessRuleEngineService } from "../services/business-rule-engine/business-rule-engine.service";
import { SubscriptionReviewService } from "../services/customer-group/subscription-review/subscription-review.service";
import { DocumentsService } from "../services/documents.service";
import { LoanApplicationSearchFilterService } from "../services/loan-application-search-filter.service";
import { NotificationsService } from "../services/notifications.service";
import { BreStatusResponse } from "../services/recalculate-bre/bre.constants";
import { RecalculateBreService } from "../services/recalculate-bre/recalculate-bre.service";
import { UiConfigService } from "../services/ui-config.service";
import { DedupeData } from "./components/dedupe/models/dedupe-data.model";
import { LoanApprovalConfirmationPopupComponent } from "./components/loan-approval-confirmation-popup/loan-approval-confirmation-popup.component";
import { ApplicationStatus, Errors, ObligatorTypes } from "./constant";
import { KcreditLoanService } from "./kcredit-loan.service";
import { KcreditLoanDetailsModel } from "./kcredit-loanDetails.model";
import {
  CoapplicantLoanApplicationDocumentDTO,
  LoanApplicationDocumentDTO,
  LoanApplicationDocumentDTOList,
} from "../models/loan-application-document.model";
import { MandatoryFieldValidationService } from "../services/mandatory-field-validation/mandatory-field-validation.service";
import { DependableFieldValidationService } from "../dependable-field-validation.service";

@Component({
  selector: "jhi-kcredit-loan",
  templateUrl: "./kcredit-loan.component.html",
  styleUrls: ["./kcredit-loan.css"],
  animations: [
    trigger("fade", [
      state("void", style({ opacity: 0 })),
      transition(":enter", [animate(300)]),
      transition(":leave", [animate(500)]),
    ]),
  ],
})
export class KCreditLoanComponent implements OnInit, OnDestroy, AfterViewInit {
  objectKeys = Object.keys;
  LoanDetailSections = {};
  readonly errorConstants = Errors;
  modalRef: NgbModalRef;
  loanDetails: KcreditLoanDetailsModel;
  error: boolean;
  currentSection: string;
  kycDetailsList: Array<KycDetailsForLoan> = [];
  coApplicantKYCDetailsList: CoApplicantKycDetail[];
  loanApplicationDocumentDTOs: LoanApplicationDocumentDTOList = {};
  loanApplicationDocumentList: LoanApplicationDocumentDTO[] = [];
  coApplicantLoanApplicationDocumentList: CoapplicantLoanApplicationDocumentDTO[] =
    [];

  addressList: Address[];

  customer: Customer;
  disableApprove: boolean;

  disableKiScoreApprove: boolean;
  loanApplication: KCreditLoanApplication;
  jlgSizeMinimumReject: boolean = false;
  readonly ObligatorTypes = ObligatorTypes;
  associateLenderList: AssociateLender[];
  public coApplicants: any[] = [];
  applicantDedupeData: DedupeData = new DedupeData();
  coApplicantDedupeData: DedupeData = new DedupeData();
  dedupeDataMap: any = new Map();
  notificationMessage: string = "";
  notificationCount: number = 0;

  breData: BreStatusResponse = {};
  disableOnLoanEntry: boolean = false;

  categorizedLoanApplicationDocumentList: any = {};
  enableLoanReportDownload: boolean = false;
  enableLoanApprovalButton: boolean = true;

  dedupeLoans: Array<any> = [];
  loanReviewSections: any = {};
  enableDownloadReports: boolean = false;
  authority: any = {};
  fromEntry: boolean = false;
  navSectionList: any = {};
  navSectionMoreList: any = {};
  showMoreButton: boolean = false;
  loanId: number = null;
  rejectReasons: Array<any> = [];
  enableRejectButton: boolean = false;
  enableApproveButton: boolean = false;
  isDcbLender: boolean = false;
  isDcbMfiLender: boolean = false;
  isDCB: boolean = false;
  validateEditAccess: boolean = false;
  recalculationTriggered: boolean = false;
  isRecalculationInProgress: boolean = false;
  breSubscriptions: Subscription[] = [];
  isBreNeeded: boolean = false;
  startViewObservation: boolean = false;
  missingMandatoryFields: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly loanReviewPopupService: LoanReviewPopupService,
    private readonly loanApplicationReviewService: LoanReviewService,
    private readonly customerReviewService: SubscriptionReviewService,
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly snackBar: MatSnackBar,
    private readonly kcreditInterDataService: KcreditInterDataService,
    private readonly principal: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly dialog: MatDialog,
    private readonly dedupeService: DedupeService,
    private readonly uiConfigService: UiConfigService,
    private readonly breService: BusinessRuleEngineService,
    private readonly amlService: AmlService,
    private readonly authorizationService: AuthorizationService,
    private readonly loanFilterService: LoanApplicationSearchFilterService,
    private readonly _location: Location,
    private readonly documentService: DocumentsService,
    private readonly notificationsService: NotificationsService,
    private readonly recalculateBreService: RecalculateBreService,
    private readonly MandatoryFieldService: MandatoryFieldValidationService,
    private readonly dependableFieldValidation: DependableFieldValidationService
  ) {
    this.error = true;
    this.disableApprove = false;
    this.disableKiScoreApprove = false;
    this.currentSection = "section1";
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollTo(sessionStorage.getItem("currentSection") || "");
      this.startViewObservation = this.isDCB;
    }, 5500);
  }

  validateSectionVisibility(section = {}, sectionKey = "") {
    return section[sectionKey]
      ? get(Object.keys(section[sectionKey]), "length", 0) > 0
      : false;
  }

  updateLoanDetailDocumentSections() {
    let tempSections = {};
    for (const key in this.loanReviewSections) {
      const showInUi = get(this.loanReviewSections[key], "showInUi", true);
      if (showInUi) {
        if (key === "groupInfo") {
          if (this.loanApplication?.loanType === "ILGG" || this.loanApplication?.loanType === "JLG") {
            tempSections[key] = this.loanReviewSections[key];
          }
        } else {
          tempSections[key] = this.loanReviewSections[key];
        }
      }
    }

    this.LoanDetailSections = tempSections;
    this.getNavSections(this.LoanDetailSections);
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  saveProfileChange(event) {
    debugger;
  }

  scrollTo(section: string) {
    if (!section?.length) {
      return;
    }
    const heading: HTMLHeadingElement = document.getElementById(
      section
    ) as HTMLHeadingElement;
    if (heading) {
      heading.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!this.isDCB) {
        this.currentSection = section;
      }
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.scrollY > 300) {
      const stickyElement = document.getElementById("make-it-stick");
      if (stickyElement) {
        stickyElement.classList.add("sticky");
      }
    } else {
      const stickyElement = document.getElementById("make-it-stick");
      if (stickyElement) {
        stickyElement.classList.remove("sticky");
      }
    }
  }
  updateAuthorities() {
    if (this.fromEntry) {
      this.authority["viewComment"] = this.authorizationService.hasAuthority(
        AUTHORITES.LOANENTRY_UNDERWRITINGSCREEN_VIEWCOMMENTSHISTORY
      );
      this.authority["updateComment"] = this.authorizationService.hasAuthority(
        AUTHORITES.LOANENTRY_UNDERWRITINGSCREEN_COMMENT
      );
      this.disableOnLoanEntry = true;
    } else {
      this.authority["viewComment"] =
        this.authorizationService.hasAuthorityByStage(
          AUTHORITES.UNDERWRITINGSCREEN_VIEWCOMMENTSHISTORY,
          this.loanApplicationReviewService.getLoanStatus()
        );
      this.authority["updateComment"] =
        this.authorizationService.hasAuthorityByStage(
          AUTHORITES.UNDERWRITINGSCREEN_COMMENT,
          this.loanApplicationReviewService.getLoanStatus()
        );
      this.authority["recalculateBre"] =
        this.authorizationService.hasAuthorityByStage(
          AUTHORITES.UNDERWRITINGSCREEN_RECALCULATEBRE,
          this.loanApplicationReviewService.getLoanStatus()
        ) &&
        [ApplicationStatus.externalpending, ApplicationStatus.pending].includes(
          this.loanApplicationReviewService.getLoanStatus()
        );
      this.authority["downloadCams"] =
        this.authorizationService.hasAuthorityByStage(
          AUTHORITES.UNDERWRITINGSCREEN_DOWNLOADCAMOTHERS,
          this.loanApplicationReviewService.getLoanStatus()
        );

      this.validateEditAccess = this.authorizationService.validateEditAccess(
        AUTHORITES.APPROVE_REJECT_LOANS
      );
      this.authority["downloadReportView"] = AUTHORITES.DOWNLOADLOANAPPDOCS;
    }
  }

  async ngOnInit() {
    this.principal.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
    });
    this.loanId = this.route.snapshot.params["id"];
    this.isDcbLender = (
      this.associateLenderService.getLenderCode() || ""
    ).includes("DCB");
    this.isDCB =
      this.associateLenderService.getLenderCode().toUpperCase() === "DCB";
    this.isDcbMfiLender =
      this.associateLenderService.getLenderCode().toUpperCase() === "DCBMFI";
    this.enableLoanReportDownload =
      this.associateLenderService.enableDownloadReports;
    await this.getLoanReviewInfo();
    this.uiConfigService.getApprovalButtonChecks().subscribe((response) => {
      const enableEditSections: boolean = get(response, "hasEditAccess", false);
      this.enableRejectButton = getProperty(
        response,
        "evaluateButton.enabled",
        false
      );
      this.enableApproveButton = getProperty(
        response,
        "approveButton.enabled",
        false
      );
      this.authority["editSections"] =
        enableEditSections &&
        this.authorizationService.hasAuthorityByStage(
          AUTHORITES.UNDERWRITINGSCREEN_EDITSCREENDETAILS,
          this.loanApplicationReviewService.getLoanStatus()
        );
    });
    this.getRejectReason(this.loanId);
    this.breService.getBreResponse().subscribe(
      (response) => (this.breData = response),
      (error) => console.error(error)
    );
    let currentUrl: string = "";
    this.route.snapshot.url.forEach((url) => (currentUrl += url.path));
    this.fromEntry = currentUrl.includes("entry");
    this.breSubscriptions.push(
      this.recalculateBreService
        .getRecalculationTrigger()
        .subscribe((isTriggered: boolean) => {
          this.recalculationTriggered = isTriggered;
        })
    );
    this.breSubscriptions.push(
      this.recalculateBreService
        .getRecalculationInProgress()
        .subscribe((result: boolean) => {
          this.isRecalculationInProgress = result;
        })
    );
    this.MandatoryFieldService.getMandatoryFields().subscribe((fields) => {
      if (Object.keys(fields).length) {
        this.missingMandatoryFields = true;
      } else {
        this.missingMandatoryFields = false;
      }
    });
    this.breService.fetchDeviations(this.loanId);
  }

  ngOnDestroy(): void {
    this.recalculateBreService.setRecalculationTrigger(false);
    this.recalculateBreService.setProgressCalculated(0);
    this.recalculateBreService.intervalId = null;
    this.breSubscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    sessionStorage.removeItem("currentSection");
  }

  getLoanApplicationDocumentImages() {
    this.loanApplicationDocumentList = get(
      this.loanApplicationDocumentDTOs,
      "loanApplicationDocumentDTOList",
      []
    );
    this.coApplicantLoanApplicationDocumentList = get(
      this.loanApplicationDocumentDTOs,
      "coapplicantLoanApplicationDocumentDTOList",
      []
    );
    this.coApplicantLoanApplicationDocumentList = this
      .coApplicantLoanApplicationDocumentList
      ? this.coApplicantLoanApplicationDocumentList.map((doc) => ({
          ...doc,
          isCoApplicantDocument: true,
        }))
      : [];
  }

  loadDocumentProperties() {
    this.documentService.loadDocumentProperties();
  }
  initialSetup() {
    this.kcreditLoanService.setLoanDetails(this.loanDetails);
    this.addressList = this.loanDetails.addressDTOList;
    this.customer = this.loanDetails.customerDTO;

    this.disableApproveProcess();
    this.disableKiScoreRuleApproveProcess();

    if (this.kcreditInterDataService.getLoanReviewDedupe()) {
      this.setElementOrWait();
    }
    this.dedupeDataMap = new Map();
    this.setDedupeDataForApplicant();
    this.coApplicants = this.kcreditInterDataService.getCoApplicant(
      this.loanDetails
    );
    if (this.coApplicants && this.coApplicants.length > 0) {
      this.setDedupeDataForCoapplicant();
    }
    this.fetchDedupeLoans(this.loanDetails);
  }

  fetchLoanSections() {
    this.uiConfigService.getUiConfig("LOAN_REVIEW").subscribe(
      (response) => {
        if (getProperty(response, "length", 0)) {
          const sections = response.find(
            (config) =>
              getProperty(config, "sectionName", "") === "LOAN_REVIEW_SECTIONS"
          );
          const configs = JSON.parse(
            getProperty(sections, "uiConfigurations", {})
          );
          this.loanReviewSections = getProperty(
            JSON.parse(configs),
            "sections",
            {}
          );
          this.enableDownloadReports = getProperty(
            JSON.parse(configs),
            "enableDownloadReport",
            false
          );
          this.updateLoanDetailDocumentSections();
        }
      },
      (error) => console.error(error)
    );
  }

  fetchDedupeLoans(loanDetails: KcreditLoanDetailsModel) {
    const customerNumber = get(loanDetails, "customerDTO.customerNumber", null);
    this.dedupeService.fetchLoansByCustomerNumber(customerNumber).subscribe(
      (dedupeLoans) => {
        this.dedupeLoans = get(dedupeLoans, "loanApplicationDTOList") || [];
        const loanId = get(loanDetails, "loanApplicationDTO.id", null);
        this.dedupeLoans = this.dedupeLoans.filter(
          (loan) => loan.id !== loanId
        );
      },
      (error) => console.error(error)
    );
  }
  setDedupeDataForApplicant() {
    this.applicantDedupeData.applicantName = this.loanDetails.customerDTO.name;
    this.applicantDedupeData.loanAmount =
      this.loanDetails.loanApplicationDTO.loanAmount;
    this.applicantDedupeData.dateOfBirth =
      this.loanDetails.customerDTO.dateOfBirth;
    this.applicantDedupeData.address = this.loanDetails.customerDTO.address1;
    this.applicantDedupeData.dedupeEntityType = DedupeEntityType.applicant;
    this.applicantDedupeData.ucic = this.loanDetails.loanApplicationDTO.ucic;
    this.dedupeDataMap.set(
      DedupeEntityType.applicant,
      this.applicantDedupeData
    );
  }

  setDedupeDataForCoapplicant() {
    this.coApplicants.forEach((coApplicant, i) => {
      this.coApplicantDedupeData = new DedupeData();
      this.coApplicantDedupeData.coApplicantId = coApplicant.id;
      this.coApplicantDedupeData.loanAmount =
        this.loanDetails.loanApplicationDTO.loanAmount;
      this.coApplicantDedupeData.applicantName =
        this.loanDetails.customerDTO.name;
      this.coApplicantDedupeData.dateOfBirth = coApplicant.dateOfBirth;
      this.coApplicantDedupeData.dedupeEntityType =
        DedupeEntityType.co_applicant;
      this.coApplicantDedupeData.coApplicantNumber = i;
      this.coApplicantDedupeData.ucic = coApplicant.ucic;
      if (coApplicant.addressDTO)
        this.coApplicantDedupeData.address = coApplicant.addressDTO.address1;
      this.dedupeDataMap.set(
        DedupeEntityType.co_applicant + "_" + i,
        this.coApplicantDedupeData
      );
    });
  }

  setElementOrWait() {
    setTimeout(() => {
      let element = document.getElementById("dedupe");
      if (element == null) {
        this.setElementOrWait();
      } else {
        this.scrollTo("dedupe");
      }
    }, 500);
  }

  fetchImageForLoanDocuments(documentList: any = []) {
    if (!documentList) return;

    documentList.forEach((loanApp) => {
      if (loanApp.documentFileId) {
        this.handleLoanDocument(loanApp);
      }
    });
  }

  handleLoanDocument(loanApp: any) {
    this.customerReviewService
      .getFileURLFromFileId(loanApp.documentFileId)
      .subscribe((res) => {
        loanApp.fileUrl = res;
        this.customerReviewService
          .downloanFromS3(res)
          .subscribe((res: HttpResponse<Blob>) => {
            this.processBlobFile(loanApp, res.body);
          });
      });
  }

  processBlobFile(loanApp: any, blob: Blob) {
    const file = new Blob([blob]);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        loanApp.image = reader.result.split(",")[1];
      }
    };
    reader.readAsDataURL(file);
  }

  clear() {
    this.loanDetails = new KcreditLoanDetailsModel();
    this.router.navigate(["loans"]);
  }

  onSuccess(response: any[]) {
    if (!response?.length) {
      return;
    }
    const res: any = response[0];
    const status: string = getProperty(res, "status", null);
    if (status?.toLowerCase() === "failure") {
      const actionItems: string[] = getProperty(res?.error, "actionItems", []);
      const getUnderWritingRemarks = actionItems.some((item) => {
        return item === "GET_UNDERWRITING_REMARKS";
      });
      if (getUnderWritingRemarks) {
        this.dependableFieldValidation.loanStageCheck(
          this.loanId,
          this.loanDetails?.loanApplicationDTO?.applicationStatus
        );
      }
      const underWritingError =
        "Referral failed. Please check all mandatory fields before referring the application to the underwriter.";
      this.snackBar.open(underWritingError, "Error", { duration: 3000 });
    } else {
      this.updateStatus();
      this.router.navigate(["//kcredit/review"], {
        queryParams: {
          previousState: this.getPreviousStatus(
            this.loanDetails.loanApplicationDTO.applicationStatus
          ),
        },
        skipLocationChange: false,
        replaceUrl: false,
      });
    }
  }

  previousState() {
    this.router.navigate(["/loans"]);
  }

  confirmSubmit(
    status,
    reason: string = "",
    requiredDocuments: Array<any> = []
  ) {
    let checkedList = [];
    checkedList.push(this.loanDetails.loanApplicationDTO.id);
    this.loanApplicationReviewService
      .bulkStatusUpdate(
        checkedList,
        status,
        reason,
        [],
        false,
        requiredDocuments
      )
      .subscribe(
        (res) => {
          this.onSuccess(res);
        },
        (error) => this.onError(error)
      );
  }
  getPreviousStatus(applicationStatus: string): string {
    let previousState = "Review";
    if (
      applicationStatus == ApplicationStatus.pendingbooking ||
      applicationStatus == ApplicationStatus.externalpending ||
      applicationStatus == ApplicationStatus.booked
    ) {
      previousState = "Booking";
    } else if (
      applicationStatus == ApplicationStatus.pendingagreement ||
      applicationStatus == ApplicationStatus.approve
    ) {
      previousState = "Agreement";
    } else if (
      applicationStatus == ApplicationStatus.pendingdisbursal ||
      applicationStatus == ApplicationStatus.disbursed
    ) {
      previousState = "Disbursal";
    }
    return previousState;
  }
  updateStatus() {
    console.log("approved");
  }
  onError(res: any) {
    const errorMessage: string = getProperty(
      res.error,
      "message",
      "User has no authority to perform current operation"
    );
    this.snackBar.open(errorMessage, "Error", {
      duration: 3000,
    });
  }
  confirmReject(
    status: string = "",
    rejectionReason: string = "",
    actionRequired: string[] = [],
    requiredDocuments: any[] = []
  ) {
    let isReferred = false;
    let checkedList = [];
    checkedList.push(this.loanDetails.loanApplicationDTO.id);
    if (status === "refer") {
      status = "approve";
      isReferred = true;
    }
    this.loanApplicationReviewService
      .bulkStatusUpdate(
        checkedList,
        status,
        rejectionReason,
        actionRequired,
        isReferred,
        requiredDocuments
      )
      .subscribe(
        (res) => {
          this.onSuccess(res);
        },
        (res) => this.onError(res)
      );
  }

  private async getLoanReviewInfo() {
    try {
      let response: KycDetails = await this.kcreditLoanService
        .getKycDocuments(this.loanId)
        .toPromise();
      this.kycDetailsList = response?.kycDetailsList ?? [];
      this.coApplicantKYCDetailsList =
        response?.coapplicantKycDetailsList ?? [];
    } catch (error) {
      console.error(error);
    }
    this.kcreditLoanService
      .getLoanApplicationDocuments(this.loanId)
      .subscribe((res: LoanApplicationDocumentDTOList) => {
        this.loanApplicationDocumentDTOs = res;
        this.getLoanApplicationDocumentImages();
        this.categorizedLoanApplicationDocumentList = groupObjects([
          ...this.loanApplicationDocumentList,
          ...this.coApplicantLoanApplicationDocumentList,
        ]);
      });
    this.kcreditLoanService.getLoanApplicationInfo(this.loanId).subscribe(
      (response: KcreditLoanDetailsModel) => {
        this.loanDetails = response;
        this.loanApplication = getProperty(
          this.loanDetails,
          "loanApplicationDTO",
          {}
        );
        this.loanApplicationReviewService.setLoanDetailsData(this.loanDetails);
        this.isBreNeeded = this.loanDetails?.isBreNeeded ?? false;
        this.updateAuthorities();
        this.fetchLoanSections();
        this.loadDocumentProperties();
        const notifications: string = getProperty(
          this.loanDetails,
          "loanApplicationDTO.reviewNotification",
          ""
        );
        this.notificationsService.updateNotificationList(notifications);
        this.initialSetup();
        this.uiConfigService.checkApprovalButton(this.loanId);
      },
      (error) => {
        this.snackBar.open(
          getProperty(
            error,
            "error.message",
            "Unable to Open Loan Application"
          ),
          "",
          { duration: 5000 }
        );
        this._location.back();
        console.error(error);
      }
    );
  }

  reloadAfterSave(entity: string) {
    this.kcreditLoanService.getLoanApplicationInfo(this.loanId).subscribe(
      (res: KcreditLoanDetailsModel) => {
        this.successfulReload(res, entity);
      },
      (error) => {
        this.onError(error);
      }
    );
  }

  successfulReload(res: KcreditLoanDetailsModel, entity: string) {
    this.loanDetails = res;
    this.loanApplication = this.loanDetails?.loanApplicationDTO;
    this.customer = this.loanDetails?.customerDTO;
    this.customer["dateOfBirth"] = this.convertLocalDateFromServer(
      this.customer["dateOfBirth"]
    );
    this.snackBar.open("Successfully updated ", entity, {
      duration: 4000,
    });
  }

  convertLocalDateFromServer(date: string) {
    if (date !== undefined && date != null && typeof date === "string") {
      const split = date.split("-");
      const dateObj = {
        year: parseInt(split[0]),
        month: parseInt(split[1]),
        day: parseInt(split[2]),
      };
      return dateObj;
    } else {
      return undefined;
    }
  }

  openConfirmDialog(status) {
    let success = true;
    if (status === "conditionalapprove") {
      this.changeStatus(status, success);
    } else {
      if (
        this.loanDetails.loanApplicationDTO.currentGroupSize &&
        this.loanDetails.loanApplicationDTO.minJlgSize &&
        this.loanDetails.loanApplicationDTO.currentGroupSize - 1 <
          this.loanDetails.loanApplicationDTO.minJlgSize
      ) {
        this.jlgSizeMinimumReject = true;
      }
      let applicationStatus =
        this.loanDetails.loanApplicationDTO.applicationStatus;
      if (
        applicationStatus === ApplicationStatus.disbursed ||
        applicationStatus === ApplicationStatus.pendingdisbursal ||
        applicationStatus === ApplicationStatus.booked ||
        applicationStatus === ApplicationStatus.pendingbooking ||
        applicationStatus === ApplicationStatus.agreement
      ) {
        this.modalRef = this.loanReviewPopupService.open(
          <Component>LoanApplicationReviewAcceptDialogComponent,
          applicationStatus,
          0,
          0,
          false,
          0
        );
        this.modalRef.result.then(
          (result) => {
            if (result === "cancel") {
              console.log("cancel");
            } else if (result === "confirm") {
              this.modalRef = this.loanReviewPopupService.open(
                <Component>LoanApplicationReviewRejectDialogComponent,
                applicationStatus,
                0,
                0,
                false,
                this.jlgSizeMinimumReject === true ? 1 : 0,
                this.associateLenderService.getPopupConstant(applicationStatus),
                this.rejectReasons,
                "custom-reject-modal"
              );
              this.modalRef.result.then(
                (result) => {
                  if (result.event === "confirm") {
                    this.confirmReject(
                      result.rejectionType,
                      result.rejectionReason,
                      result.actionRequired,
                      result.requiredDocuments
                    );
                  }
                },
                (error) => {
                  console.error(error);
                }
              );
            }
          },
          (error) => {
            const a = false;
          }
        );
      } else {
        this.modalRef = this.loanReviewPopupService.open(
          <Component>LoanApplicationReviewRejectDialogComponent,
          applicationStatus,
          0,
          0,
          false,
          this.jlgSizeMinimumReject === true ? 1 : 0,
          this.associateLenderService.getPopupConstant(applicationStatus),
          this.rejectReasons,
          "custom-reject-modal"
        );
        this.modalRef.result.then(
          (result) => {
            if (result.event === "confirm") {
              console.log("confirm");
              this.confirmReject(
                result.rejectionType,
                result.rejectionReason,
                result.actionRequired,
                result.requiredDocuments
              );
            }
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  }

  openApprovalDialog(status: any, success: boolean): void {
    if (
      [ApplicationStatus.retry, ApplicationStatus.agreementretry].includes(
        get(this.loanDetails, "loanApplicationDTO.applicationStatus", "")
      )
    ) {
      this.dialog.open(LoanApprovalConfirmationPopupComponent, {
        width: "45vw",
        data: {
          loanId: get(this.loanDetails, "loanApplicationDTO.id", ""),
          documentType: "AdditionalDocument",
        },
      });
    } else {
      if (
        this.loanDetails.loanApplicationDTO.applicationStatus ===
        ApplicationStatus.agreementreceived
      ) {
        if (success) {
          status = ApplicationStatus.approve;
        } else {
          status = ApplicationStatus.pendingagreement;
        }
      }
      this.modalRef = this.loanReviewPopupService.open(
        <Component>LoanApplicationReviewDialogComponent,
        !success ? -1 : 0,
        0,
        0,
        this.loanDetails.loanApplicationDTO &&
          this.loanDetails.loanApplicationDTO.eligibility === false,
        0
      );
      this.modalRef.result.then(
        (result) => {
          if (result.event === "cancel") {
            console.log("cancel");
          } else if (result.event === "confirm") {
            this.confirmSubmit(
              status,
              result.comment,
              result.requiredDocuments
            );
          }
        },
        (error) => {
          const a = false;
        }
      );
    }
  }

  private changeStatus(status: any, success: boolean) {
    const isValidStatus = [
      ApplicationStatus.pending,
      ApplicationStatus.externalpending,
    ].includes(this.loanApplicationReviewService.getLoanStatus());
    if (this.recalculationTriggered || !this.isBreNeeded || !isValidStatus) {
      this.openApprovalDialog(status, success);
    } else {
      this.dialog.open(RecalculateBrePopupComponent, {
        width: "40vw",
        disableClose: true,
        panelClass: "custom-overlay",
      });
      this.recalculateBreService.startInterval();
      this.recalculateBreService.setIsRecalculationInProgress(true);
      setTimeout(() => {
        this.recalculateBreService.recalculateBRE(this.loanId).subscribe(
          (breResponse: BreStatusResponse) => {
            this.breService.setBreResponse(breResponse);
            this.recalculateBreService.finishRecalculation();
            this.uiConfigService.checkApprovalButton(this.loanId);
          },
          (error) => {
            console.error(error);
            this.recalculateBreService.finishRecalculation();
            this.uiConfigService.checkApprovalButton(this.loanId);
            this.snackBar.open("Error Recalculating BRE", "", {
              duration: 3000,
            });
          }
        );
      }, 1500);
    }
    return status;
  }

  disableApproveProcess() {
    let disable = false;
    if (
      this.loanDetails.loanApplicationDTO.applicationStatus !=
      ApplicationStatus.agreementreceived
    ) {
      if (
        (this.loanDetails.loanApplicationDTO.kiscore === null &&
          this.loanDetails.loanApplicationDTO.applicationStatus ===
            ApplicationStatus.pending) ||
        this.loanDetails.loanApplicationDTO.rejectPhase != null ||
        this.loanDetails.loanApplicationDTO.approvePhase != null ||
        (!this.isDcbLender &&
          this.loanDetails.loanApplicationDTO.applicationStatus ===
            ApplicationStatus.reject) ||
        this.loanDetails.loanApplicationDTO.applicationStatus ===
          ApplicationStatus.conditionalapprove ||
        this.loanDetails.loanApplicationDTO.applicationStatus ===
          ApplicationStatus.disbursed
      ) {
        disable = true;
      }
    }
    this.disableApprove = disable;
  }

  async disableKiScoreRuleApproveProcess() {
    let disableKiScoreOverrule = false;
    let eligibilityResult =
      get(this.loanDetails, "loanApplicationDTO.eligibilityResult", "") || "[]";
    eligibilityResult = JSON.parse(eligibilityResult);
    let kiScoreFailed =
      eligibilityResult.filter((element) => {
        return (
          element.eligibilityRule === "KISCORE" && element.result === "FAIL"
        );
      }).length > 0;
    if (
      kiScoreFailed === true &&
      this.loanDetails.loanApplicationDTO.applicationStatus ===
        ApplicationStatus.pending
    ) {
      try {
        const response = await this.loanApplicationReviewService
          .checkKiScoreApproveOverrule(this.loanDetails.loanApplicationDTO.id)
          .toPromise();
        disableKiScoreOverrule = !get(response, "allowed", false);
      } catch (error) {
        console.error(error);
      }
    }
    this.disableKiScoreApprove = disableKiScoreOverrule;
  }

  /**
   * @author Yoharaj
   * @description Task - #13734: Adding a Warning Icon
   */
  getErrorMessageDisplay(loanApplication = null) {
    let showWarningIcon = false;
    if (loanApplication && !loanApplication.eligibility) {
      showWarningIcon =
        loanApplication.loanType === "JLG" &&
        loanApplication.minJlgSize &&
        loanApplication.rulePassedGroupSize &&
        loanApplication.rulePassedGroupSize < loanApplication.minJlgSize;
    }
    return showWarningIcon;
  }

  handleSectionVisibility(sectionId: string): void {
    sessionStorage.setItem("currentSection", sectionId);
    this.currentSection = sectionId;
  }

  getCustomerName() {
    let name = get(this.loanDetails, "customerDTO.name[0]", "") || "";
    return name.toUpperCase();
  }
  validateDownloadReports(loanDetails) {
    return (
      this.enableLoanReportDownload &&
      [
        ApplicationStatus.pending,
        ApplicationStatus.agreementreceived,
        ApplicationStatus.pendingagreement,
        ApplicationStatus.pendingbooking,
        ApplicationStatus.externalbooking,
        ApplicationStatus.externalpending,
      ].includes(get(loanDetails, "loanApplicationDTO.applicationStatus", ""))
    );
  }

  disableApprovalButton(): boolean {
    const breRuleLevelConfig: any = getProperty(
      this.breData,
      "breRuleLevelConfig",
      {}
    );
    const loanApprovalEnabled = get(
      breRuleLevelConfig,
      "loanApprovalButtonEnabled",
      null
    );
    if (loanApprovalEnabled === null) {
      return (
        this.disableKiScoreApprove ||
        this.disableApprove ||
        this.disableOnLoanEntry
      );
    }
    return (
      !loanApprovalEnabled ||
      this.disableKiScoreApprove ||
      this.disableApprove ||
      this.disableOnLoanEntry
    );
  }

  getRejectReason(loanId: number): void {
    this.loanFilterService
      .fetchFilterData(
        [
          "KYC_DOCUMENT_REJECTION_REASONS",
          "EKYC_DOCUMENT_REJECTION_REASONS",
          "LOAN_DOCUMENT_REJECTION_REASONS",
          "ADDITIONAL_DOCUMENT_REJECTION_REASONS",
          "LOAN_APPLICATION_REJECTION_REASON",
        ],
        loanId
      )
      .subscribe(
        (response) => {
          this.rejectReasons = getProperty(
            response,
            "LOAN_APPLICATION_REJECTION_REASON",
            []
          );
          this.documentService.kycRejectionReasons = getProperty(
            response,
            "KYC_DOCUMENT_REJECTION_REASONS",
            []
          );
          this.documentService.loanDocumentRejectionReasons = getProperty(
            response,
            "LOAN_DOCUMENT_REJECTION_REASONS",
            []
          );
          this.documentService.additionalDocumentRejectionReasons = getProperty(
            response,
            "ADDITIONAL_DOCUMENT_REJECTION_REASONS",
            []
          );
          this.documentService.ekycRejectionReasons = getProperty(
            response,
            "EKYC_DOCUMENT_REJECTION_REASONS",
            []
          );
          this.documentService.addOthersOption();
        },
        (error) => {
          console.error(error);
          this.documentService.addOthersOption();
        }
      );
  }

  getNavSections(LoanDetailSections: any = {}): void {
    const navSections: any = Object.fromEntries(
      Object.entries(LoanDetailSections).filter((value: any) => {
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

  openBreResultPopup(event: Event): void {
    event.stopPropagation();
    if (
      !this.isRecalculationInProgress &&
      !this.breData?.overallDecision.toLowerCase().includes("pass")
    ) {
      this.dialog.open(BreResultPopupComponent, {
        width: "40vw",
        disableClose: true,
        panelClass: "custom-overlay",
      });
    }
  }
}
