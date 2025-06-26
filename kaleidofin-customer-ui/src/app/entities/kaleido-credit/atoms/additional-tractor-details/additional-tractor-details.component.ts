import { Component, Input } from "@angular/core";
import { AdditionalTractorDetailsService } from "../../services/additional-tractor-details.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-additional-tractor-details",
  templateUrl: "./additional-tractor-details.component.html"
})
export class AdditionalTractorDetailsComponent {
  @Input() loanId: number = null;

  constructor(
    private readonly service: AdditionalTractorDetailsService,
    private readonly snackbar: MatSnackBar
  ) {}

  openReport(reportData: any = {}) {
    const serializedData = encodeURIComponent(JSON.stringify(reportData));
    const encodedData = window.btoa(serializedData);
    const queryParams = new URLSearchParams();
    queryParams.set("data", encodedData);
    const baseUrl = window.location.href.split("#")[0]; 
    const url = `${baseUrl}/atd-report?${queryParams.toString()}`;
    window.open(url, "_blank");
  }
  
  openATDReport() {
    this.service.getAdditionalTractorDetailsReport(this.loanId).subscribe(
      (reportData) => {
        this.openReport(reportData);
      },
      (error) => {
        console.error(error);
        this.snackbar.open("Error fetching ATD Report", "", {duration:4000});
      }
    );
  }
}

const MOCK_DATA = {
  additionalTractorDetails: {
    title: "Additional Tractor Details",
    headers: ["Field(Tractor Details)", "ATD Value(Actual Value)"],
    rows: {
      manufacturer: {
        key: "Manufacturer",
        value1: "a value",
      },
      nameDealer: {
        key: "Name dealer",
        value1: "a value",
      },
      landOwnership: {
        key: "Land Ownership",
        value1: "a value",
      },
    },
  },
  customerSelectionCriteria: {
    title: "Customer Selection Criteria",
    headers: ["Criteria", "Attributes", "Actual Value"],
    rows: {
      eligibleCustomer: {
        key: "Eligible Customer",
        value1: "Owner cultivator of agricultural lands",
        value2: "a value",
      },
      geographicalLimit: {
        key: "Geographical Limit",
        value1: "Owner cultivator of agricultural lands",
        value2: "a value",
      },
    },
  },
};
