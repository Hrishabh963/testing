import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar-badge',
  templateUrl: './avatar-badge.component.html',
  styleUrls: ['./avatar-badge.component.scss']
})
export class AvatarBadgeComponent implements OnInit {

  @Input() username: string = null;
  @Input() avatarRadius: string = "50px";
  @Input() fontSize: string = "14px";

  formattedName: string = null;

  constructor() { }

  ngOnInit(): void {
    this.formattedName = this.getInitials();
  }

  getInitials(): string {
    if (!this.username) return "";
    const names = this.username.split(" ");
    return names
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  }


}
