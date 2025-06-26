import {Input, Component, OnInit } from '@angular/core';
import { getProperty } from 'src/app/utils/app.utils';
import { LoanActivityService } from '../../../services/loan-activity.service';

@Component({
  selector: 'app-history-activity',
  templateUrl: './history-activity.component.html',
  styleUrls: ['./history-activity.component.scss','../../activity-all/activity-all.component.scss']
})
export class HistoryActivityComponent implements OnInit {
  @Input() data: any = {};
  @Input() showLabel: boolean = true;
  commentType: string = "";
  constructor(public loanActivityService:LoanActivityService) { }

  ngOnInit(): void {
    this.commentType =
      getProperty(this.data, "version", 1) !== 1 ? "edited" : "added";
  }
}
