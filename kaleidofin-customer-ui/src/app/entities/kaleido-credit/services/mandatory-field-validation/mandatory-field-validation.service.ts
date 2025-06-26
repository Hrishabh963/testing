import { Injectable } from "@angular/core";
import { FieldValidationDTO } from "./mandatory-fields.constants";
import { SECTION_INFORMATION, UiFields } from "src/app/constants/ui-config";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MandatoryFieldValidationService {
  mandatoryFields: BehaviorSubject<FieldValidationDTO> =
    new BehaviorSubject<FieldValidationDTO>({});

  constructor() {}

  extractMandatoryFields(
    sectionKey: string,
    uiFieldsMap: any[],
    uiFields: UiFields
  ): void {
    const currentFields = this.mandatoryFields.getValue();
    uiFieldsMap.forEach((field) => {
      if (field?.roles?.length) {
        if (uiFields[field?.propertyKey]?.value) {
          currentFields[field?.propertyKey] =
            currentFields[field?.propertyKey] || {};
          const mandatoryField = currentFields[field?.propertyKey];
          mandatoryField.fieldValue = uiFields[field?.propertyKey];
          mandatoryField.sectionScrollKey =
            SECTION_INFORMATION[sectionKey]?.scrollKey;
        }
      }
    });
    this.mandatoryFields.next({
      ...this.mandatoryFields.getValue(),
      ...currentFields,
    });
  }

  getMandatoryFields(): Observable<FieldValidationDTO> {
    return this.mandatoryFields?.asObservable();
  }

  removeField(field: string): void {
    const currentField = this.mandatoryFields?.getValue() ?? {};
    if(field) {
      delete(currentField[field]);
      this.mandatoryFields.next(currentField);
    }
  }

}
