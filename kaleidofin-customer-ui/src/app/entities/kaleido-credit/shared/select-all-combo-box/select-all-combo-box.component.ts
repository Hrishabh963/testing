import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-all-combo-box',
  templateUrl: './select-all-combo-box.component.html',
  styleUrls: ['./select-all-combo-box.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectAllComboBoxComponent {
@Input() model: FormControl;
@Input() values = [];
@Input() text = 'Select All'; 

isChecked(): boolean {
  return this.model.value && this.values.length
    && this.model.value.length === this.values.length;
}

isIndeterminate(): boolean {
  return this.model.value && this.values.length && this.model.value.length
    && this.model.value.length < this.values.length;
}

toggleSelection(change): void {
  if (change.checked) {
    this.model.setValue(this.values);
  } else {
    this.model.setValue([]);
  }
}
}
