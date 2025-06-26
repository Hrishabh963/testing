import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JhiDateUtils } from "ng-jhipster";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CashTransactions } from "../../models/cash-transactions/cash-transactions.model";
import { Address } from "../../models/customer/address.model";
import { Customer } from "../../models/customer/customer.model";
import { StatusEnum } from "../../models/customer/status-enum.model";
import { EnrollmentTemplate } from "../../models/customer/customer-enrollmentTemplate.model";
import { BankDetails } from "../../models/customer/bank-details.model";
import { FamilyDetails } from "../../models/customer/family-details.model";
import { NomineeDetails } from "../../models/customer/nominee-details.model";
import { CustomerSubscriptionsCompositeDTO } from "../../models/customer/customer-subscriptions-composite-DTO.model";
import { CustomerSubscriptionsDTO } from "../../models/customer/customer-persona-response.model";
import {
  ALL_REFS_CODES_URL,
  BACKOFFICE_CUSTOMER_URL,
  CB_PENDING_CUSTOMER_SEARCH_URL,
  COMPLETE_REFS_CODES_URL,
  CUSTOMER_FILE_MAPPER_URL,
  GET_ANSWERED_QUESTIONAIRE_URL,
  HIGH_MARKET_REQUEST_URL,
  PAGINATED_SEARCH_URL,
  REJECT_CUSTOMER_URL,
} from "src/app/shared/constants/Api.constants";
import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
} from "src/app/app.constants";
import { getProperty } from "src/app/utils/app.utils";
import { get } from "lodash";
import { RiskCategorisation } from "../../models/customer/customer-risk-categorisation.model";
import { KycDetailsForLoan } from "../../models/kyc-details.model";

@Injectable()
export class CustomerService {
  public customer: Customer;
  public customerSubscriptionsCompositeDTO: CustomerSubscriptionsCompositeDTO;
  public customerSubscriptionsDTO: any;
  public id;
  public isAdminEditOfCustomer: boolean;
  public status: any;
  public successMessage: any;
  public changedPersonaResponse: any;
  public staatus: any;
  public cashTransactions: CashTransactions;
  constructor(private readonly http: HttpClient, private readonly dateUtils: JhiDateUtils) {
    this.customer = new Customer();
    this.staatus = StatusEnum["pendingVerification"];
    this.customerSubscriptionsCompositeDTO =
      new CustomerSubscriptionsCompositeDTO();
    this.isAdminEditOfCustomer = false;
    this.cashTransactions = new CashTransactions();
  }

