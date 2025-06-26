import { Location } from '@angular/common';
import { Component } from "@angular/core";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent{
  constructor(
    private readonly _location: Location
  ) {}

  
  backClicked() {
    this._location.back();
  }
}
