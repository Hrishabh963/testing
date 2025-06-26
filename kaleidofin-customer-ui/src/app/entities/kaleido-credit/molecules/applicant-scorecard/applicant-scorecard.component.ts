import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-applicant-scorecard",
  templateUrl: "./applicant-scorecard.component.html",
  styleUrls: [
    "../review-section-fields.scss",
  ],
})
export class ApplicantScorecardComponent implements OnInit {
  @Input() loanId: number;
  @Input() uiFieldKey = "";
  @Input() uiFieldMapKey = "";
  constructor(private readonly uiConfigService: UiConfigService) {}

  readonly uiFields: BehaviorSubject<any> = new BehaviorSubject<any>({});
  readonly uiFieldsMap: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(
    []
  );

  addressField: string = null;
  ngOnInit(): void {
    this.uiConfigService.loadUiConfigurations(
      this.uiFields,
      this.uiFieldsMap,
      this.uiFieldKey,
      this.uiFieldMapKey,
      this.loanId
    );
  }
}
