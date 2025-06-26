import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { AuthorizationService } from "../../services/authorization.service";
import { RecalculateBreService } from "../../services/recalculate-bre/recalculate-bre.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-section-edit-action",
  templateUrl: "./section-edit-action.component.html",
  styleUrls: ["./section-edit-action.component.scss"],
})
export class SectionEditActionComponent implements OnInit, OnDestroy {
  @Input() panelOpenState: boolean = false;
  @Input() isEditing: boolean = false;
  @Output() onEditHandler = new EventEmitter<any>();
  @Output() onCancelHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveHandler = new EventEmitter<any>();

  @Input() disableEdit: boolean = false;
  isRecalculationInProgress: boolean = false;

  recalculationProgressSubscription: Subscription;

  constructor(
    private readonly authorityService: AuthorizationService,
    private readonly recalculateBreService: RecalculateBreService
  ) {}

  ngOnInit(): void {
    this.disableEdit = this.disableEdit || this.authorityService.validateEditAccess();
    this.recalculationProgressSubscription = this.recalculateBreService
      .getRecalculationInProgress()
      .subscribe((isProgress: boolean) => {
        this.isRecalculationInProgress = isProgress;
      });
  }

  ngOnDestroy(): void {
    this.recalculationProgressSubscription.unsubscribe();
  }

  onCancel(event) {
    this.onCancelHandler.emit(event);
  }

  onSave(event) {
    this.onSaveHandler.emit(event);
  }

  onEdit(event) {
    this.onEditHandler.emit(event);
  }
}
