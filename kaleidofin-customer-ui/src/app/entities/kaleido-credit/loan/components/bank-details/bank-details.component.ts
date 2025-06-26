import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SafeResourceUrl } from "@angular/platform-browser";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiAlertService } from "ng-jhipster";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { KCreditService } from "../../../kaleido-credit.service";
import { BankDetails } from "../../../models/customer/bank-details.model";
import { ReviewEntity } from "../../../models/kcredit-enum.model";
import { SubscriptionReviewPopupService } from "../../../services/customer-group/subscription-review/subscription-review-popup.service";
import { CustomerService } from "../../../services/customer/customer.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { LoanDetailsBankValidation } from "../bank-details-penny-drop-popup/loan-details-bank-validation.component";
import { cloneDeep } from "lodash";

@Component({
  selector: "jhi-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["../../kcredit-loan.css", "./bank-details.component.scss"],
})
export class BankDetailsComponent implements OnInit {
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  @Input() bankDetails: BankDetails;
  @Input() loanDetails: KcreditLoanDetailsModel;
  @ViewChild("bankDetailsForm") public bankDetailsForm: NgForm;
  initialBankDetails: BankDetails;
  editBankDetails: boolean = false;
  error: boolean;
  referenceCodeClassifiers: any;
  accountTypeRefCodes: any;
  disablePennyDrop: boolean;
  modelChanged = new Subject<string>();
  ifscSearch: any;
  modalRef: NgbModalRef;
  kycChequeEntityFileMapping: any = {};
  customerFileMappingList: any;
  chequeImage: SafeResourceUrl;

  constructor(
    private readonly alertService: JhiAlertService,
    private readonly customerService: CustomerService,
    private readonly customerReviewPopupService: SubscriptionReviewPopupService,
    private readonly kcreditService: KCreditService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initialBankDetails = { ...this.bankDetails };
    this.referenceCodeClassifiers = ["AccountType"];

    this.loanDetails?.customerFileMappingDTOList?.forEach(
      (selectedCustomerFileMapping) => {
        if (selectedCustomerFileMapping.fileType === "Cheque") {
          this.kycChequeEntityFileMapping = selectedCustomerFileMapping;
        }
      }
    );

    this.customerService
      .getCompleteReferanceCodes(this.referenceCodeClassifiers)
      .subscribe((res) => {
        this.accountTypeRefCodes = res.AccountType;
        this.updatePennyDropstatus();
        this.modelChanged.pipe(debounceTime(500)).subscribe(() => {
          if (
            this.bankDetailsForm?.form?.controls?.["ifscCode"]?.valid
          )
            this.searchIfsc(this.bankDetails.ifscCode);
        });
      });
  }

  updatePennyDropstatus() {
    this.disablePennyDrop =
      this.bankDetails.accountVerificationStatus &&
      (this.bankDetails.accountVerificationStatus == "SUCCESS" ||
        this.bankDetails.accountVerificationStatus == "FAILURE");
  }

  enableEdit() {
    this.editBankDetails = true;
  }

  cancelEdit() {
    this.editBankDetails = false;
    this.bankDetails = { ...this.initialBankDetails };
  }

  closeEdit() {
    this.editBankDetails = false;
  }

  saveBankDetails(bankDetails) {
    this.customerService.updateBankDetails(bankDetails).subscribe(
      (res) => this.onSuccess(res, "Bank Details"),
      (res) => this.onSaveError(res)
    );
  }

  private onSaveError(error) {
    try {
      error = error.json();
      this.editBankDetails = false;
    } catch (exception) {
      error.message = error.text();
    }
    this.onError(error);
  }

  private onError(error) {
    this.error = false;
    setTimeout(() => {
      this.alertService.error(error.error, null, null);
    }, 100);
  }

  onSuccess(res, entity) {
    this.closeEdit();
    this.bankDetails = res;
    this.initialBankDetails = cloneDeep(this.bankDetails);
    this.updatePennyDropstatus();
    this.reloadAfterSave.emit(entity);
  }

