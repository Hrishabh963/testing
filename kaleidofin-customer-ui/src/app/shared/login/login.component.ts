import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Router } from "@angular/router";
import { JhiEventManager } from "ng-jhipster";
import {
  LoginService,
  PrincipalService,
  StateStorageService,
} from "src/app/core";
import { AuthorizedRoutes } from "src/app/core/auth/authorized-routes.service";
import { DashboardService } from "../../entities/dashboard/dashboard.service";

@Component({
  selector: "ig-login-modal",
  templateUrl: "./login.component.html",
})
export class IgLoginModalComponent implements OnInit {
  @Output() openredirectModal: EventEmitter<any> = new EventEmitter<any>();
  hideOrShowCarousel: boolean = false;
  authenticationError: boolean = false;
  isOTPScreen: boolean = false;
  password: string = "";
  rememberMe: boolean = false;
  username: string = "";
  credentials: any;
  hide = true;
  loginForm: FormGroup;
  matchers = new ErrorStateMatcher();
  partnerMismatch: boolean = false;
  redirectURL: string = "";

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly eventManager: JhiEventManager,
    private readonly loginService: LoginService,
    private readonly stateStorageService: StateStorageService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly principal: PrincipalService,
    private readonly authorizedRouter: AuthorizedRoutes
  ) {
    this.credentials = {};
    this.loginForm = formBuilder.group({});
  }
  ngOnInit() {
    this.dashboardService.clearMessage();
    this.isOTPScreen = false;
    this.validation();
  }

  cancel() {
    this.credentials = {
      username: null,
      password: null,
      rememberMe: true,
    };
    this.authenticationError = false;
  }
  getErrorMessage() {
    return "Invalid Username or Password";
  }
  login() {
    this.username = this.loginForm.get("username")?.value;
    this.password = this.loginForm.get("password")?.value;
  }

  register() {
    this.router.navigate(["/login/otp"]);
  }

  requestResetPassword() {
    this.router.navigate(["/reset", "request"]);
  }

  validation() {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  googleEvent(event: any, type: any) {
    console.log("google event Iniated");
  }

  resetPassword() {
    this.router.navigate(["reset"]);
  }
}
