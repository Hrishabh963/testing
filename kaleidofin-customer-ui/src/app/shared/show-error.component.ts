import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';
import { get } from 'lodash';

@Component({
  selector: "ig-show-errors",
  template: `
    <ul *ngIf="shouldShowErrors()">
      <li style="color: red" *ngFor="let error of listOfErrors()">
        {{ error }}
      </li>
    </ul>
  `,
})
export class ShowErrorsComponent {
  private static readonly errorMessages = {
    required: () => "This field is required",
    minlength: (params: { requiredLength: string }) =>
      "The min number of characters is " + params.requiredLength,
    maxlength: (params: { requiredLength: string }) =>
      "The max allowed number of characters is " + params.requiredLength,
    pattern: (params: { requiredPattern: string }) =>
      "The required pattern is: " + params.requiredPattern,
    years: (params: { message: any }) => params.message,
    countryCity: (params: { message: any }) => params.message,
    uniqueName: (params: { message: any }) => params.message,
    telephoneNumbers: (params: { message: any }) => params.message,
    assetType: (params: { message: any }) => params.message,
  };

  @Input()
  private readonly control!: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    const isDirty = !!get(this, "control.dirty");
    const isTouched = !!get(this, "control.touched");
    return isDirty || isTouched;
  }

  listOfErrors(): string[] {
    const errors = this.control.errors || {};
    return Object.keys(errors).map((field) =>
      this.getMessage(field, get(errors, field))
    );
  }

  private getMessage(type: string, params: any) {
    const errors = get(ShowErrorsComponent.errorMessages, type);
    if (errors) return errors(params);
    return "";
  }
}
