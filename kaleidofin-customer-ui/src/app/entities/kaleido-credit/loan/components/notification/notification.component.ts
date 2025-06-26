import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { NotificationsService } from "../../../services/notifications.service";
import { get } from "lodash";
import { DependableFieldValidationService } from "../../../dependable-field-validation.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notification.html",
  styleUrls: ["./notification.css"],
})
export class NotificationComponent implements OnInit, OnChanges {
  @Input() remarks: string = "";
  @Input() actionRequired: string = "";
  @Input() applicationStatus: string = "";
  @Input() reviewDateTime: string = "";
  @Input() lender: string = "";
  @Input() workflow: string = "";
  @Input() isReferred: boolean = false;
  @Input() loanId: number;
  errors: any = {};
  notification: string = "";
  canShowReview: boolean = false;

  notificationCount = 0;

  notificationsList: string[] = [];

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly dependableFieldCheck: DependableFieldValidationService
  ) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((response) => {
      this.notification = response.notificationsList;
      if (this.notification) {
        let newNotifications = this.notification.split(",");
        if (newNotifications && newNotifications?.length) {
          newNotifications.forEach((notification) => {
            if (this.notificationsList.indexOf(notification) === -1) {
              this.notificationsList.push(notification);
            }
          });
        }
      }
      this.notificationCount = this.notificationsList.length;
      this.checkRemarks();
      this.errors = response.errors;
      this.notificationCount += Object.keys(this.errors).length;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!get(changes, "remarks.firstChange", true)) {
      this.checkRemarks();
    }
    let uniqueNotifications = new Set<string>(this.notificationsList);
    if (!get(changes, "loanId.firstChange", true)) {
      this.dependableFieldCheck.loanStageCheck(
        this.loanId,
        this.applicationStatus
      );
      this.dependableFieldCheck
        .getRemarksDTO()
        .subscribe((remarks: Array<any>) => {
          if (remarks && remarks.length > 0) {
            remarks.forEach((sectionRemark) => {
              Object.keys(sectionRemark.validationFieldErrors || {}).forEach(
                (key) => {
                  const sectionError = sectionRemark.validationFieldErrors[key];
                  sectionError.self?.forEach((selfError) => {
                    uniqueNotifications.add(selfError);
                  });
                }
              );
            });
          }
          this.notificationsList = Array.from(uniqueNotifications);
          this.notificationCount = this.notificationsList.length;
          this.checkRemarks();
        });
    }
  }

  checkRemarks(): void {
    this.canShowReview =
      [
        "reject",
        "retry",
        "pending",
        "cancelled",
        "externalpending",
        "approve",
        "agreementretry",
        "pendingagreement",
        "agreementreceived",
      ].includes(this.applicationStatus) && !!this.remarks;

    if (this.canShowReview) {
      this.notificationCount++;
    }
  }
}
