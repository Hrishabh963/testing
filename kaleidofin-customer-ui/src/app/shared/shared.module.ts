import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavService } from '../layouts/navbar/sidenav.service';
import { TopNavService } from '../layouts/navbar/topnav.service';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { CustomDatepickerComponent } from './custom-datepicker/custom-datepicker.component';
import { FileService } from './files/file.service';
import { GoogleEventService } from './google/google-event-tracker';
import { IgLoginModalComponent } from './login/login.component';
import { LOGIN_ROUTE } from './login/login.route';
import { SharedCommonModule } from './shared-common.module';
import { SharedLibModule } from './shared-libs.module';
import { TopNavFullWidthComponent } from './topnavfullscreen.component';
import { LogoutComponent } from './logout/logout.component';
import { PaginationItemCountComponent } from './components/pagination-item-count/pagination-item-count.component';
import { AvatarBadgeComponent } from '../atoms/avatar-badge/avatar-badge.component';
const SHARED_ROUTES = [...LOGIN_ROUTE];

@NgModule({
  imports: [
    SharedLibModule,
    SharedCommonModule,
    RouterModule.forChild(SHARED_ROUTES),
  ],
  declarations: [
    CustomDatepickerComponent,
    HasAnyAuthorityDirective,
    IgLoginModalComponent,
    TopNavFullWidthComponent,
    LogoutComponent,
    PaginationItemCountComponent,
    AvatarBadgeComponent
  ],
  providers: [GoogleEventService, SidenavService, FileService, TopNavService],
  entryComponents: [IgLoginModalComponent],
  exports: [
    CustomDatepickerComponent,
    SharedCommonModule,
    SharedLibModule,
    HasAnyAuthorityDirective,
    IgLoginModalComponent,
    TopNavFullWidthComponent,
    LogoutComponent,
    PaginationItemCountComponent,
    AvatarBadgeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
