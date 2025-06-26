import { Component } from '@angular/core';

@Component({
  selector: 'ig-error-contact',
  templateUrl: './error-contact.component.html',
})
export class ErrorContactComponent  {
  errorMessage: string = '';
  error403: boolean = false;
  errorType: string = '';
  supportNumber: string = '';
}
