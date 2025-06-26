import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NachFormService } from '../nach-form-generation.service';

import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../../dashboard/dashboard.service';

import { animate, style, transition, trigger } from '@angular/animations';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { CanComponentDeactivate } from 'src/app/blocks/guards/candeactivate.guard';
import { PrincipalService } from 'src/app/core';
import { TopNavService } from 'src/app/layouts/navbar/topnav.service';
import { TableUtil } from '../../demand/demand-upload/tableUtil';
import { JobDetailsDTO } from '../../demand/jobdetails.model';

export interface FileStatus {
  status: 'progress' | 'done' | null;
  percent: number;
  requestType: 'Uploading' | 'Downloading' | null;
  loaded: number;
  total: number;
}

@Component({
  selector: 'ig-nach-form-upload',
  templateUrl: './nach-form-upload.component.html',
  styleUrls: ['./nach-form-upload.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s ease-out', style({ height: '100%', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '100%', opacity: 1 }),
        animate('0.5s ease-in', style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ],
})
export class NachFormUploadComponent
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  @ViewChild('fileInput', { static: true })
  fileInput!: ElementRef;
  uploadFile: any;
  fileName: any;
  file: any;
  nachFormsList: any[] = [];
  unsavedProgress: boolean = false;

  excelHeaders: string[] = [
    'Date',
    'Customer Name',
    'Reference No (Loan ID)',
    'To debit',
    'Utility Code',
    'Sponsor Bank code',
    'Mandate Name',
    'Bank Name',
    'Bank A/c No',
    'IFSC/MICR',
    'Amount',
    'Debit Type',
    'Frequency',
    'Start Date',
    'End Date / Until Cancelled',
    'Phone No',
  ];
  templateToExcel: string[][] = [this.excelHeaders, []];
  errorDisplayedOnScreen: any;
  fileStatus: FileStatus = {
    status: null,
    percent: 0,
    requestType: null,
    loaded: 0,
    total: 0,
  };
  uploadScreen: boolean = false;
  nachFormListScreen: boolean = false;
  partnerId: any;
  nachMaxAmount: any;
  title = 'Nach Form Upload';
  constructor(
    private readonly nachFormService: NachFormService,
    private readonly dashboardService: DashboardService,
    private readonly principal: PrincipalService,
    public  readonly dialog: MatDialog,
    private readonly _snackBar: MatSnackBar,
    private readonly topNavService: TopNavService,
    private readonly router: Router
  ) {
    console.log('nach upload init');
    this.topNavService.topNav$.next('nachUpload');
  }
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (
      !this.nachFormsList ||
      this.nachFormsList.length == 0 ||
      !this.unsavedProgress
    )
      return true;
    const result = confirm('There are pending files to process! Are you sure?');
    if (result) {
      this.cancelJobDetails();
    }
    return of(result);
  }

  ngOnInit() {
    this.principal.identity().then((account) => {
      this.partnerId = account.partnerId || 1;
      this.dashboardService.sendMessage('hide');
      this.topNavService.topNav$.next('default');
      this.getSampleTemplate();
    });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileName = undefined;

    if (!this.nachFormsList.length) {
      this.showUploadScreen();
    }
  }
  ngOnDestroy() {
    this.topNavService.topNav$.next('default');
  }

  getSampleTemplate() {
    this.nachFormService.getUploadTemplateHeaders().subscribe((res) => {
      this.templateToExcel = [res, []];
    });
  }

  public showUploadScreen() {
    this.uploadScreen = true;
    this.nachFormListScreen = false;
    this.cancelUpload();
  }
  public showNachListScreen() {
    this.uploadScreen = false;
    this.nachFormListScreen = true;
  }

  cancelUpload() {
    this.fileStatus = {
      status: null,
      percent: 0,
      requestType: 'Uploading',
      loaded: 0,
      total: 0,
    };
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileName = null;
  }

  onBrowseFile(event: any) {
    const items = event?.target?.files || [];
    this.uploadFile = items.item(0);
    this.fileName = this.uploadFile.name;
    const formData = new FormData();
    formData.set('files', this.uploadFile, this.fileName);
    this.fileUploader(formData);
  }
  updateNachList(nachForm: any) {
    this.nachFormsList.push(nachForm);
    this.showNachListScreen();
  }

  fileUploader(formData: FormData) {
    const jobName = 'SystemGeneratedNachPartnerBackOffice';
    const docType = 'NachAndMsa';
    this.nachMaxAmount = 5000;
    this.nachFormService
      .uploadNachForm(
        jobName,
        formData,
        this.partnerId,
        docType,
        this.nachMaxAmount
      )
      .subscribe(
        (event) => {
          this.reportProgress(event);
        },
        (error: HttpErrorResponse) => {
          this.fileStatus.status = null;
          const msg: string = error.error;
          if (error.error == 'EMPTY_ROW') {
            this._snackBar.open('Upload file is Empty', 'close', {
              duration: 2000,
            });
          } else if (msg.includes('HeaderMismatch')) {
            this._snackBar.open(msg, 'close', { duration: 5000 });
          } else if (msg.includes('expected format')) {
            this._snackBar.open('Wrong file format uploaded.', 'close', {
              duration: 2000,
            });
          } else if (msg.includes('Empty header at column')) {
            this._snackBar.open(msg, 'close', { duration: 4000 });
          } else
            this._snackBar.open('Oops! Something went wrong', 'close', {
              duration: 2000,
            });
        }
      );
  }

  reportProgress(httpEvent: HttpEvent<JobDetailsDTO>) {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(
          httpEvent.loaded,
          get(httpEvent, 'total', 0),
          'Uploading'
        );
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Object) {
          this.fileStatus.status = 'done';
          this.updateNachList(httpEvent.body);
        }
        break;
      default:
        console.log(httpEvent);
    }
  }

  updateStatus(loaded: number, total: number, str: any) {
    if (total === 0) {
      this._snackBar.open(`Error. File size can't be zero.`, 'close', {
        duration: 2000,
      });
      return;
    }
    this.fileStatus.status = 'progress';
    this.unsavedProgress = true;
    this.fileStatus.requestType = str;
    this.fileStatus.percent = Math.round((100 * loaded) / total);
    this.fileStatus.loaded = loaded;
    this.fileStatus.total = total;
  }

  cancelJobDetails() {
    const jobDetailsIdList: any = this.getJobDetailsIDlist();
    if (!jobDetailsIdList) return;
    this.nachFormService
      .cancelNachJobDetails(jobDetailsIdList)
      .subscribe(() => {
        this.router.navigate(['nachForms/prefilledNachForms']);
      });
  }

  onError(error: any) {
    if (error.responseMessage) {
      this.errorDisplayedOnScreen = error.responseMessage;
    } else if (error.error){
       
        this.errorDisplayedOnScreen = error.error;
      } else {
        this.errorDisplayedOnScreen = error.message;
      }
    this._snackBar.open(this.errorDisplayedOnScreen, 'Close', {
      duration: 3000,
    });
  }

  removeFile(taskId: any[], i: any) {
    console.log(taskId, 'remove.....');
    if (!taskId) {
      this._snackBar.open('Remove failed', 'close', {
        duration: 2000,
      });
      return;
    }
    this.nachFormService
      .cancelNachJobDetails(taskId.join(','))
      .pipe(take(1))
      .subscribe((resp) => {
        this.nachFormsList.splice(i, 1);
        if (this.nachFormsList.length == 0) {
          this.showUploadScreen();
        }
      });
  }
  reupload(taskId: any[], i: any) {
    console.log(taskId, 'reupload.....');
    if (!taskId) {
      this._snackBar.open('Reupload failed', 'close', { duration: 2000 });
      return;
    }
    this.nachFormService
      .cancelNachJobDetails(taskId.join(','))
      .pipe(take(1))
      .subscribe((resp) => {
        this.nachFormsList.splice(i, 1);
        this.showUploadScreen();
      });
  }

  proceedGenerateNachForm() {
    this.unsavedProgress = false;
    for (let job of this.nachFormsList) {
      this.nachFormService
        .executeJobDetailsAndUpdate(job.taskId)
        .subscribe((res) => {
          console.log(res);
        });
    }
    this.router.navigate(['nachForms/prefilledNachForms']);
  }

  getJobDetailsIDlist() {
    return this.nachFormsList.map((val) => {
      return val.taskId;
    });
  }
  niceBytes(x: any) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
  }
  async exportFile() {
    if (!this.templateToExcel) {
      this._snackBar.open('Template is empty', 'Close', {
        duration: 3000,
      });
    }
    TableUtil.exportArrayToExcel(
      this.templateToExcel,
      'Sample-prefill-NACH-template'
    );
  }
  back() {
    this.router.navigate(['/nachForms/prefilledNachForms']);
  }
  downloadSample() {
    this.dashboardService.getSample().subscribe(
      (resp) => {
        console.log(resp);
        let file = new Blob([resp], { type: resp.type });
        console.log(resp, '---------Download--------');
        saveAs(file, 'Pre filled NACH form upload template');
      },
      //Error - case
      () => {
        this._snackBar.open('Error downloading the sample excel file');
      }
    );
  }
}
