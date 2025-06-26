import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";
import { SubscriptionReviewService } from "../../services/customer-group/subscription-review/subscription-review.service";
import { PdfExportService } from "../../services/pdfexport.service";
import { FileService } from "../../services/files/file.service";

@Component({
  selector: "app-ekyc-report",
  templateUrl: "./ekyc-report.component.html",
  styleUrls: ["./ekyc-report.component.scss"],
})
export class EkycReportComponent implements OnInit {
  ekycData: any = {};
  applicantName: string = null;
  imageUrl: string = null;

  tableRow: Array<{label: string, propertyKey: string}> = [
    { label: "Careof (C/O)", propertyKey: "careof" },
    { label: "House No", propertyKey: "house" },
    { label: "Street", propertyKey: "street" },
    { label: "Landmark", propertyKey: "landmark" },
    { label: "Locality", propertyKey: "locality" },
    { label: "City", propertyKey: "city" },
    { label: "Sub District", propertyKey: "subDistrict" },
    { label: "District", propertyKey: "district" },
    { label: "State", propertyKey: "state" },
    { label: "Pin code", propertyKey: "pincode" },
    { label: "Post Office", propertyKey: "postoffice" },
    { label: "Country", propertyKey: "country" },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly subscriptionReviewService: SubscriptionReviewService,
    private readonly pdfExportService: PdfExportService,
    private readonly fileServ: FileService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty("data")) {
        const serializedData = params["data"];
        let data = JSON.parse(decodeURIComponent(window.atob(serializedData)));
        this.ekycData = data || {};
        const nameObj: any = getProperty(this.ekycData, "name.value", {});
        this.applicantName = getProperty(nameObj, "govData", null);
        const fileId: number = getProperty(this.ekycData, "fileId.value", null);
        this.getImageUrl(fileId);
      }
    });
  }

  async getImageUrl(fileId: number): Promise<void> {
    const response = await this.subscriptionReviewService
      .getFileData(fileId)
      .toPromise();
    const blob = await this.fileServ.downloadBlobFromS3(response);
    const dataUrl = await this.fileServ.blobToDataURL(blob);
    this.imageUrl = dataUrl;
  }
  downloadPdf(): void {
    this.pdfExportService.downloadCurrentPageAsPdf(this.getTitle());
  }

  getTitle(): string {
    if(!this.ekycData?.referenceNumber?.value) {
      return `${this.applicantName}_KYC`;
    }
    return `${this.ekycData?.referenceNumber?.value}_${this.applicantName}_KYC`;
  }

}
