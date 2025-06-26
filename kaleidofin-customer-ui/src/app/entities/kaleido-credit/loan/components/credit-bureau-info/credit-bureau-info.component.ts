import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { cloneDeep, get } from "lodash";
import { JhiAlertService } from "ng-jhipster";
import { CreditBureauInfo } from "../../../models/credit-bureau-info.model";
import { CustomerService } from "../../../services/customer/customer.service";
import { FileService } from "../../../services/files/file.service";
import { AuthorizationService } from "../../../services/authorization.service";
import { LoanReviewService } from "../../../report/loan-review.service";
import { AUTHORITES } from "../../../constants/authorization.constants";

@Component({
  selector: "jhi-credit-bureau-info",
  templateUrl: "./credit-bureau-info.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class CreditBureauInfoComponent implements OnInit, OnChanges {
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  @Input() bankDetails: CreditBureauInfo;
  @Input() loanId: string;
  @Input() cbReport: any;
  initialBankDetails: CreditBureauInfo;
  editBankDetails: boolean = false;
  error: boolean;
  authority = {
    view:false
  }
  constructor(
    private readonly alertService: JhiAlertService,
    private readonly customerService: CustomerService,
    private readonly fileService: FileService,
    private readonly authorizationService: AuthorizationService,
    private readonly loanReviewService:LoanReviewService
  ) {}

  ngOnInit() {
    this.authority.view = this.authorizationService.hasAuthorityByStage(AUTHORITES.UNDERWRITINGSCREEN_VIEWCIBILREPORTS,this.loanReviewService.getLoanStatus())
    this.bankDetails = this.bankDetails
      ? cloneDeep(this.bankDetails)
      : new CreditBureauInfo();
    this.initialBankDetails = this.bankDetails;
  }

  ngOnChanges(changes: SimpleChanges): void {
    let report = get(changes, "cbReport.currentValue", null);
    if (report) {
      this.bankDetails.cbName = get(report, "cbProvider", "--");
      this.bankDetails.cbScoreErs =
        get(report, "cbScoreErs", null) || get(report, "cbScore", null);
      this.bankDetails.cbScoreMrs = get(report, "cbScoreMrs", null);
      this.bankDetails.reportFileId = get(report, "cbHtmlFileId", null);
    }
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
    this.reloadAfterSave.emit(entity);
  }

  viewReport() {
    let reportFileId = get(this.bankDetails, "reportFileId", null);
    if (reportFileId) {
      this.fileService.getFileURL(reportFileId).subscribe((url) => {
        console.log(url);
        window.open(url, "_blank");
      });
    }
  }
}
