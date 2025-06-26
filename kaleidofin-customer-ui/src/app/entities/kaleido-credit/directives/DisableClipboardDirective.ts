import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[appDisableClipboard]",
})
export class DisableClipboardDirective {
  @HostListener("copy", ["$event"])
  @HostListener("cut", ["$event"])
  onClipboardAction(event: ClipboardEvent): void {
    event.preventDefault();
  }
}
