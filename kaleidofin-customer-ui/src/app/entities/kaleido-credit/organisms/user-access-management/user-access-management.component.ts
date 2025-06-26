import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { PrincipalService } from "src/app/core";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";
import { UiConfigService } from "../../services/ui-config.service";
import { MatDialog } from "@angular/material/dialog";
import { AddNewUserDialogComponent } from "../add-new-user-dialog/add-new-user-dialog.component";
import { UserAccessManagementService } from "../../services/user-access-management/user-access-management.service";
import { UamConfirmationPopupComponent } from "../../molecules/uam-confirmation-popup/uam-confirmation-popup.component";
import {
  CreateUserRequestDto,
  StatusENUM,
  USER_ACCESS_MANAGEMENT,
  UserCountDTO,
  UserDTO,
  UserSearchDTO,
} from "../../services/user-access-management/user-access-management.constants";
import { formatDistanceToNow, parseISO } from "date-fns";
import { getProperty } from "src/app/utils/app.utils";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { get, noop } from "lodash";
import { MatSelectChange } from "@angular/material/select";

@Component({
  selector: "app-user-access-management",
  templateUrl: "./user-access-management.component.html",
  styleUrls: ["./user-access-management.component.scss"],
})
export class UserAccessManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns: string[] = [
    "name",
    "hrmsId",
    "lastActivity",
    "roleType",
    "status",
    "action",
  ];

  dataSource: MatTableDataSource<any> = undefined;

  roleTypeOptions: Record<string, string>[];
  rolesMap: Record<string, string> = {};
  newUserDetailsMap: any[] = [];
  editUserDetailsMap: any[] = [];
  readonly handlerMapper: Record<string, Function> = {
    EDIT_USER: (user: UserDTO) => this.openEditUserDialog(user),
    CHANGE_PASSWORD: (user: UserDTO) => this.openChangePasswordDialog(user),
    DELETE_USER: (user: UserDTO) =>
      this.openChangeStatusDialog(user, "DELETED"),
    SUSPEND_USER: (user: UserDTO) => this.openSuspendUserDialog(user),
    ACTIVATE_USER: (user: UserDTO) =>
      this.openChangeStatusDialog(user, "ACTIVE"),
  };

  tempUserData: UserDTO = null;

  readonly size = 10;
  partnerId: unknown;

  searchDto: UserSearchDTO = {};

  totalElements: number = null;
  userCount: UserCountDTO;
  optionsMap: Record<Exclude<StatusENUM, "DELETED">, any[]>;
  currentLogin: string = null;

  constructor(
    private readonly principalService: PrincipalService,
    private readonly dashboardService: DashboardService,
    private readonly uiConfigService: UiConfigService,
    private readonly userAccessService: UserAccessManagementService,
    private readonly dialogService: MatDialog,
    private readonly associateLenderService: AssociateLenderService,
    private readonly principleService: PrincipalService
  ) {}

  ngOnInit(): void {
    this.currentLogin = this.principalService.getUserLogin();
    this.partnerId = this.associateLenderService?.lenderData?.partnerId ?? "";
    this.principalService.identity().then(() => {
      this.dashboardService.sendMessage("shownav");
    });
    this.uiConfigService
      .getUiConfigBySection(
        UI_COMPONENTS.USER_ACCESS_MANAGEMENT,
        UI_COMPONENTS.USER_ACCESS_MANAGEMENT
      )
      .subscribe(
        (reportsConfig: any) => {
          const uiConfig = this.uiConfigService.getUiConfigurationsBySection(
            reportsConfig,
            UI_COMPONENTS.USER_ACCESS_MANAGEMENT,
            true
          );
          this.rolesMap = getProperty(
            uiConfig,
            USER_ACCESS_MANAGEMENT.USER_ROLES_MAP,
            {}
          );
          this.newUserDetailsMap = getProperty(
            uiConfig,
            USER_ACCESS_MANAGEMENT.NEW_USER_DETAILS_MAP,
            []
          );
          this.editUserDetailsMap = getProperty(
            uiConfig,
            USER_ACCESS_MANAGEMENT.EDIT_USER_DETAILS_MAP,
            []
          );
          this.roleTypeOptions =
            this.associateLenderService.lenderUserRoles.map((role) => {
              return {
                label: this.rolesMap[role],
                value: role,
              };
            });
          this.optionsMap = getProperty(uiConfig, USER_ACCESS_MANAGEMENT.OPTIONS_MAP, {});  
          this.updateHandlers(this.optionsMap);  
        },
        (error) => console.error(error)
      );
    this.userAccessService.getUserUpdateListener().subscribe(() => {
      this.fetchUserData();
    });
  }

  updateHandlers(optionsMap: any) {
    Object.values(optionsMap).forEach((options: any) => {
      options?.forEach((values: any) => {
        values.handler = this.handlerMapper[values?.handlerKey] ?? noop;
      });
    });
  }

  ngAfterViewInit() {
    this.fetchUserData(this.searchDto);
    this.dataSource.paginator = this.paginator;
  }

  async fetchUserData(searchDto?: UserSearchDTO): Promise<void> {
    if (searchDto) {
      this.searchDto = { ...searchDto };
    }
    this.searchDto.size = this.size;
    this.searchDto.partnerId = this.partnerId as number;
    const response = await this.userAccessService
      .fetchAllUsers(this.searchDto)
      .toPromise();
    this.setUserData(response);
    this.fetchUserCount();
  }

  fetchUserCount(): void {
    this.userAccessService
      .fetchUserCount(this.associateLenderService.getLenderCode())
      .subscribe({
        next: (response) => {
          this.userCount = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  setUserData(response: any): void {
    const users: UserDTO[] = get(response, "content", []);
    this.totalElements = get(response, "totalElements", null);
    this.dataSource = new MatTableDataSource(
      users.map((user) => {
        if (typeof user.role === "string") {
          user.role = user.role.split(",");
          if (user?.customRolesAndAuthority) {
            user.role = [
              ...(user?.role ?? []),
              ...(user?.customRolesAndAuthority?.split(",") ?? []),
            ];
          }
        }
        return user;
      })
    );
  }

  onRoleTypeChange(user: UserDTO, event: MatSelectChange) {
    this.tempUserData = JSON.parse(JSON.stringify(user));
    user.role = event.value;
  }

  openAddUserDialog(): void {
    this.dialogService.open(AddNewUserDialogComponent, {
      disableClose: true,
      data: {
        createNewUser: true,
        roleTypeOptions: this.roleTypeOptions,
        userDetailsMap: this.newUserDetailsMap,
      },
    });
  }

  openEditUserDialog(user: UserDTO): void {
    this.dialogService.open(AddNewUserDialogComponent, {
      disableClose: true,
      data: {
        userData: user,
        roleTypeOptions: this.roleTypeOptions,
        userDetailsMap: this.editUserDetailsMap,
      },
    });
  }

  openRoleChangeDialog(isOpen: boolean, user: UserDTO) {
    if (!isOpen) {
      const userRequestPayload: CreateUserRequestDto = {
        username: user.login,
        firstname: user.firstName,
        lastname: user.lastName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        langKey: user.langKey,
        roles: user.role as string[],
        employeeId: user.externalId,
        partnerId: user.partnerId,
        status: user.status,
        id: user.id,
      };
      const confirmationText = `Are you sure you want to update the details?`;
      const dialogRef = this.dialogService.open(UamConfirmationPopupComponent, {
        disableClose: true,
        data: {
          popup_type: "CREATE_UPDATE_USER",
          confirmationText,
          buttonText: "Yes, Update",
          userData: userRequestPayload,
          successText: "User Updated Successfully",
        },
      });
      dialogRef.afterClosed().subscribe((message) => {
        if (this.tempUserData && message && message === "cancelled") {
          Object.assign(user, this.tempUserData);
          this.dataSource.data = [...this.dataSource.data];
          this.tempUserData = null;
        }
      });
    }
  }

  openSuspendUserDialog(user: UserDTO): void {
    this.dialogService.open(UamConfirmationPopupComponent, {
      disableClose: true,
      data: {
        title: "Suspend user",
        buttonText: "Proceed",
        popup_type: "SUSPEND_USER",
        userData: user,
        newStatus: "SUSPENDED",
        successText: "User Suspended",
      },
    });
  }

  openChangeStatusDialog(user: UserDTO, newStatus: StatusENUM) {
    const confirmationText = `Are you sure you want to ${
      newStatus === "ACTIVE" ? "activate" : "delete"
    } ${user?.firstName}?`;
    const buttonText = `Yes, ${newStatus === "ACTIVE" ? "activate" : "delete"}`;
    this.dialogService.open(UamConfirmationPopupComponent, {
      data: {
        popup_type: "CHANGE_STATUS",
        confirmationText,
        buttonText,
        userData: user,
        successText: `User ${newStatus === "ACTIVE" ? "activated" : "deleted"}`,
        newStatus,
      },
    });
  }

  openChangePasswordDialog(userData: UserDTO): void {
    this.dialogService.open(UamConfirmationPopupComponent, {
      disableClose: true,
      data: {
        popup_type: "CHANGE_PASSWORD",
        title: "Change password",
        buttonText: "Update",
        userData,
        successText: "Password Changed Successfully",
      },
    });
  }

  getCurrentOptions(status: StatusENUM): any[] | null {
    if (status === "DELETED") {
      return null;
    }
    return this.optionsMap[status];
  }

  getRecentLogin(recentLogin: string | null): string {
    if (!recentLogin?.length) {
      return "--";
    }
    return formatDistanceToNow(parseISO(recentLogin), { addSuffix: true });
  }

  changePage(event: PageEvent) {
    this.fetchUserData({ ...this.searchDto, page: event?.pageIndex ?? 0 });
  }

  checkForDisabled(user: UserDTO): boolean {
    const status = user?.status ?? null;
    const login = user?.login ?? null;
  return status === "DELETED" || login === this.currentLogin;
  }

  
    getUserRoles(roles: string[] = []): string[] | string {
      if(!roles?.length) {
        return "--";
      }
      return roles.map((role)=> {
        return this.rolesMap[role] ?? role;
      })
    }
}