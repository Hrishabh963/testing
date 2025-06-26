import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get, isEmpty } from "lodash";
import { BehaviorSubject, Observable } from "rxjs";
import {
  APPROVE_OR_REJECT_BUSINESS,
  FETCH_ALL_BUSINESS,
  FETCH_BUSINESS_COUNT,
  FETCH_BUSINESS_REVIEW_INFORMATION,
  SAVE_FACTORING_LIMIT,
  SECTION_LEVEL_REJECT,
  UPDATE_BUSINESS_DOC_STATUS,
  UPDATE_BUSINESS_DOCUMENT_DETAILS,
} from "src/app/shared/constants/Api.constants";
import { groupObjects } from "src/app/shared/util/loan-application-documents-utils";
import { getProperty } from "src/app/utils/app.utils";
import { BusinessMetrics } from "./business-invoice.constants";

@Injectable({
  providedIn: "root",
})
export class BusinessInvoiceService {
  businessId: number = null;
  defaultVerificationSections = [
    "BusinessProfile",
    "SupplierReference",
    "NationalId",
    "MembershipCertificate",
    "AuditFinancialStatement",
    "ComplianceCertificate",
    "TaxFile",
    "HorticultureCropDirectorateLicense",
    "TradeExportLicense",
    "OwnerKRACertificate",
    "BusinessRegistrationCertificate",
    "KRACertificate",
    "OldInvoices",
    "GlobalGAAPCertificate",
    "Miscellaneous",
    "Agreement",
  ];
  defaultRejectedSections: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);
  businessReviewInfo: BehaviorSubject<any> = new BehaviorSubject<any>({});
  latestVersionedDocs = {};

  fieldsToMask: Set<string> = new Set([
    "nationalIdNumber",
    "businessOwnerKraNumber",
    "businessKraNumber",
  ]);

  constructor(private readonly http: HttpClient) {}

  resetStates() {
    this.defaultRejectedSections.next([]);
    this.latestVersionedDocs = {};
  }

  maskField(value: string): string {
    if (isEmpty(value)) return "";
    return "*".repeat(value.length);
  }

  isFieldMasked(field: string): boolean {
    return this.fieldsToMask.has(field);
  }

  fetchAllBusiness(
    businessStatusList = [],
    searchValue = "",
    page: number = 0,
    size: number = 5,
    sort = "id,desc"
  ) {
    const params = new HttpParams()
      .append("businessStatusList", businessStatusList?.join(","))
      .append("searchValue", searchValue)
      .append("size", size)
      .append("page", page)
      .append("sort", sort);
    return this.http.get(FETCH_ALL_BUSINESS, { params, observe: "response" });
  }

  fetchBusinessReviewInformation(businessId = this.businessId): Promise<any> {
    if (!businessId) {
      return Promise.reject(new Error("Invalid Business ID"));
    }
    this.businessId = businessId;
    const params = new HttpParams().append("businessId", businessId);
    return this.http
      .get(FETCH_BUSINESS_REVIEW_INFORMATION, { params })
      .toPromise()
      .then((response) => {
        let documents = groupObjects(
          getProperty(response, "customerDocumentDTOList", []),
          "entityType"
        );
        response["documents"] = getProperty(documents, "APPLICANT", {});
        this.latestVersionedDocs = this.updateLatestVersionDocuments(
          this.defaultVerificationSections,
          getProperty(response, "customerDocumentDTOList", [])
        );
        this.businessReviewInfo.next(response);
      });
  }

  updateLatestVersionDocuments(docTypes = [], documents = []) {
    const latestDocsMap = {};
    for (const doc of documents) {
      if (docTypes.includes(doc.documentType)) {
        documents.forEach((doc) => {
          const existingDoc = latestDocsMap[doc.documentType];

          if (!existingDoc || doc.version < existingDoc.version) {
            latestDocsMap[doc.documentType] = doc;
          }
        });
      }
    }
    return latestDocsMap;
  }

  getDocumentDetails(documentType: string = "") {
    let details = get(
      this.latestVersionedDocs,
      `${documentType}.customerDocumentAdditionalData`,
      {}
    );
    return details;
  }
  getFactoringLimits() {
    return {
      invoiceCreditLimit: getProperty(
        this.businessReviewInfo.getValue(),
        "businessDetailsDTO.invoiceCreditLimit",
        ""
      ),
      businessCreditLimit: getProperty(
        this.businessReviewInfo.getValue(),
        "businessDetailsDTO.businessCreditLimit",
        ""
      ),

      currency: getProperty(
        this.businessReviewInfo.getValue(),
        "businessDetailsDTO.currency",
        ""
      ),
      outstandingLimit: getProperty(
        this.businessReviewInfo.getValue(),
        "businessDetailsDTO.outstandingInvoiceLimit",
        ""
      ),
    };
  }
  getBusinessReviewStatus() {
    return getProperty(
      this.businessReviewInfo.getValue(),
      "businessDetailsDTO.businessReviewStatus",
      ""
    );
  }

  updateDocumentStatus(documentList: Array<any> = []) {
    return this.http.post(UPDATE_BUSINESS_DOC_STATUS, documentList).toPromise();
  }

  approveOrRejectBusiness(
    businessIdList: Array<number> = [],
    reviewStatus: string = null,
    reviewRemark: string = null,
    discrepancyList: Array<string> = []
  ) {
    const payload = {
      businessIdList,
      reviewStatus,
      reviewRemark,
      discrepancyList,
    };
    return this.http.put(APPROVE_OR_REJECT_BUSINESS, payload);
  }

  rejectBusinessSection(
    rejectReason: string = "",
    businessId: string = "",
    sectionName: string = ""
  ) {
    const params = {
      businessId,
      sectionName,
    };
    return this.http.put(
      SECTION_LEVEL_REJECT,
      { rejectReason: rejectReason },
      { params }
    );
  }

  saveFactoringLimit(payload: any = {}) {
    const customerId: number = get(
      this.businessReviewInfo.getValue(),
      "businessDetailsDTO.customerId",
      null
    );
    const params = {
      customerId: customerId,
    };

    return this.http.post(SAVE_FACTORING_LIMIT, payload, { params });
  }

  saveBusinessDocumentDetails(payload = {}, documentType: string = "") {
    const customerId = get(
      this.businessReviewInfo.getValue(),
      "tenantCustomerDTO.id",
      null
    );

    const params = {
      documentType,
    };
    return this.http
      .put(`${UPDATE_BUSINESS_DOCUMENT_DETAILS}/${customerId}`, payload, {
        params,
      })
      .toPromise();
  }
  checkForRejectDocument(docType = "") {
    return Object.values(this.latestVersionedDocs).some((doc) => {
      if (get(doc, "documentType", "") === docType) {
        let status = get(doc, "reviewStatus", "");
        return status === "REJECT";
      }
      return false;
    });
  }

  checkForDefaultRejectedSections(sectionKey: string = ""): string {
    const businessReviewDetails = this.businessReviewInfo.getValue();
    if (isEmpty(businessReviewDetails)) {
      return "";
    }
    switch (sectionKey) {
      case "BusinessProfile":
        return getProperty(
          businessReviewDetails,
          "businessDetailsDTO.businessReviewStatus",
          null
        ) === "REJECTED"
          ? "BusinessProfile"
          : "";
      case "SupplierReference":
        return getProperty(
          businessReviewDetails,
          "businessReferenceEntityDtoList[0].reviewStatus",
          null
        ) === "REJECT"
          ? "SupplierReference"
          : "";
      default:
        return this.checkForRejectDocument(sectionKey) ? sectionKey : "";
    }
  }

  updateDefaultRejectedSections(sections = this.defaultVerificationSections) {
    sections.forEach((section) => {
      const rejectedSection = this.checkForDefaultRejectedSections(section);
      if (rejectedSection) {
        this.addDefaultRejectedState(rejectedSection);
      }
    });
  }

  addDefaultRejectedState(sectionName: string = "") {
    const currentSections = this.defaultRejectedSections.getValue();
    this.defaultRejectedSections.next([...currentSections, sectionName]);
  }

  removeDefaultRejectedState(sectionName: string = "") {
    const currentSections = this.defaultRejectedSections.getValue();
    const sectionIndex = currentSections.findIndex(
      (section) => section === sectionName
    );
    currentSections.splice(sectionIndex, 1);
    this.defaultRejectedSections.next(currentSections);
  }

  fetchBusinessOverviewCount(): Observable<BusinessMetrics> {
    return this.http.get<BusinessMetrics>(FETCH_BUSINESS_COUNT);
  }

}
