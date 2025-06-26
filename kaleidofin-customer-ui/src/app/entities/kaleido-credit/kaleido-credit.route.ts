import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";

import { Injectable } from "@angular/core";
import { JhiPaginationUtil } from "ng-jhipster";
import { UserRouteAccessService } from "src/app/core";
import { KicreditReportsComponent } from "src/app/entities/kaleido-credit/organisms/kicredit-reports/kicredit-reports.component";
import { AtdReportComponent } from "./atoms/atd-report/atd-report.component";
import { CamsReportComponent } from "./atoms/cams-report/cams-report.component";
import { EkycReportComponent } from "./atoms/ekyc-report/ekyc-report.component";
import { FiReportComponent } from "./atoms/fi-report/fi-report.component";
import { KCreditReportGenerationComponent } from "./genreport/kcredit-reportgen.component";
import { KCreditLoanHistoryComponent } from "./history/kcredit-history.component";
import { BreReportComponent } from "./loan/components/business-rule-engine/bre-report/bre-report.component";
import { KiScoreReportComponent } from "./loan/components/ki-score-report/ki-score-report.component";
import { KCreditLoanComponent } from "./loan/kcredit-loan.component";
import { KCreditLoanEntryComponent } from "./loanentry/kcredit-loanentry.component";
import { FraudCheckReportComponent } from "./molecules/fraud-check-report/fraud-check-report.component";
import { KicreditUploadsComponent } from "./organisms/kicredit-uploads/kicredit-uploads.component";

import { KicreditOverviewComponent } from "./organisms/overview/kicredit-overview.component";
import { KCreditReportComponent } from "./report/kcredit-report.component";
import { KcreditUploadComponent } from "./upload/kcredit-upload.component";
import { KiScoreUploadComponent } from "./organisms/ki-score-upload/ki-score-upload.component";
import { KiScoreResultsComponent } from "./organisms/ki-score-results/ki-score-results.component";
import { OverviewComponent } from "./overview/overview.component";
import { BusinessOnboardingComponent } from "./organisms/business/business-onboarding/business-onboarding.component";
import { BusinessReviewComponent } from "./organisms/business/business-review/business-review.component";
import { UserProfileComponent } from "./organisms/user-profile/user-profile.component";
import { UserAccessManagementComponent } from "./organisms/user-access-management/user-access-management.component";
// import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';

@Injectable()
export class KaleidoCreditResolvePagingParams implements Resolve<any> {
  constructor(private readonly paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.queryParams["page"] ? route.queryParams["page"] : "1";
    const sort = route.queryParams["sort"]
      ? route.queryParams["sort"]
      : "id,asc";
    return {
      page: this.paginationUtil.parsePage(page),
      predicate: this.paginationUtil.parsePredicate(sort),
      ascending: this.paginationUtil.parseAscending(sort),
    };
  }
}

export const KCredit: Routes = [
  {
    path: "kcredit",
    children: [
      {
        path: "overview",
        component: OverviewComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "loanentry",
        component: KCreditLoanEntryComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "kiscore",
        component: KiScoreUploadComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "report",
        component: KCreditReportComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "review",
        component: KCreditReportComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "upload",
        component: KcreditUploadComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: "kiscore-reports",
        component: KiScoreResultsComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "kiscore/:id",
        component: KiScoreResultsComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },

      {
        path: "loan/:id",
        component: KCreditLoanComponent,
        data: {
          pageTitle: "kCredit.home.title",
          resetToBase: false,
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: "entry/loan/:id",
        component: KCreditLoanComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: "loan/:id/bre-report",
        component: BreReportComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "profile",
        component: UserProfileComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: "loan/:id/fraud-check-report",
        component: FraudCheckReportComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "loan/:id/ki-score-report",
        component: KiScoreReportComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "loan/:id/atd-report",
        component: AtdReportComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "loan/:id/cams-report",
        component: CamsReportComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "loan/:id/fi-report",
        component: FiReportComponent,
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "loan/:id/ekyc-report",
        component: EkycReportComponent,
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "genreport",
        component: KCreditReportGenerationComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "history",
        component: KCreditLoanHistoryComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "reports",
        component: KicreditReportsComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "uploads",
        component: KicreditUploadsComponent,
        data: {
          pageTitle: "kCredit.home.title",
        },
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
      {
        path: "users",
        component: UserAccessManagementComponent,
        canActivate: [UserRouteAccessService],
        resolve: {
          pagingParams: KaleidoCreditResolvePagingParams,
        },
      },
    ],
  },
  {
    path: "business",
    children: [
      {
        path: "overview",
        component: KicreditOverviewComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "onboarding",
        component: BusinessOnboardingComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "review/:id",
        component: BusinessReviewComponent,
        canActivate: [UserRouteAccessService],
      },
      
    ],
  },
  {
    path: "business",
    children: [
      {
        path: "overview",
        component: KicreditOverviewComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "onboarding",
        component: BusinessOnboardingComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "review/:id",
        component: BusinessReviewComponent,
        canActivate: [UserRouteAccessService],
      },
      
    ],
  },
  {
    path: "business",
    children: [
      {
        path: "overview",
        component: KicreditOverviewComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "onboarding",
        component: BusinessOnboardingComponent,
        canActivate: [UserRouteAccessService],
      },
      {
        path: "review/:id",
        component: BusinessReviewComponent,
        canActivate: [UserRouteAccessService],
      },
      
    ],
  },
];
