import { Directive } from "@angular/core";
import {
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
  FormControl
} from "@angular/forms";

@Directive({
  selector: "[igAssetType]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AssetTypeFormatValidatorDirective,
      multi: true
    }
  ]
})
export class AssetTypeFormatValidatorDirective implements Validator {
  validate(c: FormControl): ValidationErrors {
    const isValidAssetType = /^(SENSEI)([A-Z]{3})(-)(\d{3})$/.test(c.value);
    const message = {
      assetType: {
        message: "The Asset Type Should be in Format(SENSEIXYZ-123)"
      }
    };
    return isValidAssetType ? {} : message;
  }
}
