import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getProperty } from "src/app/utils/app.utils";
import { AssignToUserService } from "../../services/assign-to-user.service";
import { LoanApplicationSearchFilterService } from "../../services/loan-application-search-filter.service";
import { FormControl } from "@angular/forms";
import { UiConfigService } from "../../services/ui-config.service";

@Component({
  selector: "app-assign-to-user",
  templateUrl: "./assign-to-user.component.html",
  styleUrls: ["./assign-to-user.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AssignToUserComponent implements OnInit {
  @Input() fromEntry: boolean = false;
  @Input() loanId: number = null;
  @Input() selectedAssignee: string = null;
  @Input() filterKey: string = "ASSIGNEE";

  filter: any = {
    label: "Assigned To",
  };
  searchFieldFormControl: FormControl = new FormControl();
  sortedAssignees: Array<any> = [];
  assignees: Array<any> = [];

  constructor(
    private readonly assignToUserService: AssignToUserService,
    private readonly loanAppFilterService: LoanApplicationSearchFilterService,
    private readonly snackbar: MatSnackBar,
    private readonly uiConfigService: UiConfigService
  ) {}

  ngOnInit(): void {
    this.getAllAssignees();
    this.searchFieldFormControl.valueChanges.subscribe((input) => {
      this.sortedAssignees = this.assignees.filter((assignee) => {
        return assignee.label.toLowerCase().includes(input.toLowerCase());
      });
    });
  }

  getAllAssignees() {
    this.loanAppFilterService
      .fetchFilterData(["ASSIGNEE"], this.loanId)
      .subscribe(
        (response) => {
          this.assignees = getProperty(response, this.filterKey, []);
          this.sortedAssignees = [...this.assignees];
        },
        (error) => console.error(error)
      );
  }

  menuHandler(item: any = "") {
    if (!this.loanId) {
      return null;
    }
    this.assignToUserService.assignToUser(this.loanId, item?.value).subscribe(
      () => {
        this.selectedAssignee = item?.label;
        this.snackbar.open("User Assigned Successfully", "", {
          duration: 3000,
        });
        this.uiConfigService.checkApprovalButton(this.loanId);
      },
      (error) => {
        console.error(error);
        this.snackbar.open(
          getProperty(error, "error.message", "Error while User Assignment"),
          "",
          { duration: 3000 }
        );
      }
    );
  }

  resetMenu(): void {
    this.sortedAssignees = [...this.assignees];
    this.searchFieldFormControl.setValue("");
  }
}
