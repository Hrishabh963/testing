import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrincipalService } from 'src/app/core';
import { DashboardService } from '../../dashboard/dashboard.service';
import { DemandService } from '../demand.service';
import { JobDetailsDTO } from '../jobdetails.model';
import { TableUtil } from './tableUtil';

export interface DialogData {
  response: 'success' | 'failure' | 'else';
  data: JobDetailsDTO;
}

@Component({
  selector: 'app-demand-upload',
  templateUrl: './demand-upload.component.html',
  styleUrls: ['./demand-upload.component.scss'],
})
export class DemandUploadComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  uploadFile: any;
  fileName: any;
  file: any;
  jobDetails: JobDetailsDTO;
  excelHeaders: string[] = [
    'Customer',
    'Customer Id',
    'Loan Id',
    'Due Date',
    'Due Amount',
  ];
  templateToExcel: string[][] = [this.excelHeaders, []];
  errorDisplayedOnScreen: any;

  constructor(
    private readonly demandService: DemandService,
    private readonly dashboardService: DashboardService,
    private readonly principal: PrincipalService,
    public readonly dialog: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage('shownav');
    });
    this.fileInput.nativeElement.value = '';
    this.fileName = undefined;
    this.demandService.getUploadTemplateHeaders().subscribe((response) => {
      this.excelHeaders = response;
      this.templateToExcel = [this.excelHeaders, []];
    });
  }

  cancel() {
    this.ngOnInit();
  }

  onBrowseFile(event: any) {
    this.uploadFile = event.target.files.item(0);
    this.fileName = this.uploadFile.name;
    this.import();
  }

  import() {
    this.demandService
      .partnerCustomerDemandDataUpload(this.uploadFile)
      .subscribe(
        (response) => {
          this.jobDetails = response;
          this.onFileUploadSuccess(this.jobDetails);
        },
        (error) => {
          this.onError(error);
        }
      );
    this.fileInput.nativeElement.value = '';
    this.fileName = undefined;
  }

  onFileUploadSuccess(res: JobDetailsDTO) {
    if (res.successResponse) {
      this.onSuccess(res);
    } else {
      this.onError(res);
    }
  }

  onSuccess(res: any) {
    this.openDialog('success');
  }

  onError(error: any) {
    if (error.responseMessage) {
      this.errorDisplayedOnScreen = error.responseMessage;
    } else if (error.error) {
      this.errorDisplayedOnScreen = error.error;
    } else {
        this.errorDisplayedOnScreen = error.message;
    }
    this._snackBar.open(this.errorDisplayedOnScreen, 'Close', {
      duration: 3000,
    });
  }

  exportFile() {
    TableUtil.exportArrayToExcel(this.templateToExcel, 'PartnerLoanDemand');
  }

  openDialog(res: string) {
    this.dialog.open(ResponseDialog, {
      height: '305px',
      width: '1002px',
      data: {
        response: res,
        data: this.jobDetails,
      },
    });
  }
}

@Component({
  selector: 'response-dialog',
  templateUrl: './response-dialog.html',
  styleUrls: ['./response-dialog.component.scss'],
})
export class ResponseDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
