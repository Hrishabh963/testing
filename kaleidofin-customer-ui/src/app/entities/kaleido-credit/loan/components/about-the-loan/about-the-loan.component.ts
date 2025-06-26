import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cloneDeep, get, set } from "lodash";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { KCreditLoanApplication } from "../../../report/kcredit-loan-application.model";
import { ProductCodeService } from "../../../services/product-code/product-code.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { LOAN_TENURE_UNIT } from "./constants";
import { ApplicationStatus } from "../../constant";
import { getProperty } from "src/app/utils/app.utils";
import { EmiAmountService } from "../../../services/emi-amount.service";
import { ConfirmationAlertsComponent } from "../../../atoms/confirmation-alerts/confirmation-alerts.component";
import { MatDialog } from "@angular/material/dialog";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";import { LoanReviewService } from "../../../report/loan-review.service";
@Component({
  selector: "jhi-about-the-loan",
  templateUrl: "./about-the-loan.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class AboutTheLoanComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() loanApplication: KCreditLoanApplication;

  @Output() reloadAfterSave = new EventEmitter<any>();
  @Output()
  saveProfileChange: EventEmitter<any> = new EventEmitter<any>();
  public initialLoanApplication: KCreditLoanApplication = {};
  public readonly loanTenureUnits = LOAN_TENURE_UNIT;
  public isEditing: boolean;
  public productCodeFormControl = new FormControl();
  public emiAmountFormControl = new FormControl();
  public productCodes: any = [];
  public filteredOptions: Observable<string[]>;
  public emiAmounts: any[] = [];
  public showDropDown: boolean = false;
  panelOpenState: boolean = true;
  isKcplLender: boolean = false;

  constructor(
    private readonly loanReviewService: LoanReviewService,
    private readonly snackBar: MatSnackBar,
    private readonly productCodeService: ProductCodeService,
    private readonly emiAmountService: EmiAmountService,
    public readonly dialog: MatDialog,
    private readonly lenderService: AssociateLenderService
  ) {
    this.isEditing = false;
    this.saveProfileChange = new EventEmitter();
  }

  ngOnInit() {
    this.isKcplLender = this.lenderService.getLenderCode() === "KCPL";
    this.loanApplication = this.loanDetails.loanApplicationDTO;
    if (
      this.loanApplication.firstTimeLoan === undefined ||
      this.loanApplication.firstTimeLoan == null
    ) {
      this.loanApplication.firstTimeLoan = false;
    }
    const loanId = get(this.loanApplication, "id", null);
    this.productCodeService.getAllLoanProductCodes(loanId).subscribe(
      (res) => {
        this.productCodes = res || [];
      },
      (err) => {
        console.error(err);
      }
    );
    this.filteredOptions = this.productCodeFormControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
    let productCode = get(this.loanApplication, "productCode", "");
    this.productCodeFormControl.setValue(productCode);

    this.initialLoanApplication = { ...this.loanApplication };
    let status = get(this.loanApplication, "applicationStatus", "");
    this.disableEdit = [
      ApplicationStatus.disbursed,
      ApplicationStatus.pendingdisbursal,
      ApplicationStatus.externaldisbursal,
    ].includes(status);
    this.getEmiAmounts();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productCodes.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  public clearInput = (): void => {
    this.productCodeFormControl.setValue("");
  };

  toggleEditDetails(event) {
    event.stopPropagation();
    this.isEditing = !this.isEditing;
  }
  cancel(event: Event): void {
    event.stopPropagation();
    this.cancelEdit();
  }
  save(event) {
    event.stopPropagation();
    const productCode = this.productCodeFormControl.value;
    const oldProductCode = this.loanApplication?.productCode;
    if (this.isKcplLender && oldProductCode !== productCode) {
      const dialogRef = this.dialog.open(ConfirmationAlertsComponent, {
        width: "33vw",
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.saveInformation();
        }
      });
    } else {
      this.saveInformation();
    }
  }

  public cancelEdit(): void {
    this.isEditing = false;
    this.loanApplication = { ...this.initialLoanApplication };
    this.productCodeFormControl.setValue(this.loanApplication?.productCode);
  }

  public edit(): void {
    this.isEditing = true;
  }

  public saveInformation() {
    const productCode = this.productCodeFormControl.value;
    const emiAmount = this.emiAmountFormControl.value;
    const loanApplication = cloneDeep(this.loanApplication);
    if (emiAmount) {
      set(loanApplication, "emiAmount", emiAmount);
    }
    if (productCode) {
      set(loanApplication, "productCode", productCode);
    }
    if (this.showDropDown) {
      const validValue = this.emiAmounts.some((value) => value === emiAmount);
      if (!validValue) {
        this.snackBar.open("Invalid EMI amount", "", {
          duration: 3000,
        });
        return;
      }
    }
    delete(loanApplication["version"]);
    delete(loanApplication?.["loanFeeDTO"]?.["version"]);
    this.productCodeService.validateProductCode(loanApplication).subscribe(
      (response) => {
        if (response?.validationErrors) {
          this.snackBar.open(response.validationErrors, "Error", {
            duration: 3000,
          });
        } else {
          this.loanReviewService.updateLoanDetails(response).subscribe(
            () => {
              this.isEditing = false;
              this.initialLoanApplication = { ...loanApplication };
              this.reloadAfterSave.emit("About the loan");
            },
            (error) => {
              this.snackBar.open(
                getProperty(error, "error.message", "Error in saving record"),
                "Error",
                {
                  duration: 3000,
                }
              );
            }
          );
        }
      },
      (error) => {
        this.snackBar.open(
          getProperty(error, "error.message", "Error in saving record"),
          "Error",
          {
            duration: 3000,
          }
        );
      }
    );
  }
  public validateProductCode = () => {
    let productCode = this.productCodeFormControl.value;
    return productCode && !this.productCodes.includes(productCode);
  };
  public validateSave = () => {
    return this.validateProductCode();
  };

  public clearEmiInput(): void {
    this.emiAmountFormControl.setValue("");
  }

  private getEmiAmounts(): void {
    this.showDropDown =
      getProperty(
        this.loanDetails,
        "loanApplicationDTO.applicationStatus",
        ""
      ) === ApplicationStatus.agreementretry;
    const loanId = getProperty(this.loanDetails, "loanApplicationDTO.id", null);
    this.emiAmountService.getEmiAmounts(loanId).subscribe(
      (response) => {
        this.emiAmounts = response;
      },
      (error) => console.error(error)
    );
  }
}
