import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-business-section-action-buttons",
  templateUrl: "./business-section-action-buttons.component.html",
  styleUrls: [
    "./business-section-action-buttons.component.scss",
    "../business-review-details.scss",
  ],
})
export class BusinessSectionActionButtonsComponent {
  @Input() isEditing: boolean = false;
  @Output() onRejectHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancelHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveHandler: EventEmitter<any> = new EventEmitter<any>();

  handleReject() {
    this.onRejectHandler.emit();
  }

  onEdit(): void {
    this.onEditHandler.emit();
  }

  onSave(): void {
    this.onSaveHandler.emit();
  }

  onCancel(): void {
    this.onCancelHandler.emit();
  }
}
