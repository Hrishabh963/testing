import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLibModule, SharedModule } from 'src/app/shared';
import { NachFormUploadComponent } from './nach-form-upload/nach-form-upload.component';
import { NACH } from './nach.route';
import { PrefilledNachFormDashboard } from './prefilled-nach-form-dashboard/prefilled-nach-form-generation-dashbord.component';
@NgModule({
  declarations: [NachFormUploadComponent, PrefilledNachFormDashboard],
  imports: [
    CommonModule,
    RouterModule.forChild(NACH),
    SharedLibModule,
    SharedModule,
  ],
  exports: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NachFormModule {}
