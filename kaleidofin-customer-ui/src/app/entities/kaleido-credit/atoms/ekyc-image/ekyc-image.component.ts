import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionReviewService } from '../../services/customer-group/subscription-review/subscription-review.service';
import { getProperty } from 'src/app/utils/app.utils';

@Component({
  selector: 'app-ekyc-image',
  templateUrl: './ekyc-image.component.html',
  styleUrls: ['./ekyc-image.component.scss']
})
export class EkycImageComponent implements OnInit {

  @Input() fileId: number = null;
  @Input() kycName: string = null;

  srcUrl: string = null;
  fileType: string = null;
  fileSize: number = null;
  bcDataName: string = null;

  constructor(private readonly subscriptionReviewService: SubscriptionReviewService) { }

  ngOnInit(): void {
    if(this.fileId) {
      this.subscriptionReviewService.getFileDtoFromFileId(this.fileId).subscribe((response)=> {
        this.bcDataName = getProperty(this.kycName, "bcData", null);
        this.srcUrl = getProperty(response, "path", null);
        this.fileType = getProperty(response, "type", null);
        this.fileSize = getProperty(response, "size", 0);
      }
      )
    }
  }

}
