import { CommonModule, CurrencyPipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { OtpFieldDirective } from "./directives/otp.directive";
import { AssetTypeFormatValidatorDirective } from "./directives/validators/asset_type.directive";
import { OptimisticErrorHandlerDialogComponent } from "./error-handler/optimistic-error-handler-popup.component";
import { FindLanguageFromKeyPipe } from "./language/find-language-from-key.pipe";
import { SharedLibModule } from "./shared-libs.module";
import { ShowErrorsComponent } from "./show-error.component";
import { CustomResource } from "./util/custom-resource.service";
import { MatBadgeIconDirective } from "./directives/mat-badge-icon.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [
    FindLanguageFromKeyPipe,
    ShowErrorsComponent,
    AssetTypeFormatValidatorDirective,
    OptimisticErrorHandlerDialogComponent,
    OtpFieldDirective,
    MatBadgeIconDirective,
  ],
  providers: [CustomResource, CurrencyPipe],
  exports: [
    SharedLibModule,
    FindLanguageFromKeyPipe,
    ShowErrorsComponent,
    AssetTypeFormatValidatorDirective,
    OtpFieldDirective,
    MatBadgeIconDirective,
  ],
  entryComponents: [OptimisticErrorHandlerDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedCommonModule {}
