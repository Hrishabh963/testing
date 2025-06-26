import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { LENDER_CONFIGURATIONS } from "src/app/constants/lender.config";
import { get } from "lodash";
import { SubdomainService } from "src/app/shared/subdomain.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  currentPage: string = "Login";
  metaData: any = {};
  disableForgotPassword = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly associateLenderService: AssociateLenderService,
    private readonly subdomainService: SubdomainService
  ) {}

  ngOnInit(): void {
    let sessionMetadata = sessionStorage.getItem("metadata");
    let snapshotMetadata = this.route.snapshot.data["metaData"] || 
                          (sessionMetadata ? JSON.parse(sessionMetadata) : null);
    
    if (!snapshotMetadata) {
      const detectedLenderCode = this.subdomainService.getLenderCode();
      snapshotMetadata = LENDER_CONFIGURATIONS[detectedLenderCode];
      
      if (snapshotMetadata) {
        snapshotMetadata.lenderCode = detectedLenderCode;
      }
    }
    
    if (snapshotMetadata) {
      let lenderCode = snapshotMetadata?.lenderCode;
      this.associateLenderService.setLenderCode(lenderCode ?? "KCPL");
      sessionStorage.setItem("metadata", JSON.stringify(snapshotMetadata));
    }
    
    const lender = this.associateLenderService.getLenderCode();
    if (lender?.length) {
      this.metaData = LENDER_CONFIGURATIONS[lender];
      this.disableForgotPassword = get(
        snapshotMetadata,
        "disableForgotPassword",
        false
      );
    }
    
    const page: string = getProperty(
      this.route.snapshot.data,
      "currentPage",
      ""
    );
    this.updatePage(page);
  }

  updatePage(event: string) {
    this.currentPage = event;
  }
}