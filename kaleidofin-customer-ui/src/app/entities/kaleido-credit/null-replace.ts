import { Component, Input } from "@angular/core";

@Component({
  selector: "jhi-null-replace",
  template: `<div [ngClass]="['form-control-value', 'null-text', class || '', isEmpty && isMandatory? 'form-field-error': '' ]">
    <span>{{ getFinalValue() }}</span>
    <div class="form-field-error-container" *ngIf="errors && errors.length > 0">
      <div>
        <img src="assets/images/common/error-exclamation.svg" alt="error" />
      </div>
      <span class="form-field-error">{{ errors }}</span>
    </div>
  </div>`,
})
export class NullReplaceComponent {
  @Input()
  value: any;
  @Input()
  class: string = "";
  @Input()
  inputType?: string;
  @Input() errors: Array<string> = [];
  @Input() isMandatory: boolean = false;
  isEmpty : boolean = false;

  getFinalValue() {
    if (this.inputType == "date") {
      if (!this.value) {
        this.isEmpty = true;
        if (this.isMandatory) {
          return "*No Data";
        }
        return "--";
      }
      return `${this.value.day}-${this.value.month}-${this.value.year}`;
    } else if (this.inputType == "checkbox") {
      if (!this.value) {
        return this.value === false ? "No" : "--";
      } else {
        return "Yes";
      }
    } else if (!this.value && this.value !== 0) {
      this.isEmpty = true;
      if (this.isMandatory) {
        return "*No Data";
      }
      return "--";
    } else {
      this.isEmpty = false;
      return this.value;
    }
  }
}
