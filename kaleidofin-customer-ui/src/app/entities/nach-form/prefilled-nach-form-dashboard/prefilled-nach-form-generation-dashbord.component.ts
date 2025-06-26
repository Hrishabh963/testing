import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { debounceTime } from 'rxjs/operators';
import { PrincipalService } from 'src/app/core';
import { TopNavService } from 'src/app/layouts/navbar/topnav.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { NachFormService } from '../nach-form-generation.service';

export interface TaskData {
  taskId: string;
  date: Date;
  fileName: string;
  total: number;
  success: number;
  failure: number;
  status: string;
  action: string;
}

@Component({
  selector: 'app-nach-form-generation-dashbord',
  templateUrl: './prefilled-nach-form-generation-dashbord.component.html',
  styleUrls: ['./prefilled-nach-form-generation-dashbord.component.scss'],
})
export class PrefilledNachFormDashboard implements OnInit {
  displayedColumns: string[] = [
    'id',
    'uploadedDate',
    'fileName',
    'total',
    'success',
    'failure',
    'status',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort();
  filterDate!: string;
  users: Array<TaskData> = [];
  searchInputWidth: boolean = false;
  nameFilter = new FormControl();
  fromDate!: Date;
  endDate!: Date;
  dateRange: any;
  nowDate = new Date();
  fileName: any;
  partnerId: any;
  itemPerPage: any;
  reponseDatasource: any;
  page: any;
  sortBy: any;
  orderBy: any;
  isPageEmpty: boolean = true;
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly principal: PrincipalService,
    private readonly router: Router,
    private readonly nachFormService: NachFormService,
    private readonly topNavService: TopNavService,
    private readonly snack: MatSnackBar
  ) {
    this.page = 0;
    this.itemPerPage = 10;
  }

  ngOnInit(): void {
    this.principal.identity().then((account) => {
      const currUser = account;
      this.partnerId = currUser.partnerId;
      this.dashboardService.sendMessage('shownav');
      this.topNavService.topNav$.next('nachForms');

      this.dataSource = new MatTableDataSource(this.users);

      this.nameFilter.valueChanges.pipe(debounceTime(1000)).subscribe((val) => {
        this.fileName = val;
        this.getTaskList(this.page, this.itemPerPage);
      });
    });
  }

  redirectNachUpload() {
    this.router.navigate(['nachForms/nachFormUpload']);
  }

  getTaskList(page: any, itemPerPage: number) {
    this.nachFormService
      .getNACHtaskList(
        this.fromDate,
        this.endDate,
        page,
        itemPerPage,
        this.partnerId,
        this.fileName,
        this.sortBy,
        this.orderBy
      )
      .subscribe((res) => {
        console.log(res);
        this.reponseDatasource = res.body;
        this.dataSource = this.reponseDatasource.content;
        this.isPageEmpty = res.body.content.length === 0;
        this.dataSource['paginator'] = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  sortData(event: any) {
    console.log(event);
    this.sortBy = this.sort.active;
    this.orderBy = this.sort.direction;
    this.getTaskList(this.page, this.itemPerPage);
  }

  onPageChange(pageEvent: PageEvent) {
    console.log(pageEvent);
    this.page = pageEvent.pageIndex;

    this.getTaskList(this.page, this.itemPerPage);
  }
  getDateRange(dateRange: any) {
    this.fromDate = dateRange.startDate;
    this.endDate = dateRange.endDate;
    console.log('date', dateRange, this.fromDate, this.endDate);
    this.getTaskList(this.page, this.itemPerPage);
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getNachForm(row: any, purpose: any) {
    this.nachFormService.getNachForm(row.fileId).subscribe((res) => {
      let file = new Blob([res], { type: 'application/pdf' });
      let fileURL = URL.createObjectURL(file);
      if (purpose === 'print') {
        window.open(fileURL, '_blank')?.print();
      } else {
        saveAs(file, 'Nach Forms ' + row.taskId);
      }
    });
  }

  getExceptionFile(errorFileId: any, jobId: any) {
    this.nachFormService.getFileURL(errorFileId).subscribe(
      (res: any) => {
        console.log('S2', res);
        this.nachFormService
          .downloadExceptionFile(res.body)
          .subscribe((res: any) => {
            console.log('S2q', res);
            const fileName =
              'Exception_file_' + jobId + '_' + new Date().getDate();
            const fileBlob = new Blob([res], {
              type: 'application/vnd.ms-excel',
            });
            saveAs(fileBlob, fileName);
          });
      },
      (error) => {
        console.log(error);
        const eMsg: string = error.error;
        if (eMsg.includes('File not found')) {
          this.snack.open('Error retrieving file.', 'close', {
            duration: 2000,
          });
        } else {
          this.snack.open('Error downloading file.', 'close', {
            duration: 2000,
          });
        }
      }
    );
  }

}
