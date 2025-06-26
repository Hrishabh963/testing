import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-multi-select-chip",
  templateUrl: "./multi-select-chip.component.html",
  styleUrls: ["./multi-select-chip.component.scss"],
})
export class MultiSelectChipComponent {
  @Input() hideClose: boolean = false;
  @Input() chipContent: string;
  @Output() removeSelection: EventEmitter<void> = new EventEmitter<void>();

  remove(): void {
    this.removeSelection.emit();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.remove();
    }
  }
}
