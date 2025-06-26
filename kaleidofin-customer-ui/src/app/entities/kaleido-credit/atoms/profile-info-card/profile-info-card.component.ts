import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-info-card',
  templateUrl: './profile-info-card.component.html',
  styleUrls: ['./profile-info-card.component.scss']
})
export class ProfileInfoCardComponent {
  @Input() label: string = null;
  @Input() data: string = null;

}
