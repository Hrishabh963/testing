import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getProperty } from "src/app/utils/app.utils";
import { AmlService } from "../../services/anti-money-laundering/anti-money-laundering.service";
import { AmlHit } from "../../services/anti-money-laundering/anti-money-laundering.constants";

const verify = "assets/images/aml/verify.svg";
const verified = "assets/images/aml/verified.svg";

@Component({
  selector: "app-aml-hit-table",
  templateUrl: "./aml-hit-table.component.html",
  styleUrls: ["./aml-hit-table.component.scss"],
})
export class AmlHitTableComponent implements OnInit {
  @Input() hits: AmlHit[] = [];
  @Input() branchCode: any = "";
  @Input() yearOfBirth: any = "";
  @Input() loanApplicationId: any = "";
  showDetail: boolean = true;
  enableVerifyAll: boolean = false;
  tableColumns: any[] = [
    {
      key: "searchName",
      displayValue: "Search name",
    },
    {
      key: "entity",
      displayValue: "Entity",
    },
    {
      key: "alias",
      displayValue: "AKA",
    },
    {
      key: "country",
      displayValue: "Country",
    },
  ];

  constructor(
    private readonly amlService: AmlService,
    private readonly snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.checkForVerifyAll();
  }

  checkForVerifyAll(): void {
    this.enableVerifyAll = this.hits?.some((hit)=> {
      return hit?.action === "Verify";
    }); 
  }

  updateDisplay(): void {
    this.showDetail = !this.showDetail;
  }

  getVerifyStatus(hit: any = {}): string {
    const action = getProperty(hit, "action", "verify").toLowerCase();
    return action;
  }

  verifyAml(event: Event | KeyboardEvent = null, hit: any = {}): void {
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (!(event instanceof KeyboardEvent) || event.code === "Entered") {
      const status = getProperty(hit, "action", "").toLowerCase();
      if (status === "verified") {
        return;
      }
      const payload: any = [this.getPayload(hit)];
      this.amlService.verifyAmlDetails(payload, this.branchCode).subscribe(
        () => {
          hit.action = "Verified";
          this.checkForVerifyAll();
        },
        (error) => {
          console.error(error);
          const errorMessage = getProperty(error, "error.message");
          this.snackbar.open(errorMessage ?? "Error verifying AML hit", "", {
            duration: 5000,
          });
        }
      );
    }
  }

  getText(amlType: string = null, requiredType: string = null): string | null {
    if (!amlType?.length) {
      return null;
    }
    return amlType === requiredType ? "Match" : null;
  }

  verifyAll(event: Event | KeyboardEvent): void {
  if (!(event instanceof KeyboardEvent) || event.code === "Enter") {
    const verifyHits = this.hits.filter((hit) => hit?.action === "Verify");

    if (verifyHits.length === 0) return;

    const payload = verifyHits.map((hit) => this.getPayload(hit));

    this.amlService.verifyAmlDetails(payload, this.branchCode).subscribe(
      () => {
        verifyHits.forEach((hit) => {
          hit.action = "Verified";
        });
        this.checkForVerifyAll();
      },
      (error) => {
        const errorMessage = getProperty(error, "error.message");
        this.snackbar.open(errorMessage ?? "Error verifying AML hit", "", {
          duration: 5000,
        });
      }
    );
  }
}

getPayload(hit: AmlHit): any {
  return {
    name: getProperty(hit, "searchName", null),
    matchNo: getProperty(hit, "hitNo", null),
    yearOfBirth: this.yearOfBirth,
    loanApplicationId: this.loanApplicationId,
  };
}

}
