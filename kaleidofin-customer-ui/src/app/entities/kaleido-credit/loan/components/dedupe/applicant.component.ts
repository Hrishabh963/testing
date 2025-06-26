import {Component, Input} from '@angular/core';
import {KcreditLoanDetailsModel} from '../../kcredit-loanDetails.model';
import {CustomerService} from "../../../services/customer/customer.service";
import { DedupeData } from './models/dedupe-data.model';
import {DedupeCheckRequest} from './models/search-customer-request.model';
import { JhiAlertService } from "ng-jhipster";
import {KcreditLoanService} from '../../kcredit-loan.service';
import {SearchCustomerResponse} from './models/search-customer-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ExecutedDedupeResult} from './models/executed-dedupe-result.model';
import {AssignUCICRequest} from './models/assign-ucic-request.model';
import {KCreditLoanApplication} from '../../../report/kcredit-loan-application.model';
import {DedupeEntityType} from '../../../models/kcredit-enum.model';

@Component({
  selector: "jhi-applicant",
  templateUrl: "./applicant.component.html",
  styleUrls: ["./dedupe.css"],
})
export class ApplicantComponent {
  @Input() dedupeDataForComponent: DedupeData;
  @Input() applicantType: any;
  @Input() loanDetails: KcreditLoanDetailsModel;

