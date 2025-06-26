import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";

@Directive({
  selector: "[appTrackSectionVisibility]",
})
export class TrackSectionVisibilityDirective
  implements OnInit, OnDestroy, OnChanges
{
  @Input() startObservation: boolean = false;
  @Output() visibilityChange = new EventEmitter<string>();

  private observer: IntersectionObserver;

  constructor(private readonly el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.visibilityChange.emit(this.el.nativeElement.id);
          }
        });
      },
      { threshold: 0.1 , rootMargin: "-40% 0px -20% 0px"}
    );
    if (this.startObservation) {
      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnChanges(): void {
    if (this.startObservation && this.observer) {
      this.observer.observe(this.el.nativeElement);
    }
    
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
