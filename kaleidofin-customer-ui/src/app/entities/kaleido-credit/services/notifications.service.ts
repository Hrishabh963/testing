import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface Notifications {
  notificationsList: string;
  errors: { [key: string]: any };
}

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  private readonly notifications = new BehaviorSubject<Notifications>({
    notificationsList: "",
    errors: {},
  });

  get notifications$(): BehaviorSubject<Notifications> {
    return this.notifications;
  }

  updateNotificationList(notifications: string): void {
    this.notifications.next({
      ...this.notifications.getValue(),
      notificationsList: notifications,
    });
  }

  /* Below Code to be refactored  */

  addError(
    key: string,
    errorsObject: any,
    subsection: string = null,
    dependentFieldErrors: any = {}
  ): void {
    const { errors } = this.notifications.getValue();
    let updatedErrors = { ...errors };

    if (subsection) {
      updatedErrors[key] = {
        ...updatedErrors[key],
        [subsection]: {
          ...(updatedErrors[key]?.[subsection] || {}),
          errors: errorsObject,
          type: "subsection",
          title: subsection,
        },
      };

      if (updatedErrors[key][subsection]?.errors) {
        Object.keys(updatedErrors[key][subsection].errors).forEach(
          (errorKey) => {
            if (!errorsObject.hasOwnProperty(errorKey)) {
              delete updatedErrors[key][subsection].errors[errorKey];
            }
          }
        );

        if (Object.keys(updatedErrors[key][subsection].errors).length === 0) {
          delete updatedErrors[key][subsection];
        }
      }

      if (Object.keys(updatedErrors[key]).length === 0) {
        delete updatedErrors[key];
      }
    } else {
      updatedErrors[key] = {
        ...(updatedErrors[key] || {}),
        ...errorsObject,
      };

      Object.keys(updatedErrors[key]).forEach((errorKey) => {
        if (
          !errorsObject.hasOwnProperty(errorKey) &&
          updatedErrors[key][errorKey]?.type !== "subsection"
        ) {
          delete updatedErrors[key][errorKey];
        }
      });

      if (Object.keys(dependentFieldErrors).length > 0) {
        updatedErrors[key]["dependentFieldError"] = {
          errors: dependentFieldErrors,
          type: "dependent",
        };
      }

      if (Object.keys(updatedErrors[key]).length === 0) {
        delete updatedErrors[key];
      }
    }

    this.notifications.next({
      ...this.notifications.getValue(),
      errors: updatedErrors,
    });
  }
}
