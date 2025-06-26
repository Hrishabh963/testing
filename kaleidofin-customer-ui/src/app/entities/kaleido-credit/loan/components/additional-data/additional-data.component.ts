import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { CustomerService } from "../../../services/customer/customer.service";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { AdditionalData } from "./additionaldata.model";

@Component({
  selector: "jhi-additional-data",
  templateUrl: "./additional-data.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class AdditionalDataComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  additionalDataMap: AdditionalData[] = [];
  chunkedAdditionalData: AdditionalData[][] = []; // Array of chunks (4 items per chunk)

  public additionalData: any = {};

  constructor(private readonly customerService: CustomerService) {}

  ngOnInit(): void {
    this.initialMappingOfField();
  }

  initialMappingOfField(): void {
    this.additionalDataMap = [];
    const additionalData = JSON.parse(
      getProperty(this.loanDetails, "loanApplicationDTO.additionalData") || "{}"
    );

    for (const key in additionalData) {
      if (additionalData.hasOwnProperty(key)) {
        this.additionalData[key] = additionalData[key];
        const addData: AdditionalData = {
          propertyName: key,
          propertyValue: additionalData[key],
        };
        this.additionalDataMap.push(addData);
      }
    }

    // Group the data into chunks of 4 items per row
    this.chunkedAdditionalData = this.chunkArray(this.additionalDataMap, 4);
  }

  // Helper function to chunk an array into smaller arrays of a specified size
  chunkArray(array: any[], chunkSize: number): any[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
