import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { get, isEmpty } from "lodash";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { buildSelectOptions } from "src/app/shared/util/loan-application-documents-utils";
import { getProperty } from "src/app/utils/app.utils";
import { KcreditInterDataService } from "../../../kcredit-inter-data.service";
import { MatSelectOption } from "../../../loan/constant";
import { KcreditLoanService } from "../../../loan/kcredit-loan.service";
import { KcreditLoanDetailsModel } from "../../../loan/kcredit-loanDetails.model";
import { DocumentsService } from "../../../services/documents.service";
import { UiConfigService } from "../../../services/ui-config.service";
import { CustomErrorPopupComponent } from "../../custom-error-popup/custom-error-popup.component";
import {
  APPLICANT_TAG,
  CO_APPLICANT_TAG,
  DEFAULT_ERROR_TAG_TEXT,
  DEFAULT_SUCCESS_TAG_TEXT,
  GUARANTOR_TAG,
  LOAN_APPLICATION_TAG,
  NOMINEE_TAG,
  POA_TAG,
  POI_TAG,
  TAG_DATA,
} from "./document-tag.constants";

@Component({
  selector: "app-tag-dialog",
  templateUrl: "./tag-dialog.component.html",
  styleUrls: ["./tag-dialog.component.scss"],
})
export class TagDialogComponent implements OnInit {
  userTypeList: MatSelectOption[] = [];
  documentCategoryList: MatSelectOption[] = [];
  documentTypeList: MatSelectOption[] = [];
  loanDocumentTypes: any = { applicants: [], coApplicants: [] };
  kycDocTypes: any = null;

  selectedUserType: MatSelectOption = undefined;
  selectedDocumentCategory: MatSelectOption = undefined;
  selectedDocumentType: MatSelectOption = undefined;
  enableIDSelect: boolean = false;

  branchId: any = undefined;
  partnerId: any = undefined;
  idsMap = new Map<string, string>();

  documents: Array<any> = undefined;
  tagDocumentFrom: string = undefined;
  selectIds: boolean = false;
  availableIds: Array<string> = [];
  kycId: string = "";
  enableTextField: boolean = null;
  disable: boolean = true;
  manualKycId: string = "";
  errors: Array<string> = [];

  constructor(
    public readonly dialogRef: MatDialogRef<TagDialogComponent>,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public readonly dialogData: any,
    private readonly loanDetailService: KcreditLoanService,
    private readonly kcreditInterDataService: KcreditInterDataService,
    private readonly documentTagService: DocumentsService,
    private readonly uiConfigService: UiConfigService
  ) {}

  ngOnInit(): void {
    this.uiConfigService.getUiConfig(UI_COMPONENTS.LOAN_REVIEW).subscribe(
      (reportsConfig: Array<any>) => {
        const docTagsData = reportsConfig.find(
          (config) =>
            getProperty(config, "sectionName", "") ===
            UI_COMPONENTS.DOCUMENT_TAGS
        );
        const uiConfigs = JSON.parse(
          getProperty(docTagsData, "uiConfigurations", "{}")
        );
        this.kycDocTypes = getProperty(uiConfigs, "documentTypeList", {
          POI: [],
          POA: [],
        });
      },
      (error) => console.error(error)
    );

    this.documentCategoryList = TAG_DATA.documentCategoryList;

    let loanDetails: KcreditLoanDetailsModel =
      this.loanDetailService.getLoanDetails();

    this.updateDocumentOwnerData(loanDetails);
    this.updatePartnerAndBranchData(loanDetails);
    this.documents = get(this.dialogData, "documents", []);
    this.tagDocumentFrom = getProperty(this.dialogData, "tagDocumentFrom", "");
    if (!this.tagDocumentFrom) {
      this.tagDocumentFrom = this.documents.some((doc) =>
        getProperty(doc, "isCoApplicantDocument", false)
      )
        ? CO_APPLICANT_TAG.value
        : APPLICANT_TAG.value;
    }
    this.fetchLoanDocTypes();
  }

