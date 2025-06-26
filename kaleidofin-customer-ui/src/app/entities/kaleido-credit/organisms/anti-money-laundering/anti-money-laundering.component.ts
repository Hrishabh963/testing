import { Component, Input, OnInit } from "@angular/core";
import { AmlService } from "../../services/anti-money-laundering/anti-money-laundering.service";
import { getProperty } from "src/app/utils/app.utils";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AML } from "../../services/anti-money-laundering/anti-money-laundering.constants";
@Component({
  selector: "app-anti-money-laundering",
  templateUrl: "./anti-money-laundering.component.html",
  styleUrls: ["./anti-money-laundering.component.scss"],
})
export class AntiMoneyLaunderingComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel = {};
  @Input() loanApplicationId: number = null;

  amlDetails: AML[] = [];
  partnerCustomerId: string = null;
  partnerLoanId: string = null;
  branchCode: number = null;
  displayDetails: boolean = true;

  constructor(
    private readonly amlService: AmlService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.loanDetails).length) {
      const loanApplicationDTO = getProperty(
        this.loanDetails,
        "loanApplicationDTO",
        {}
      );
      this.partnerCustomerId = getProperty(
        loanApplicationDTO,
        "partnerCustomerId",
        null
      );
      this.partnerLoanId = getProperty(
        loanApplicationDTO,
        "partnerLoanId",
        null
      );
      this.branchCode = getProperty(this.loanDetails, "branchDTO.code", "");
      this.loadAmlDetails();
    }
  }

  loadAmlDetails() {
    this.amlService
      .fetchAmlData(this.partnerCustomerId, this.partnerLoanId, this.branchCode)
      .subscribe(
        (amlData: Array<any>) => {
          this.amlDetails = amlData;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  initiateAml(payload: any = {}): void {
    this.amlService.initiateAML(payload, this.branchCode).subscribe(
      (amlData: AML) => {
        let index = this.amlDetails.findIndex((value) => {
          return value.type === amlData.type;
        });
        if (index >= 0) {
          this.amlDetails[index] = amlData;
        }
      },
      (error) => {
        console.error(error);
        const errorMessage: string = getProperty(error, "error.message", null);
        this.snackbar.open(errorMessage ?? "Error fetching AML Details", "", {
          duration: 3000,
        });
      }
    );
  }

  refreshAmlData(): void {
    this.loadAmlDetails();
  }
}
