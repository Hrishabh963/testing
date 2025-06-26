import { Directive, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[appDisablePaste]",
})
export class DisablePasteDirective {
  @Input() appDisablePaste: boolean = false;

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }
}