  searchIfsc(ifscCode) {
    this.customerService
      .searchIFSC(
        ifscCode,
        ReviewEntity.LoanApplication,
        this.loanDetails.loanApplicationDTO.id,
        this.bankDetails.customerId
      )
      .subscribe(
        (res) => {
          this.ifscSearch = res;
          if (
            this.ifscSearch.status == "VALIDATION_FAILED_MERGED" ||
            this.ifscSearch.status == "VALIDATION_FAILED_EXCLUDED"
          ) {
            this.ifscSearch.message = this.ifscSearch.message.substring(
              0,
              this.ifscSearch.message.indexOf(".") + 1
            );
            this.bankDetailsForm.form.controls["ifscCode"].setErrors({
              pattern: true,
            });
          } else {
            this.bankDetails.bankName =
              this.ifscSearch.BANK || this.ifscSearch.bank;
            this.bankDetails.bankBranch =
              this.ifscSearch.BRANCH || this.ifscSearch.branch;
            this.bankDetails.bankCode =
              this.ifscSearch.BANKCODE || this.ifscSearch.bankcode;
            this.bankDetails.micrCode =
              this.ifscSearch.MICR || this.ifscSearch.micr;
            this.bankDetails.bankAddress =
              this.ifscSearch.ADDRESS || this.ifscSearch.address;
            this.bankDetails.bankContact =
              this.ifscSearch.CONTACT || this.ifscSearch.contact;
            this.bankDetails.bankCity =
              this.ifscSearch.CITY || this.ifscSearch.city;
            this.bankDetails.bankDistrict =
              this.ifscSearch.DISTRICT || this.ifscSearch.district;
            this.bankDetails.bankState =
              this.ifscSearch.STATE || this.ifscSearch.state;
          }
        },
        (error) => {
          error = error.json();
          setTimeout(() => {
            this.alertService.error(error);
          }, 100);
        }
      );
  }

  changedIFSC() {
    this.modelChanged.next();
  }

  updateBankDetail() {
    this.kcreditService
      .updateBankDetailsOrCreate(
        this.loanDetails.loanApplicationDTO.id,
        this.bankDetails
      )
      .subscribe(
        (res: any) => {
          this.bankDetails = res.bankDetailDTO;
          this.updatePennyDropstatus();
          this.bankDetailsForm.form.markAsPristine();
          this.editBankDetails = false;
          this.initialBankDetails = { ...this.bankDetails };
          this.snackBar.open("Successfully updated ", "Bank Details", {
            duration: 4000,
          });
        },
        (er) => {
          this.alertService.error(
            "kaleidofinclientApp.customer.home.loanStatusFailure"
          );
        }
      );
  }

  openPennyDrop(forceResetCount = false) {
    this.bankDetails.validateAccount = true;
    this.kcreditService
      .validateBankDetail(
        this.bankDetails,
        this.bankDetails.customerId,
        forceResetCount
      )
      .subscribe(
        (res: any) => {
          this.bankDetails = res;
          this.openPopUp(res);
        },
        (res) => {
          if (res._body == "zne10001")
            this.openPopUp(this.bankDetails, res._body);
          this.alertService.error(
            "kaleidofinclientApp.customer.errorMessage",
            true
          );
        }
      );
  }

  openPopUp(bankDetailDTO: any, errorCode = null) {
    console.log(bankDetailDTO);
    const modalData: any = {
      bankDetails: bankDetailDTO,
      errorMsg: errorCode,
    };
    this.modalRef = this.customerReviewPopupService.openPennyDropPopup(
      <Component>LoanDetailsBankValidation,
      modalData
    );
    this.modalRef.result.then(({ bankDetail, forceRestCheck }) => {
      console.log(bankDetail);
      if (bankDetail) {
        this.bankDetails = bankDetail;
        this.updatePennyDropstatus();
      }
      if (forceRestCheck) {
        this.openPennyDrop(forceRestCheck);
      }
    });
  }
}
