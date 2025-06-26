import {
  Component,
  EventEmitter,
  Input,
  Output,OnDestroy
} from "@angular/core";
import { DashboardService } from "src/app/entities/dashboard/dashboard.service";

@Component({
  selector: "app-topnavfullwidth",
  template: `
    <div class="tabsContainer-f topNav-f ">
    <div (click)='back()' class="tab-f" style="margin-left: 60px;">
    <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 9.5H3.5M9 2L1.5 9.5L9 17" stroke="#999999" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    <div class="tab-f activeTab">{{title}}</div>
    </div>
    `,
  styleUrls: ["../layouts/navbar/navbar.scss"]
})
export class TopNavFullWidthComponent  implements OnDestroy {
  constructor(private readonly dashboardService: DashboardService) {
    this.dashboardService.sendMessage("hide");
  }
  @Input() title: string = "test";
  @Output() onBack = new EventEmitter();
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log("Destroyed fullwidth top nav");

    this.dashboardService.sendMessage("shownav");
  }

  back() {
    this.onBack.emit("back");
  }
}
