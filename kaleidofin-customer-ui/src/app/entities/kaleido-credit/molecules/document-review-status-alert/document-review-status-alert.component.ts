import { Component, Input, OnChanges } from "@angular/core";

@Component({
  selector: "document-review-status-alert",
  templateUrl: "./document-review-status-alert.component.html",
  styleUrls: ["./document-review-status-alert.component.scss"],
})
export class DocumentReviewStatusAlert implements OnChanges {
  @Input() rejectReasons: string = "";
  @Input() reviewStatus: string = "";
  reasons: Array<string> = [];

  ngOnChanges(): void {
    if (this.rejectReasons) {
      this.reasons = this.rejectReasons.split(",");
    }
    switch (this.reviewStatus?.toLocaleLowerCase()) {
      case "reject":
      case "rejected":
        this.reviewStatus = "REJECT";
        break;
      case "accept":
      case "accepted":
        this.reviewStatus = "ACCEPT";
        break;
      default:
        this.reviewStatus = "";
    }
  }
}
