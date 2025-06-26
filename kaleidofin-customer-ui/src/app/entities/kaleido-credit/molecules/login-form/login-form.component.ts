import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { get } from "lodash";
import { JhiEventManager } from "ng-jhipster";
import {
  Account,
  LoginService,
  PrincipalService,
  StateStorageService,
} from "src/app/core";
import { AuthJwtService } from "src/app/core/auth/auth-jwt.service";
import { AuthorizedRoutes } from "src/app/core/auth/authorized-routes.service";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { RedirectBottomSheet } from "src/app/home/kaleidofin-home.component";
import { CustomValidator } from "src/app/shared/validations/custom.validation";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnInit {
  @Input() disableForgotPassword: boolean = false;
  myForm: FormGroup;
  account: Account;
  isMobile = window.innerWidth < 768 ;
  displayURL!: string;
  redirectURL!: string;
  domainMismatch: boolean;
  invalidCredentials: boolean = false;
  errorMessage: string = "";
  showPasswordError: boolean = false;
  @Output() dataEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: Router,
    private readonly eventManager: JhiEventManager,
    private readonly principal: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly authorizedRouter: AuthorizedRoutes,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly customValidators: CustomValidator,
    private readonly loginService: LoginService,
    private readonly stateStorageService: StateStorageService,
    private readonly authServerProvider: AuthJwtService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.clearMessage();
    this.myForm = this.fb.group({
      email: [
        "",
        [Validators.required, this.customValidators.usernameOrEmailValidator()],
      ],
      password: ["", [Validators.required]],
    });
  }

  login(): void {
    const user: string = this.myForm?.value?.email ?? "";
    const password: string = this.myForm?.value?.password ?? "";
    sessionStorage.setItem("tempUser", user);
    this.authServerProvider
      .login({ username: user, password, rememberMe: true })
      .then((response) => {
        this.authServerProvider.authSuccess(get(response, "access_token", ""));
        this.invalidCredentials = false;
        if (
          this.route.url === "/register" ||
          /^\/activate\//.test(this.route.url) ||
          /^\/reset\//.test(this.route.url)
        ) {
          this.route.navigate([""]);
        }

        this.eventManager.broadcast({
          name: "authenticationSuccess",
          content: "Sending Authentication Success",
        });

        const redirect = this.stateStorageService.getUrl();

        if (redirect) {
          this.stateStorageService.storeUrl("");
          this.route.navigate([redirect]);
        } else {
          this.stateStorageService.storeUrl("");
          this.authorizedRouter.navigate();
        }
      })
      .catch((err) => {
        this.loginService.handleTokenError(err);
        this.invalidCredentials = true;
        this.errorMessage = getProperty(err,'error.statusMsg','You have entered incorrect credentials.');
      });
  }

  directToForgetPassword() {
    this.route.navigate(["reset"]);
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

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" && this.myForm.valid) {
      this.login();
    }
  }
}