  public initialAddress: any;
  error: boolean;
  loanApplicationDTO: KCreditLoanApplication;
  disableEdit: boolean = true;
  disableInspect: boolean = false;
  noMatch: boolean = false;
  updateUcic = false;
  ucicAlreadyPresent: boolean = false;
  searchCustomerRequest: DedupeCheckRequest = new DedupeCheckRequest();
  searchCustomerResponse: SearchCustomerResponse;
  executedDedupeResultList: ExecutedDedupeResult[];
  selectedDedupe: ExecutedDedupeResult;
  assignUCICRequest: AssignUCICRequest = new AssignUCICRequest();
  applicantTypeUcic: any;
  ucicCreatedOrUpdated: boolean = false;
  dedupeEnabled: boolean;
  constructor(
    private readonly kcreditLoanService: KcreditLoanService,
    private readonly alertService: JhiAlertService,
    private readonly snackBar: MatSnackBar,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit() {
    this.loanApplicationDTO = this.loanDetails.loanApplicationDTO;
    this.dedupeDataForComponent.dateOfBirth =
      this.customerService.convertLocalDateFromServer(
        this.dedupeDataForComponent.dateOfBirth
      );
    if (this.dedupeDataForComponent.ucic) this.disableInspect = true;
    if (
      this.loanApplicationDTO.lendingPartnerCode &&
      this.loanApplicationDTO.lendingPartnerCode === "FICCL"
    )
      this.dedupeEnabled = true;
    else {
      this.dedupeEnabled = false;
      this.disableInspect = true;
    }
  }

  dedupeSearchCustomer(applicantType) {
    this.disableInspect = true;
    this.setSearchCustomerRequest(applicantType);
    if (this.searchCustomerRequest.loanApplicationId) {
      this.kcreditLoanService
        .dedupeSearchCustomer(this.searchCustomerRequest)
        .subscribe(
          (res) => this.onSuccessOfSearchCustomer(res),
          (res) => this.onErrorOfSearchCustomer(res.error)
        );
    }
  }

  onErrorOfSearchCustomer(res: any) {
    this.searchCustomerResponse = res;
    if (
      this.searchCustomerResponse.status === "ERROR" &&
      this.searchCustomerResponse.responseCode === "409"
    ) {
      this.snackBar.open(
        this.searchCustomerResponse.message,
        "Re-trying to fetch the matches",
        { duration: 4000 }
      );
      this.getDedupeSearchCustomerStatus(this.searchCustomerResponse);
    } else {
      this.disableInspect = false;
      this.snackBar.open("Dedupe not initiated. Please re-try", "Error!!", {
        duration: 4000,
      });
    }
  }

  onSuccessOfSearchCustomer(searchCustomerResponse: SearchCustomerResponse) {
    this.searchCustomerResponse = searchCustomerResponse;
    if (
      this.searchCustomerResponse.acknowledgementID &&
      this.searchCustomerResponse.status === "SUCCESS"
    ) {
      this.snackBar.open(
        "Aknowledgement ID created",
        this.searchCustomerResponse.message,
        { duration: 4000 }
      );
      this.getDedupeSearchCustomerStatus(this.searchCustomerResponse);
    } else {
      this.disableInspect = false;
      this.snackBar.open(
        "Aknowledgement ID not created. Please re-try",
        "Failure!!",
        { duration: 4000 }
      );
    }
  }

  getDedupeSearchCustomerStatus(
    searchCustomerResponse: SearchCustomerResponse
  ) {
    this.kcreditLoanService
      .getDedupeSearchCustomerStatus(searchCustomerResponse.acknowledgementID)
      .subscribe(
        (res) => this.onSuccessOfDedupeStatusUpdate(res),
        (res) => this.onErrorOfDedupeStatusUpdate(res.error)
      );
  }

  onErrorOfDedupeStatusUpdate(res: any) {
    this.searchCustomerResponse = res;
    this.disableInspect = false;
    this.snackBar.open(
      this.searchCustomerResponse.message +
        " - Error : " +
        this.searchCustomerResponse.responseCode,
      "Please re-try",
      { duration: 4000 }
    );
  }

  onSuccessOfDedupeStatusUpdate(
    searchCustomerResponse: SearchCustomerResponse
  ) {
    this.searchCustomerResponse = searchCustomerResponse;
    if (
      searchCustomerResponse.matchCount === null ||
      searchCustomerResponse.matchCount === undefined
    ) {
      this.disableInspect = false;
      this.snackBar.open(
        "Please re-initiate Inspect",
        "Maximum re-try limit reached",
        { duration: 6000, horizontalPosition: "center" }
      );
    } else if (searchCustomerResponse.matchCount > 0) {
      this.executedDedupeResultList =
        searchCustomerResponse.executedDedupeResultList;
    } else {
      this.noMatch = true;
    }
  }

  setSearchCustomerRequest(applicantType: any) {
    if (this.loanApplicationDTO) {
      this.searchCustomerRequest.setLenderId =
        this.loanApplicationDTO.associateLenderId;
      this.searchCustomerRequest.setLoanApplicationId =
        this.loanApplicationDTO.id;
    }
    if (applicantType === DedupeEntityType.applicant) {
      if (this.loanDetails.customerDTO)
        this.searchCustomerRequest.setDedupeEntityId =
          this.loanDetails.customerDTO.id;
      this.searchCustomerRequest.setDedupeEntityType =
        DedupeEntityType.applicant;
    } else {
      this.searchCustomerRequest.setDedupeEntityId =
        this.dedupeDataForComponent.coApplicantId;
      this.searchCustomerRequest.setDedupeEntityType =
        DedupeEntityType.co_applicant;
    }
  }

  private onError(error) {
    this.error = false;
    setTimeout(() => {
      this.alertService.error(error.error, null, null);
    }, 100);
  }

  onCheckboxChange(executedDedupeResult, event) {
    if (event.target.checked) {
      this.selectedDedupe = executedDedupeResult;
      this.updateUcic = true;
    } else {
      this.updateUcic = false;
    }
  }

  callCreateUcic() {
    this.assignUCICRequest.setUcicFlag = "New";
    this.assignUcic(this.assignUCICRequest);
  }

  callUpdateUcic() {
    this.assignUCICRequest.setUcicFlag = "Update";
    this.assignUCICRequest.setVerifiedUCIC = this.selectedDedupe.ucic;
    this.assignUcic(this.assignUCICRequest);
  }

  assignUcic(assignUCICRequest: any) {
    this.disableInspect = true;
    assignUCICRequest.setAcknowledgementId =
      this.searchCustomerResponse.acknowledgementID;
    this.kcreditLoanService.assignUcic(assignUCICRequest).subscribe((res) => {
      this.onResponseOfAssignUcic(res);
    });
  }

  onResponseOfAssignUcic(res) {
    this.applicantTypeUcic = res.ucic;
    this.ucicCreatedOrUpdated = true;
  }
}
