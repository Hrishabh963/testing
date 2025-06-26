import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-need-help',
  templateUrl: './need-help.component.html',
  styleUrls: ['./need-help.component.scss']
})
export class NeedHelpComponent {

  constructor(private readonly router: Router) { }

  redirectToContact(event: KeyboardEvent | Event): void {
    if(!(event instanceof KeyboardEvent) || event.code === "Enter") {
      this.router.navigate(["contact"]);
    }
  }


}