  create(customer: Customer): Observable<Customer> {
    const copy: Customer = { ...customer };
    if (
      customer.dateOfBirth !== null &&
      customer.dateOfBirth !== "" &&
      customer.dateOfBirth !== undefined
    ) {
      copy.dateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.dateOfBirth
      );
    }
    if (
      customer.nomineeDateOfBirth !== null &&
      customer.nomineeDateOfBirth !== "" &&
      customer.nomineeDateOfBirth !== undefined
    ) {
      copy.nomineeDateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.nomineeDateOfBirth
      );
    }
    if (
      customer.spouseDateOfBirth !== null &&
      customer.spouseDateOfBirth !== "" &&
      customer.spouseDateOfBirth !== undefined
    ) {
      copy.spouseDateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.spouseDateOfBirth
      );
    }
    return this.http.post(BACKOFFICE_CUSTOMER_URL, copy).pipe(
      map((res: HttpResponse<any>) => {
        this.customer = res.body;
        this.customer.dateOfBirth = this.convertLocalDateFromServer(
          this.customer.dateOfBirth
        );
        this.customer.spouseDateOfBirth = this.convertLocalDateFromServer(
          this.customer.spouseDateOfBirth
        );
        this.customer.nomineeDateOfBirth = this.convertLocalDateFromServer(
          this.customer.nomineeDateOfBirth
        );
        this.customer.isEdited = false;
        this.getCustomer();
        return this.customer;
      })
    );
  }

  update(customer: Customer): Observable<Customer> {
    const copy = new Customer();
    for (const prop in copy) {
      if (customer.hasOwnProperty(prop)) {
        copy[prop] = customer[prop];
      }
    }
    if (
      customer.dateOfBirth !== null &&
      customer.dateOfBirth !== "" &&
      customer.dateOfBirth !== undefined
    ) {
      copy.dateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.dateOfBirth
      );
    }
    if (
      customer.nomineeDateOfBirth !== null &&
      customer.nomineeDateOfBirth !== "" &&
      customer.nomineeDateOfBirth !== undefined
    ) {
      copy.nomineeDateOfBirth = this.dateUtils.convertLocalDateToServer(
        customer.nomineeDateOfBirth
      );
    }
    return this.http.put(BACKOFFICE_CUSTOMER_URL, copy).pipe(
      map((res: HttpResponse<any>) => {
        this.customer = res;
        this.customer.isAdminEditOfCustomer = customer.isAdminEditOfCustomer;
        this.customer.dateOfBirth = this.convertLocalDateFromServer(
          this.customer.dateOfBirth
        );
        this.customer.spouseDateOfBirth = this.convertLocalDateFromServer(
          this.customer.spouseDateOfBirth
        );
        this.customer.nomineeDateOfBirth = this.convertLocalDateFromServer(
          this.customer.nomineeDateOfBirth
        );
        this.customer.isEdited = true;
        this.getCustomer();
        return this.customer;
      })
    );
  }

  find(id: number): Observable<Customer> {
    return this.http.get(`${BACKOFFICE_CUSTOMER_URL}/${id}`).pipe(
      map((res: HttpResponse<any>) => {
        const jsonResponse = res.body;
        jsonResponse.dateOfBirth = this.convertLocalDateFromServer(
          jsonResponse.dateOfBirth
        );
        jsonResponse.spouseDateOfBirth = this.convertLocalDateFromServer(
          jsonResponse.spouseDateOfBirth
        );
        jsonResponse.nomineeDateOfBirth = this.convertLocalDateFromServer(
          jsonResponse.nomineeDateOfBirth
        );
        this.customer = jsonResponse;
        this.customer.isEdited = true;
        return this.customer;
      })
    );
  }

  getFileTypesForCustomer(id: number) {
    return this.http.get(`${CUSTOMER_FILE_MAPPER_URL}/${id}`);
  }

  convertLocalDateFromServer(date: string) {
    if (date !== undefined && date != null) {
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

  query(req?: any): Observable<any> {
    let params = this.createRequestOption(req);
    if (req.status === "CB Pending") {
      return this.http
        .get(CB_PENDING_CUSTOMER_SEARCH_URL, { params })
        .pipe(map((res: any) => this.convertResponse(res)));
    } else if (req.status === "pendingVerification") {
      params = params.append("status", this.staatus);
      return this.http
        .get(PAGINATED_SEARCH_URL, { params })
        .pipe(map((res: any) => this.convertResponse(res)));
    } else {
      return this.http
        .get(PAGINATED_SEARCH_URL, { params })
        .pipe(map((res: any) => this.convertResponse(res)));
    }
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BACKOFFICE_CUSTOMER_URL}/${id}`);
  }

  private convertResponse(res: any): any {
    const jsonResponse = res;
    let i = 0;
    for (let element of jsonResponse) {
      jsonResponse[i].dateOfBirth = this.dateUtils.convertLocalDateFromServer(
        element.dateOfBirth
      );
      jsonResponse[i].spouseDateOfBirth =
        this.dateUtils.convertLocalDateFromServer(element.spouseDateOfBirth);
      jsonResponse[i].nomineeDateOfBirth =
        this.dateUtils.convertLocalDateFromServer(element.nomineeDateOfBirth);
      i++;
    }
    res._body = jsonResponse;
    return res;
  }

  private createRequestOption(req?: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (req) {
      params = params.append("page", req.page);
      params = params.append("size", req.size);
      params = params.append("status", req.status);
      params = params.append("name", req.search.name);
      params = params.append("aadhaarNumber", req.search.aadhaarNumber);
      params = params.append("mobileNumber", req.search.mobileNumber);
      if (req.sort) {
        params = params.append("sort", req.sort);
      }
      for (const key in req.query) {
        if (req.query[key] !== "" || req.query[key] !== 0) {
          params = params.append(key, req.query[key]);
        }
      }
    }
    return params;
  }
  getAllReferanceCodes(referenceCodeClassifiers: any[]): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}${ALL_REFS_CODES_URL}/${referenceCodeClassifiers}`
    );
  }

  //
  getCompleteReferanceCodes(referenceCodeClassifiers: any[]): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}${COMPLETE_REFS_CODES_URL}/${referenceCodeClassifiers}`
    );
  }

  getCustomer() {
    return this.customer;
  }

  saveEnrollmentTemplateOfCustomer(
    enrollmentTemplateDTO: EnrollmentTemplate,
    id: number
  ) {
    this.customerSubscriptionsCompositeDTO.enrollmentTmplateDTO =
      enrollmentTemplateDTO;
  }
  getCreditBuro(id: number): Observable<any> {
    return this.http.get(`${HIGH_MARKET_REQUEST_URL}/${id}`);
  }
  getSavedQuestioneriesByCustomerId(id: number): Observable<any> {
    return this.http.get(`${GET_ANSWERED_QUESTIONAIRE_URL}/${id}`);
  }
  getSavedQuestioneriesByResponseHeaderId(id: number): Observable<any> {
    return this.http.get(`api/edited/questionnairesByhederId/${id}`);
  }
  getCustomerPersonaResponse(
    id: number
  ): Observable<CustomerSubscriptionsCompositeDTO> {
    this.customerSubscriptionsCompositeDTO =
      this.getIntialRecommandationWithoutSavingInitialQuestions();
    let enrollmentTmplateDTO = {};
    enrollmentTmplateDTO =
      this.customerSubscriptionsCompositeDTO.enrollmentTmplateDTO;
    return this.http.post<CustomerSubscriptionsCompositeDTO>(
      `${KALEIDO_SERVER_API_URL}api/backoffice/recommendation/getRecommendation/${id}`,
      enrollmentTmplateDTO
    );
  }

  rejectingOfCustomer(id: number, status: string) {
    return this.http.get(`${REJECT_CUSTOMER_URL}${id}/?status=` + status);
  }
  sendSMSToMobileNumber(mobileNumber, customerId): Observable<any> {
    const key = "5f19c7c7b8a48883a257ef0dd2622a7d";
    return this.http.get(`api/sendingOtpToMobileNumber`, {
      params: {
        mobileNumber: mobileNumber,
        key: key,
        customerId: customerId,
      },
    });
  }
  sendOTPForVerication(mobileNumber, code: any): Observable<any> {
    const key = "cc5e62c39b3681bc534bef653ce051a4";
    return this.http.get(`api/otpVerification`, {
      params: { mobileNumber: mobileNumber, code: code, key: key },
    });
  }
  getcustomerSubscriptionsDTO() {
    return this.customerSubscriptionsDTO;
  }
  getCashTransaction(subscriptionId: any): Observable<any> {
    return this.http.get(`api/cashTransactions/${subscriptionId}`);
  }
  saveCashTransaction(
    cashTransaction: CashTransactions
  ): Observable<CashTransactions> {
    return this.http
      .post(
        `${KALEIDO_SERVER_API_URL}api/backoffice/collectionTransaction/updateDueDate`,
        cashTransaction
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          this.cashTransactions = res.body;
          this.getConfirmation();
          return this.cashTransactions;
        })
      );
  }
  getConfirmation() {
    return this.cashTransactions;
  }
  changingResponse(customerSubscriptionsDTO: CustomerSubscriptionsDTO) {
    this.changedPersonaResponse = customerSubscriptionsDTO;
    this.gettingChangedPersonaResponse();
  }
  gettingChangedPersonaResponse() {
    return this.changedPersonaResponse;
  }
  saveEnrollmentTemplateOfCustomerForCallCenter(
    enrollmentTemplateDTO: EnrollmentTemplate,
    id: number
  ) {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/backoffice/enrollmentTemplate/updateAnswer/${id}`,
      enrollmentTemplateDTO
    );
  }
  getNewQuestionByCustomerIdAndQuestionHierarchy(
    id: number,
    questionHierarchy: string
  ): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/enrollmentTemplate`
    );
  }
  getInitialCustomerPersonaResponseChanged(
    id: number,
    enrollmentTemplateDTO: EnrollmentTemplate
  ): Observable<any> {
    this.customerSubscriptionsCompositeDTO.enrollmentTmplateDTO =
      enrollmentTemplateDTO;
    return this.http
      .put(
        `${KALEIDO_SERVER_API_URL}api/backoffice/getInitialRecommendation/${id}`,
        enrollmentTemplateDTO
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          this.customerSubscriptionsCompositeDTO.responses = res.body;
          this.getIntialRecommandationWithoutSavingInitialQuestions();
          return res.body;
        })
      );
  }
  getIntialRecommandationWithoutSavingInitialQuestions() {
    return this.customerSubscriptionsCompositeDTO;
  }
  setSuccessMessages(msg: string) {
    this.successMessage = msg;
  }
  setMessage() {
    return this.successMessage;
  }
  setAdminEditOfCustomer(isAdminEditOfCustomer) {
    this.isAdminEditOfCustomer = isAdminEditOfCustomer;
    this.setAdminEdit();
  }
  setAdminEdit() {
    return this.isAdminEditOfCustomer;
  }
  getAndroidSharedPreferencesData(): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/customer/getMasterData`
    );
  }
  saveCashTransactionComfirmantion(transactionId: number): Observable<any> {
    return this.http.put(
      `${KALEIDO_SERVER_API_URL}api/partner/collectionTransaction/confirmCashCollection/${transactionId}`,
      null
    );
  }

  //
  searchIFSC(
    ifscCode: string,
    entity: any,
    entityId: any,
    customerId: any
  ): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/bankDetail/ifscSearch/${customerId}/${entity}/${entityId}/${ifscCode}`
    );
  }

  getPanKycDetails(customerID: number): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/customer/getPanKycDetails/${customerID}`
    );
  }

  fetchPanKycDetails(
    customerID: number,
    panNumber: any,
    dateOfBirth: any
  ): Observable<any> {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/customer/panDetailsFetch/${customerID}?panNumber=${panNumber}&dateOfBirth=${dateOfBirth}`
    );
  }

  //
  updateAddress(address: Address) {
    return this.http.put(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/updateAddress`,
      address
    );
  }

  updateFamily(family: any) {
    const copy: FamilyDetails = { ...family };
    if (family.dob !== null && family.dob !== "" && family.dob !== undefined) {
      copy.dob = this.dateUtils.convertLocalDateToServer(family.dob);
    }
    return this.http.put(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/updateFamilyDetails`,
      copy
    );
  }

  updateProfile(customerId: any, customerProfile) {
    return this.http.put(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/profileUpdate/${customerId}`,
      customerProfile
    );
  }

  updateNomineeDetails(nomineeDetails: any) {
    const copy: NomineeDetails = { ...nomineeDetails };
    if (
      nomineeDetails.dateOfBirth !== null &&
      nomineeDetails.dateOfBirth !== "" &&
      nomineeDetails.dateOfBirth !== undefined
    ) {
      copy.dateOfBirth = this.dateUtils.convertLocalDateToServer(
        nomineeDetails.dateOfBirth
      );
    }
    if (
      nomineeDetails.guardianDOB !== null &&
      nomineeDetails.guardianDOB !== "" &&
      nomineeDetails.guardianDOB !== undefined
    ) {
      copy.guardianDOB = this.dateUtils.convertLocalDateToServer(
        nomineeDetails.guardianDOB
      );
    }
    return this.http.put(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/updateNomineeDetails`,
      copy
    );
  }

  //
  updateBankDetails(bankDetails: any) {
    const copy: BankDetails = { ...bankDetails };

    return this.http.put(
      `${KREDILINE_SERVER_URL}api/backoffice/customer/updateBankDetails`,
      copy
    );
  }

  getKycDocuments(
    loanDocumentList: Array<any> = [],
    documentType: string = "",
    entityType: string = ""
  ): Array<any> {
    return loanDocumentList.filter((doc) => {
      const purpose: string = getProperty(doc, "purpose", "");
      const entity: string = getProperty(doc, "entityType", "");
      return (
        purpose.toLowerCase() === documentType.toLowerCase() &&
        entity === entityType
      );
    });
  }

  updateDateObjects(instance, key) {
    let dateString = get(instance, key);
    const dateDisplay = new Date(dateString);
    if (typeof dateString === "string") {
      instance[key] = this.convertLocalDateFromServer(dateString);
    }
    return dateDisplay;
  }

  getRiskCategoryData(
    customerRiskCategories: Array<RiskCategorisation>,
    entityId: number | string
  ): RiskCategorisation {
    const riskCategory: RiskCategorisation = customerRiskCategories.find(
      (risk: RiskCategorisation) => {
        return risk.entityId == entityId;
      }
    );
    return riskCategory;
  }

  extractDocData(
    docId: any,
    docType: any,
    kycDetailsList: Array<KycDetailsForLoan>
  ): void {
    const poiData: KycDetailsForLoan = kycDetailsList.find(
      (kycInfo: KycDetailsForLoan) => {
        const purpose: string = kycInfo?.purpose;
        return purpose === "POI";
      }
    );
    docId["poi"] = poiData?.idNo ?? null;
    docType["poi"] = poiData?.documentType ?? null;
    const poaData: KycDetailsForLoan = kycDetailsList.find(
      (kycInfo: KycDetailsForLoan) => {
        const purpose: string = kycInfo?.purpose;
        return purpose === "POA";
      }
    );
    docId["poa"] = poaData?.idNo ?? null;
    docType["poa"] = poaData?.documentType ?? null;
  }
}
