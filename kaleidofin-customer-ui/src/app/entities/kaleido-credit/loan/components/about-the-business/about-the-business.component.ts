import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { cloneDeep } from "lodash";
import { BUSINESS_DETAILS } from "src/app/shared/constants/Api.constants";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-about-the-business",
  templateUrl: "./about-the-business.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class AboutTheBusinessComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Output() reloadAfterSave = new EventEmitter<any>();

  businessDetails: any = {};
  initialBusinessDetails: any = {};
  isEditing: boolean = false;
  panelOpenState: boolean = true;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const params = new HttpParams().append(
      "loanApplicationId",
      this.route.snapshot.params["id"]
    );
    this.http.get(BUSINESS_DETAILS, { params }).subscribe((response) => {
      this.businessDetails = response || {};
      this.initialBusinessDetails = cloneDeep(this.businessDetails);
    });
  }

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
    this.saveInformation();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.businessDetails = { ...this.initialBusinessDetails };
  }

  edit(): void {
    this.isEditing = true;
  }

  saveInformation(): void {
    const payload = this.businessDetails;
    delete(payload["version"]);
    delete(this.businessDetails["version"]);
    this.http.put(BUSINESS_DETAILS, payload).subscribe(
      (response) => {
        this.isEditing = false;
        this.businessDetails = response || {};
        this.initialBusinessDetails = cloneDeep(this.businessDetails);
        this.reloadAfterSave.emit("About the business");
        this.snackBar.open("Remarks", "Successfully Saved!", {
          duration: 3000,
        });
      },
      () => {
        this.snackBar.open("Error in saving record", "Error", {
          duration: 3000,
        });
      }
    );
  }
}
