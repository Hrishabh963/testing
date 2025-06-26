import { Component, OnInit} from "@angular/core";
import { JhiEventManager } from "ng-jhipster";
import { Router } from "@angular/router";
import { Account, PrincipalService } from "../core";
@Component({
  selector: "ig-home",
  templateUrl: "./home.component.html",
  styleUrls: ["home.scss"]
})
export class HomeComponent implements OnInit {
  account!: Account;
  constructor(
    private readonly principal: PrincipalService,
    private readonly eventManager: JhiEventManager,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.principal
      .identity()
      .then(account => {
        this.account = account;
        this.router.navigateByUrl("dashboard/home");
      })
      .catch(res => {
        if (this.account === undefined || this.account === null) {
          this.login();
        }
      });
    this.registerAuthenticationSuccess();
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe("authenticationSuccess", () => {
      this.principal.identity().then(account => {
        this.account = account;
      });
    });
  }

  isAuthenticated() {
    return this.principal.isAuthenticated();
  }

  login() {
    this.router.navigate(["/login-home"]);
  }

  next() {
    this.router.navigateByUrl("customer");
  }
}
