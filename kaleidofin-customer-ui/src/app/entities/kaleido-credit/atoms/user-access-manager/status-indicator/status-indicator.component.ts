import { Component, Input } from "@angular/core";
import { StatusENUM } from "../../../services/user-access-management/user-access-management.constants";

@Component({
  selector: "app-status-indicator",
  templateUrl: "./status-indicator.component.html",
  styleUrls: ["./status-indicator.component.scss"],
})
export class StatusIndicatorComponent {
  @Input() status: string = "";

  toolTipMap: Record<StatusENUM, string> = {
    ACTIVE: "User is active & operational",
    SUSPENDED: "Suspended by uam",
    INACTIVE: "User is inactive for more than 45 days",
    DELETED: "Access is permanently deleted",
    LOCKED: "Access locked User enters the wrong password three times"
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case "active":
        return "check";
      case "inactive":
        return "access_time";
      case "locked":
        return "lock";
      case "suspended":
        return "block";
      case "deleted":
        return "delete_outline";
      default:
        return '';
    }
  }
}
