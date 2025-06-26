import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { LoanActivityService } from "../../services/loan-activity.service";

@Component({
  selector: "app-loan-activity",
  templateUrl: "./loan-activity.component.html",
  styleUrls: ["./loan-activity.component.scss"],
})
export class LoanActivityComponent implements OnInit, OnChanges {
  @Input() loanId: number = null;
  @Input() viewComment: boolean = false;
  @Input() updateComment: boolean = false;
  data: Array<any> = [];
  selectedTabIndex: number = 2;
  userName: string = "";
  enableActivitySection: boolean = false;
  constructor(
    private readonly activityService: LoanActivityService,
    private readonly principalService: PrincipalService,
    private readonly associateLenderService: AssociateLenderService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["viewComment"]) {
      this.enableActivitySection = this.viewComment && this.associateLenderService.isActivitySectionEnabled;
    }
  }

  ngOnInit(): void {
    this.fetchActivities("COMMENT,HISTORY");
    this.userName = getProperty(
      this.principalService,
      "userIdentity.login",
      ""
    );
    this.enableActivitySection = this.viewComment && this.associateLenderService.isActivitySectionEnabled;
  }
  fetchActivities(label: string = "") {
    this.activityService.getActivityInformation(this.loanId, label).subscribe(
      (response: Array<any>) => {
        this.data = response;
      },
      (error) => console.error(error)
    );
  }
  handleTabChange(index: number) {
    this.selectedTabIndex = index;
    switch (index) {
      case 2:
        this.data = [];
        this.fetchActivities("COMMENT");
        break;
      case 3:
        this.data = [];
        this.fetchActivities("HISTORY");
        break;
      default:
        this.data = [];
        this.fetchActivities("COMMENT,HISTORY");
        break;
    }
  }
}
