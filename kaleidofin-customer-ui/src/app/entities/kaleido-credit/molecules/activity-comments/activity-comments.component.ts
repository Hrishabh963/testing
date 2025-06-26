import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from "@angular/core";

@Component({
  selector: "app-activity-comments",
  templateUrl: "./activity-comments.component.html",
  styleUrls: ["./activity-comments.component.scss"],
})
export class ActivityCommentsComponent implements OnChanges {
  @Input() activityData: Array<any> = [];
  @Input() loanId: number = null;
  @Input() userName: string = "";
  @Input() updateComment: boolean = true;
  @Output() reloadComments: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  refreshComments() {
    this.reloadComments.emit();
  }
  ngOnChanges(): void {
    this.activityData = this.activityData.filter((data) => data?.comment);
  }
}
