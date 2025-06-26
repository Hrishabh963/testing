import { Component, Input } from '@angular/core';
import { HrmsUser } from '../../services/user-access-management/user-access-management.constants';

@Component({
  selector: 'app-user-details-container',
  templateUrl: './user-details-container.component.html',
  styleUrls: ['./user-details-container.component.scss']
})
export class UserDetailsContainerComponent  {

  @Input() userDetails: HrmsUser;
  @Input() detailsMap: Record<string, string>[] = [];

}