  updateDocumentOwnerData(loanDetails: KcreditLoanDetailsModel = null) {
    let applicantName = get(loanDetails, "customerDTO.name", "");
    let applicantId = get(loanDetails, "customerDTO.id", null);

    this.userTypeList = [
      {
        value: APPLICANT_TAG.value,
        viewValue: `${APPLICANT_TAG.viewValue} (${applicantName})`,
        id: applicantId,
      },
    ];

    let co_applicants =
      this.kcreditInterDataService.getCoApplicant(loanDetails);
    co_applicants = co_applicants.map((co_applicant) => ({
      value: CO_APPLICANT_TAG.value,
      viewValue: `${CO_APPLICANT_TAG.viewValue} (${co_applicant.name})`,
      id: co_applicant.id,
    }));
    let guarantors = this.kcreditInterDataService.getGuarantor(loanDetails);
    guarantors = guarantors.map((guarantor) => ({
      value: GUARANTOR_TAG.value,
      viewValue: `${GUARANTOR_TAG.viewValue} (${guarantor.name})`,
      id: guarantor.id,
    }));
    const nomineeDetail: any = getProperty(loanDetails, "nomineeDetails", null);
    this.userTypeList = [...this.userTypeList, ...co_applicants, ...guarantors];
    if (nomineeDetail) {
      const nominee = {
        value: NOMINEE_TAG.value,
        viewValue: `${NOMINEE_TAG.viewValue} (${nomineeDetail.name})`,
        id: nomineeDetail.id,
      };
      this.userTypeList = [...this.userTypeList, nominee];
    }
  }

  updatePartnerAndBranchData(loanDetails: KcreditLoanDetailsModel = null) {
    /* Setting Branch and Partner ID */
    this.branchId = get(loanDetails, "customerDTO.branchId", "");
    this.partnerId = get(loanDetails, "customerDTO.partnerId", null);
  }

  async fetchLoanDocTypes() {
    const response: string[] = await this.documentTagService
      .getLoanDocumentTags(this.partnerId, this.branchId)
      .catch((error) => console.error(error));
    if (response) {
      this.loanDocumentTypes =
        this.documentTagService.extractUniqueProofTypes(response);
    }
  }

  async fetchLoanDocIds() {
    let loanDetails: KcreditLoanDetailsModel =
      this.loanDetailService.getLoanDetails();
    const response: string[] = await this.documentTagService
      .getDocumentIDS(
        this.selectedDocumentType?.value,
        this.selectedUserType.value,
        loanDetails?.loanApplicationDTO.kycGroupId,
        this.selectedUserType.id?.toString()
      )
      .catch((error) => console.log(error));
    if (response) {
      this.availableIds = this.processDocs(
        response,
        this.selectedDocumentType?.value
      );
      this.disable = true;
    }
  }

