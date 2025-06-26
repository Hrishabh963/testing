import { Injectable } from "@angular/core";
import { set } from "lodash";
import { UiFields } from "src/app/constants/ui-config";
import { formatCurrencyINR, getProperty } from "src/app/utils/app.utils";

@Injectable({
  providedIn: "root",
})
export class BreValidationService {
  newTractor: UiFields = {};
  usedAndRefinanceTractor: UiFields = {};
  implement: UiFields = {};
  identifyCustomerDetails: UiFields = {};
  approveFinalAmounts: UiFields = {};
  eligibilityCalculation: UiFields = {};
  fieldMap: any = {};

  setFormData(key: string, value: any) {
    set(this, key, value);
  }
  validateForm(
    currentForm: any = {},
    currentFormData: any = {},
    uiFieldsMap: any = []
  ) {
    let isValid = true;

    for (const field of uiFieldsMap) {
      const validationType: Array<any> = getProperty(
        field,
        "metadata.validationType",
        []
      );

      if (validationType?.length) {
        for (const type of validationType) {
          const propertyKey = getProperty(field, "propertyKey", "");
          const currentValue = getProperty(currentFormData, propertyKey, "");
          switch (type) {
            case "DEPENDENT_MAX_AMOUNT":
              const dependentKeys = getProperty(
                field,
                "metadata.dependentKeys",
                []
              );
              for (const key of dependentKeys) {
                const dependentValue = getProperty(this, `${key}.value`);
                if (dependentValue) {
                  isValid = currentValue < dependentValue;
                  if (!isValid) {
                    currentForm = {
                      ...currentForm,
                      [propertyKey]: {
                        ...getProperty(currentForm, propertyKey, {}),
                        error: `Value cannot be greater than the amount requested by borrower [${formatCurrencyINR(dependentValue)}]`,
                      },
                    };
                    return { currentForm, isValid };
                  } else {
                    currentForm = {
                      ...currentForm,
                      [propertyKey]: {
                        ...getProperty(currentForm, propertyKey, {}),
                        error: "",
                      },
                    };
                    return { currentForm, isValid };
                  }
                }
              }
              break;
            case "MAX_AMOUNT":
              const maxAmount = getProperty(field, "metadata.maxAmount", 0);
              isValid = currentValue < maxAmount;
              if (!isValid) {
                currentForm = {
                  ...currentForm,
                  [propertyKey]: {
                    ...getProperty(currentForm, propertyKey, {}),
                    error: `Loan Amount for used tractor cannot be greater than ${formatCurrencyINR(
                      maxAmount
                    )}`,
                  },
                };
                return { currentForm, isValid };
              } else {
                currentForm = {
                  ...currentForm,
                  [propertyKey]: {
                    ...getProperty(currentForm, propertyKey, {}),
                    error: "",
                  },
                };
                return { currentForm, isValid };
              }
            default:
              break;
          }
        }
      }
    }

    return { currentForm, isValid };
  }
}
