import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[otp-directive]',
})
export class OtpFieldDirective {
  @HostListener('keypress', ['$event'])
  onKeyDown(e: any) {
    const isNumber = isFinite(e.key);
    if ((e.target && e.target.value.length == 6) || !isNumber)
      e.preventDefault();
  }
}
