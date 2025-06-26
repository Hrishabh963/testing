import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mandate-download',
  templateUrl: './mandate-download.component.html',
  styleUrls: ['../payment-mandate.scss','./mandate-download.component.scss']
})
export class MandateDownloadComponent{

  constructor(private readonly router:Router) { }

  back() {
    this.router.navigate(['/nachForms/prefilledNachForms']);
  }
}
