import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { get } from "lodash";
import { LENDER_CONFIGURATIONS } from "src/app/constants/lender.config";
import { AssociateLenderService } from "src/app/entities/kaleido-credit/services/associate-lender/associate-lender.service";

@Component({
  selector: "ig-main",
  templateUrl: "./main.component.html",
})
export class IgMainComponent implements OnInit {
  isClickjacked = false;
  useFooter = false;
  currentUrl: string = "";
  filteredEndpoints: string[] = [
    ".*/api/lender/ui/loan-review/info-section/*",
    ".*/api/anonymous/lender/ui/.*",
    ".*api/lender/ui/bre-section",
    ".*api/lender/ui/review-section*",
    ".*api/lender/ui/demand-schedule*",
    ".*/api/lender/pre-signed-urls/bulk",
    ".*/api/lender/kiscore/upload",
    ".*amazonaws.com.*",
  ];

  url: string = null;
  constructor(
    private readonly router: Router,
    private readonly associateLenderService: AssociateLenderService
  ) {}

  ngOnInit() {
    this.detectClickjacking();
    // Subscribe to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

    // Fetch lender configuration and set footer flag
    this.associateLenderService
      .getLenderCodeSubject()
      .subscribe((lenderCode) => {
        const config = LENDER_CONFIGURATIONS[lenderCode] || {};
        this.useFooter = get(config, "useFooter", false);
      });
  }

  /**
   * Detect if the app is running inside an iframe.
   */
  detectClickjacking(): void {
    try {
      if (window.self !== window.top) {
        this.isClickjacked = true;
      }
    } catch (error) {
      // Catch cross-origin issues and assume clickjacking
      this.isClickjacked = true;
    }
  }

  /**
   * Determine whether the footer should be shown.
   */
  checkFooter(): boolean {
    const restrictedRoutes = [
      "/",
      "/reset",
      "/reset/finish",
      "/lockout",
      "/expired",
    ];
    return this.useFooter && !restrictedRoutes.includes(this.currentUrl);
  }
}
