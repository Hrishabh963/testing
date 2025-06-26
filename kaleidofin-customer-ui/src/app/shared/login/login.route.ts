import {
  Routes
} from "@angular/router";
import { IgKaleidofinHomeModalComponent } from "../../home/kaleidofin-home.component";

export const LOGIN_ROUTE: Routes = [
  {
    path: "login",
    component: IgKaleidofinHomeModalComponent,
    data: {
      pageTitle: "Kaleidofin"
    }
  }
];
