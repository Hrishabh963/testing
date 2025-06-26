import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[matBadgeIcon]'
})
export class MatBadgeIconDirective implements OnInit {

  @Input() matBadgeIcon: string;
  @Input() matBadgeIconColor: string;
  @Input() matBadgeIconBackgroundColor: string;
  constructor(private readonly el: ElementRef) {}

  ngOnInit() {
    const badge = this.el.nativeElement.querySelector('.mat-badge-content');
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    if(this.matBadgeIconColor)
      badge.style.color = this.matBadgeIconColor;
    if(this.matBadgeIconBackgroundColor)
      badge.style.backgroundColor = this.matBadgeIconBackgroundColor;

    badge.innerHTML = `<i class="material-icons" style="font-size: 20px">${this.matBadgeIcon}</i>`;
  }
}
