import { Component, Input } from '@angular/core';
import { UserInfo } from 'src/app/core/auth/UserInfo.constant';

@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.scss']
})
export class UserProfileInfoComponent {

  @Input() userInfo: UserInfo = {};


}
