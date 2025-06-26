import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ReviewStateManagementService {

  constructor( private readonly activatedRoute: ActivatedRoute ) { }

  private selectedFirstLevelIndex: number = 0;
  private selectedLoanStatus: string = "LOANREVIEW";
  private selectedSubstage: any = null;
  private selectedSecondLevelIndex: number = 0;
  private searchValues: string;
  private searchParams: any = {};
  private searchTags: Array<any> = [];
  private filterData: any = {};

  get $selectedFirstLevelIndex() {
    return this.selectedFirstLevelIndex;
  }


  set $selectedFirstLevelIndex(indexValue: number) {
    this.selectedFirstLevelIndex = indexValue;
  }

  get $selectedLoanStatus() {
    return this.selectedLoanStatus;
  }

  set $selectedLoanStatus(status: string) {
    this.selectedLoanStatus = status;
  }

  get $selectedSubstage() {
    return this.selectedSubstage;
  }

  set $selectedSubstage(status: any) {
    this.selectedSubstage = status;
  }

  get $selectedSecondLevelIndex() {
    return this.selectedSecondLevelIndex;
  }

  set $selectedSecondLevelIndex(index: number) {
    this.selectedSecondLevelIndex = index;
  }

  get $searchValues() {
    return this.searchValues;
  }

  set $searchValues(values: string) {
    this.searchValues = values;
  }

  get $searchParams() {
    return this.searchParams;
  }

  set $searchParams(params: any) {
    this.searchParams = params;
  }

  get $searchTags() {
    return this.searchTags;
  }

  set $searchTags(tags: Array<any>) {
    this.searchTags = tags;
  }

  get $filterData() {
    return this.filterData;
  }

   setFilterData(key: string ,data: any) {
    this.filterData[key] = data;
  }
  
  resetToBase(): void {
    this.selectedFirstLevelIndex = 0;
    this.selectedLoanStatus = "LOANREVIEW";
    this.selectedSubstage = null;
    this.selectedSecondLevelIndex = 0;
    this.searchValues = undefined;
    this.searchParams = {};
    this.filterData = {};
    this.searchTags = [];
  }
  

}
