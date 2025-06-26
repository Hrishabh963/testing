import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { JhiEventManager } from "ng-jhipster";
import { Account, PrincipalService } from "../core";
import { AuthorizedRoutes } from "../core/auth/authorized-routes.service";
import { DashboardService } from "../entities/dashboard/dashboard.service";
import { AssociateLenderService } from "../entities/kaleido-credit/services/associate-lender/associate-lender.service";
@Component({
  selector: "ig-kaleidofin-home",
  templateUrl: "./kaleidofin-home.component.html",
  styleUrls: ["kaleidofin-home.scss"],
})
export class IgKaleidofinHomeModalComponent implements OnInit {
  domainMismatch = false;
  account!: Account;
  isMobile = window.innerWidth < 768;
  displayURL!: string;
  redirectURL!: string;
  metaData: any = {};
  constructor(
    public  readonly dialog: MatDialog,
    private readonly principal: PrincipalService,
    private readonly eventManager: JhiEventManager,
    private readonly router: Router,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly dashboardService: DashboardService,
    private readonly authorizedRouter: AuthorizedRoutes,
    private readonly route: ActivatedRoute,
    private readonly associateLenderService: AssociateLenderService
  ) {}

  ngOnInit() {
    this.metaData = this.route.snapshot.data["metaData"];
    this.associateLenderService.setLenderCode(this.metaData?.lenderCode);
  }

  contact() {
    this.router.navigate(["contact"]);
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe("authenticationSuccess", () => {
      this.principal.identity().then((account) => {
        this.account = account;
        this.authorizedRouter.navigate();
      });
    });
    this.eventManager.subscribe("authenticationFailure", () => {
      this.dashboardService.sendMessage("login");
    });
  }

  isAuthenticated() {
    return this.principal.isAuthenticated();
  }

  openredirectPopup(data: { displayURL: string; redirectURL: string }) {
    if (!data) {
      this.domainMismatch = false;
      return;
    }
    this.principal.initPartnerMismatch();
    this.domainMismatch = true;
    this.displayURL = data.displayURL;
    this.redirectURL = data.redirectURL;
    if (this.isMobile) {
      this._bottomSheet.open(RedirectBottomSheet, {
        data: data,
      });
    }
  }
}

@Component({
  selector: "ig-redirect-popup",
  templateUrl: "redirect-popup.html",
})
export class RedirectBottomSheet {
  @Input() redirectURL: any;
  @Input() displayURL: any;
  isMobile = window.innerWidth < 768;
  constructor(
    private readonly _bottomSheetRef: MatBottomSheetRef<RedirectBottomSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: any
  ) {
    this.redirectURL = data.redirectURL || this.redirectURL;
    this.displayURL = data.displayURL || this.displayURL;
  }
  redirect(event: any) {
    if (this._bottomSheetRef && Object.keys(this._bottomSheetRef).length !== 0)
      this._bottomSheetRef.dismiss();
    event.preventDefault();
    window.location.href = this.redirectURL;
  }
}
