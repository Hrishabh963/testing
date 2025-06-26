import { Component, Input, OnChanges } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Clipboard } from "@angular/cdk/clipboard";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ROLES } from "src/app/core/auth/roles.constants";
import { camelCaseToRegularText } from "src/app/utils/app.utils";

@Component({
  selector: "app-notification-item",
  templateUrl: "./notification-item.html",
  styleUrls: ["./notification-item.css"],
})
export class NotificationItemComponent implements OnChanges {
  @Input() remarks: string = "";
  @Input() actionRequired: string = "";
  @Input() reviewDateTime: string = "";
  @Input() notification: string = "";
  @Input() lender: string = "";
  @Input() applicationStatus: string = "";
  @Input() workflow: string = "";
  @Input() isReferred: boolean = false;
  reasonType: string;
  reason: string;
  notificationHeader: string;

  constructor(
    private readonly datePipe: DatePipe,
    private readonly clipboard: Clipboard,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnChanges() {
    if (this.remarks) {
      this.determineReason();
      this.formatDateTime();
      this.formatRequiredActions();
    } else {
      this.notification = camelCaseToRegularText(this.notification);
    }
  }

  determineNotificationHeader() {
    if (
      this.lender === "DCB" &&
      ["pending", "externalpending"].includes(this.applicationStatus)
    ) {
      if (this.isReferred) {
        this.notificationHeader = "Reasons for Loan Review - Referred";
        return;
      }
      if (this.workflow === ROLES.ROLE_UNDERWRITER) {
        this.notificationHeader = "Reasons for Loan Review - Recommendation";
        return;
      }
      this.notificationHeader = "Reasons for Loan Review";
      
    } else {
      switch (this.applicationStatus) {
        case "agreementretry":
          this.notificationHeader = "Reasons for Rework";
          break;
        case "retry":
          this.notificationHeader = "Reasons for Rework";
          break;
        case "reject":
          this.notificationHeader = "Reasons for Rejection";
          break;
        case "cancelled":
          this.notificationHeader = "Reasons for Cancellation";
          break;
        case "approve":
          this.notificationHeader = "Reasons for Approving";
          break;
        case "agreementreceived":
          this.notificationHeader = "Reasons for Agreement";
          break;
        default:
          this.notificationHeader = "Reasons for Loan Review";
          break;
      }
    }
  }

  determineReason() {
    const lastIndex = this.remarks.lastIndexOf(":");
    if (lastIndex === -1) {
      this.reason = this.remarks;
    } else {
      this.reason = this.remarks.slice(0, lastIndex);
      this.reasonType = this.remarks.slice(lastIndex + 1);
    }
    this.determineNotificationHeader();
  }

  formatDateTime() {
    const parsedDate = new Date(this.reviewDateTime);
    const formattedDate = this.datePipe.transform(
      parsedDate,
      "dd MMM yyyy, HH:mm"
    );
    this.reviewDateTime = formattedDate;
  }

  formatRequiredActions() {
    let actions: string[];
    actions = this.actionRequired.split(",");
    actions.forEach((str, index) => {
      actions[index] = camelCaseToRegularText(str);
    });
    this.actionRequired = actions.join(", ");
  }

  copyToClipboard(event: Event) {
    event.stopPropagation();
    this.clipboard.copy(this.prepareTextToCopy());
    this.snackBar.open("Copied to clipboard", "Success", {
      duration: 2000,
    });
  }

  prepareTextToCopy(): string {
    if (this.notification) {
      return camelCaseToRegularText(this.notification);
    }
    return (
      `Reason category: ${!this.reasonType? "not specified" : this.reasonType }.\n` +
      `Reason: ${!this.reason? "not specified": this.reason}.\n` +
      `Action to be taken: ${!this.actionRequired? "not specified" : this.actionRequired }.\n` +
      `Dated: ${!this.reviewDateTime? "not specified" : this.reviewDateTime}`
    );
  }
}
