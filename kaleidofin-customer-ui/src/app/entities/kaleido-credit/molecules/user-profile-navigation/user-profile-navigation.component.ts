import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserInfo } from "src/app/core/auth/UserInfo.constant";

@Component({
  selector: "app-user-profile-navigation",
  templateUrl: "./user-profile-navigation.component.html",
  styleUrls: ["./user-profile-navigation.component.scss"],
})
export class UserProfileNavigationComponent implements OnInit {

  @Input() contentType: string = null;
  @Input() userInfo: UserInfo = {};
  @Input() appMenuConfig: Record<Exclude<"DISABLE_HELP", "DISABLE_LOGOUT">, boolean>;
  @Output() changeSection: EventEmitter<string> = new EventEmitter<string>();

  navigationArray: Array<any> = [
    { label: "Basic Details", contentType: "basicDetails", isDisabled: "DISABLE_PROFILE_INFO"},
    { label: "Change Password", contentType: "changePassword", isDisabled: "DISABLE_CHANGE_PASSWORD" },
  ];
  activeIndex: number = null;
  constructor() {}

  ngOnInit(): void {
    this.activeIndex = this.navigationArray.findIndex((value)=> {
      return value?.contentType === this.contentType;
    });
  }

  changeNavigation(index: number, contentType: string): void {
    this.activeIndex = index ?? null;
    this.changeSection.emit(contentType);
  }
}