  approve(): void {
    let loanDetails: KcreditLoanDetailsModel =
      this.loanDetailService.getLoanDetails();

    let customerId = get(
      loanDetails,
      "loanApplicationDTO.customerNumber",
      null
    );
    let loanId = get(loanDetails, "loanApplicationDTO.id", null);

    this.errors = [];
    const requestPayload = {
      fileTaggingDtoList: this.documents.map((doc) => ({
        toDocumentOwner: this.selectedUserType.value,
        fromDocumentOwner: this.tagDocumentFrom,
        toDocumentCategory: this.selectedDocumentCategory.value,
        fromDocumentCategory: get(doc, "purpose", LOAN_APPLICATION_TAG.value),
        documentType: this.selectedDocumentType.value,
        uniqueId: get(doc, "id", null),
        kycId:
          this.kycId === "Others"
            ? this.manualKycId
            : this.getId(this.kycId, this.selectedDocumentType.value),
        entityId: this.selectedUserType.id,
      })),
      customerId,
      loanId,
    };
    this.documentTagService
      .tagDocuments(requestPayload)
      .then(() => {
        this.handleResponseMessage(DEFAULT_SUCCESS_TAG_TEXT);
      })
      .catch((error) => {
        let errorResponses: string[] = getProperty(error, "error.errors", []);
        const errorMessage = getProperty(error, "error.message", null);
        if (errorResponses?.length) {
          this.errors = errorResponses.map((errorMsg) =>
            getProperty(errorMsg?.split(":"), "[1]", "")
          );
        } else {
          this.handleResponseMessage(
            errorMessage || DEFAULT_ERROR_TAG_TEXT,
            true
          );
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
  async updateUserTypeChange(option: MatSelectOption) {
    this.documentTypeList = [];
    this.selectedDocumentCategory = null;
    this.selectedDocumentType = null;
  }

  loanDocIds() {
    this.kycId = null;
    if (
      this.selectedDocumentCategory.value === "POI" ||
      this.selectedDocumentCategory.value === "POA"
    ) {
      this.selectIds = true;
      this.fetchLoanDocIds();
      this.disable = true;
    }
  }

  async updateSelection(option: MatSelectOption) {
    switch (option.value) {
      case POI_TAG.value:
        this.documentTypeList = buildSelectOptions(
          getProperty(this.kycDocTypes, "POI", [])
        );
        break;
      case POA_TAG.value:
        this.documentTypeList = buildSelectOptions(
          getProperty(this.kycDocTypes, "POA", [])
        );
        break;
      case LOAN_APPLICATION_TAG.value:
        this.updateDocumentTypeList();
        this.disable = false;
        break;
      default:
        break;
    }
    this.selectIds = false;
  }

  updateDocumentTypeList() {
    switch (this.selectedUserType.value) {
      case APPLICANT_TAG.value:
        this.documentTypeList = buildSelectOptions(
          this.loanDocumentTypes.applicants
        );
        this.disable = true;
        this.enableTextField = false;
        break;
      case CO_APPLICANT_TAG.value:
      case GUARANTOR_TAG.value:
      case NOMINEE_TAG.value:
        this.documentTypeList = buildSelectOptions(
          this.loanDocumentTypes.coApplicants
        );
        this.disable = true;
        this.enableTextField = false;
        break;
      default:
        this.documentTypeList = [];
        this.disable = false;
        this.enableTextField = false;
        break;
    }
  }

  handleResponseMessage(description: string = "", isError: boolean = false) {
    const confirmationDialog = this.dialog.open(CustomErrorPopupComponent, {
      data: {
        dialogRef: this.dialogRef,
        description,
        isError,
      },
    });
    confirmationDialog.afterClosed().subscribe((response) => {
      if (!isError && response) {
        window.location.reload();
      }
    });
  }

  processDocs(docs: Array<string> = [], documentType: string = "") {
    if (documentType === "Aadhaar") {
      let updatedDocs = [];
      docs.forEach((doc) => {
        this.idsMap.set("xxxx-xxxx-" + doc.substring(8), doc);
        updatedDocs.push("xxxx-xxxx-" + doc.substring(8));
      });
      updatedDocs.push("Others");
      return updatedDocs;
    }
    docs.push("Others");
    return docs;
  }

  getId(id: string = "", documentType: string = "") {
    if (documentType === "Aadhaar") {
      return this.idsMap.get(id);
    }
    return id;
  }

  updateKycId(id: string = null) {
    this.kycId = id;
    if (id === "Others") {
      this.enableTextField = true;
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  checkDisability() {
    let canDisable =
      !this.selectedDocumentType ||
      !this.selectedDocumentCategory ||
      !this.selectedUserType;
    if (this.kycId === "Others") {
      canDisable = isEmpty(this.manualKycId);
    }
    return canDisable;
  }
}
