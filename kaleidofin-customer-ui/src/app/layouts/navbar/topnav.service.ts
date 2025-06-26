import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Tab } from "./tab.model";

export class TabMessage {
  name: string = "";
  backNeeded: boolean = false;
}
@Injectable({
  providedIn: "root",
})
export class TopNavService {
  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    const initActiveParent = this.getParent();
    const initActiveChild: Tab = this.getChild(initActiveParent) || null;
    if (initActiveParent) {
      this.topNav$.next(initActiveParent[0]);
    }
    if (initActiveChild) {
      this.tabs$.next(initActiveChild);
    }
    this.topNav$.subscribe((nav) => {
      if (this.tabsMap[nav]) {
        this.tabsMap[nav].forEach((tab) => {
          if (tab.isDefault) {
            tab.active = true;
          }
        });
        Object.keys(this.tabsMap).forEach((name) => {
          if (name != nav) {
            this.tabsMap[name].forEach((tab) => (tab.active = false));
          }
        });
      }
      this.tabs$.next(this.tabsMap[nav] || this.tabsMap["default"]);
    });
  }
  public topNav$: BehaviorSubject<string> = new BehaviorSubject("default");
  public tabs$: BehaviorSubject<any> = new BehaviorSubject([]);

  private tabsMap: { [key: string]: Tab[] } = {
    dafault: [],
    paymentMandate: [],
    nachForms: [
      {
        name: "Prefilled Nach Mandate",
        isDefault: true,
        route: "prefilledNachForms",
        active: false,
      },
    ],
    dashboard: [
      {
        name: "Dashboard",
        isDefault: true,
        route: "home",
        active: false,
      },
      // {
      //     name: "Payments",
      //     isDefault: false,
      //     route: null,
      //     active:false
      // }
    ],
    customers: [
      {
        name: "Customers",
        isDefault: true,
        route: " ",
        active: false,
      },
    ],
    payments: [
      {
        name: "Payments",
        isDefault: true,
        route: " ",
      },
    ],
    demands: [
      {
        name: "Manage demands",
        isDefault: true,
        route: " ",
      },
    ],
    contactUs: [
      {
        name: "Contact us",
        isDefault: true,
        route: " ",
      },
    ],
    singleTabNachUpload: [
      {
        name: "Generate prefilled nach form",
        isDefault: false,
        route: "nachFormUpload",
        active: false,
      },
    ],
  };

  navigate(tab: Tab, doRoute = true) {
    const parent = this.topNav$.getValue();
    this.tabsMap[parent].forEach((t) => {
      if (t == tab) {
        tab.active = true;
        if (tab.route != " " && doRoute) {
          this.router.navigate([parent, tab.route], { relativeTo: this.route });
        }
      } else {
        t.active = false;
      }
    });
  }

  checkIfActive(url: string, parent: string = null): boolean {
    const urlTree = parent
      ? this.router.createUrlTree([parent, url])
      : this.router.createUrlTree([url]);
    return this.router.isActive(urlTree, {
      paths: "exact",
      queryParams: "exact",
      fragment: "ignored",
      matrixParams: "ignored",
    });
  }

  getParent() {
    return Object.keys(this.tabsMap).filter((url) => this.checkIfActive(url));
  }
  getChild(parent: any): any {
    if (parent?.[0]) {
      return this.tabsMap[parent[0]].filter((tab) =>
        this.checkIfActive(tab.route || "", parent[0])
      )[0];
    }
    return null;
  }
}
