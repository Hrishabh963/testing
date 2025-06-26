import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { SharedLibModule, SharedModule } from 'src/app/shared';
import { ContactComponent } from './contact/contact.component';
import { DASHBOARD } from './dashboard.route';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiscoverComponent } from './discover/discover.component';

@NgModule({
  declarations: [DashboardComponent, ContactComponent, DiscoverComponent],
  imports: [
    CommonModule,
    ChartsModule,
    RouterModule.forChild(DASHBOARD),
    SharedLibModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
