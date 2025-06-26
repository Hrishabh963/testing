import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getProperty } from "src/app/utils/app.utils";
import { LoanActivityService } from "../../../services/loan-activity.service";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: [
    "./comment.component.scss",
    "../../activity-all/activity-all.component.scss",
  ],
})
export class CommentComponent implements OnInit {
  @Input() data: any = {};
  @Input() showLabel: boolean = true;
  @Input() loanId: number = null;
  @Input() userName: string = "";
  @Input() updateComment: boolean = true;
  @Output() reloadComments: EventEmitter<any> = new EventEmitter<any>();
  enableEdit: boolean = false;

  commentType: string = "";
  initials: string = "";
  deletedCommentClass: string = "";
  constructor(
    private readonly loanActivityService: LoanActivityService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (getProperty(this.data, "deleted", false)) {
      this.commentType = "deleted";
      this.deletedCommentClass = "deletedComment";
    } else {
      this.commentType =
        getProperty(this.data, "version", 1) !== 1 ? "edited" : "added";
    }
    this.initials = this.loanActivityService.getInitials(
      getProperty(this.data, "createdBy", "")
    );

    this.data["canEdit"] =
      getProperty(this.data, "createdBy", "") === this.userName;
  }
  onEdit() {
    if(!this.updateComment){
      return;
    }
    this.enableEdit = true;
  }
  deleteComment() {
    if(!this.updateComment){
      return;
    }
    this.loanActivityService
      .deleteComment(getProperty(this.data, "id", null), this.loanId)
      .subscribe(
        () => {
          this.snackbar.open("Comment Deleted Successfully", "", {
            duration: 3000,
          });
          this.reloadComments.emit();
        },
        (error) => {
          console.error(error);
          this.snackbar.open("Error while deleting Comment", "", {
            duration: 3000,
          });
        }
      );
  }
  resetEdit() {
    this.enableEdit = false;
  }
}
