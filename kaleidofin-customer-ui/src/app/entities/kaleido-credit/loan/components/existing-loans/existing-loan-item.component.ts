import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';
import { KcreditLoanService } from '../../kcredit-loan.service';

@Component({
  selector: "jhi-existing-loan-item",
  templateUrl: "./existing-loan-item.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class ExistingLoanItemComponent {
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();
  @Input() existingLoan: any;
  @Input() index: number;
  initialExistingLoan: any;
  error: boolean;
  editExistingLoan: boolean = false;

  constructor(
    private readonly alertService: JhiAlertService,
    private readonly kcreditLoanService: KcreditLoanService
  ) {}

  ngOnInit() {
    this.initialExistingLoan = { ...this.existingLoan };
  }

  enableEdit() {
    this.editExistingLoan = true;
  }

  cancelEdit() {
    this.editExistingLoan = false;
    this.existingLoan = { ...this.initialExistingLoan };
  }

  closeEdit() {
    this.editExistingLoan = false;
  }

  save(existingLoan) {
    this.kcreditLoanService.updateExistingLoan(existingLoan).subscribe(
      (res) => this.onSuccess(res),
      (res) => this.onSaveError(res)
    );
  }

  private onSaveError(error) {
    try {
      error = error.json();
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

  onSuccess(res) {
    this.closeEdit();
    this.reloadAfterSave.emit("Existing Loans");
  }
}

