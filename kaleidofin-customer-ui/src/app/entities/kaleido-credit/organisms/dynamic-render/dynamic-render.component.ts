import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { cloneDeep, get } from "lodash";
import { BehaviorSubject } from "rxjs";
import { SECTION_INFORMATION, UiFields } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { AuthorizationService } from "../../services/authorization.service";
import { FileService } from "../../services/files/file.service";
import { UiConfigService } from "../../services/ui-config.service";
import { CustomButton } from "../../models/CustomButton.model";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { LoanReviewService } from "../../report/loan-review.service";
import { NotificationsService } from "../../services/notifications.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MandatoryFieldValidationService } from "../../services/mandatory-field-validation/mandatory-field-validation.service";
@Component({
  selector: "app-dynamic-render-component",
  templateUrl: "./dynamic-render.component.html",
  styleUrls: ["./dynamic-render.component.scss"],
})
export class DynamicRenderComponent implements OnInit, OnChanges {
  @Input() data: any = {};
  @Input() loanId: number = null;
  @Input() isSubHeading: boolean = false;
  @Input() uiApiKey: string = "";
  @Input() payloadTypeKey: string = undefined;
  @Input() editSections: boolean = true;
  @Input() title: string = "";
  @Input() payloadType: string = "object";
  @Input() hideEditAction: boolean = undefined;
  @Input() enableEdit: boolean = false;
  @Input() customButtons: Array<any> = [];
  @Input() isSave: boolean = false;
  @Input() sectionKey: string = "";
  @Input() canViewReport: boolean = false;
  @Input() nestedInputKey: string = null;
  @Input() sectionTitle: string = null;
  @Output() saveData: EventEmitter<any> = new EventEmitter<any>();

  uiFieldKey: string = "";
  uiFieldMapKey: string = "";

  initialValues: any = {};
  validationErrors: {
    selfErrors: any;
    dependentFieldErrors: any;
  } = { selfErrors: {}, dependentFieldErrors: {} };

  readonly uiFieldsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  readonly uiFieldsMapSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<
    Array<any>
  >([]);
  @Input() uiFieldsMap: Array<any> = [];
  @Input() uiFields: any = {};

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly fileService: FileService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly authorityService: AuthorizationService,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly notificationService: NotificationsService,
    private readonly snackBar: MatSnackBar,
    private readonly mandatoryValidation: MandatoryFieldValidationService 
  ) {}

  ngOnInit(): void {
    if (
      !getProperty(this.uiFieldsMap, "length", 0) &&
      !getProperty(Object.keys(this.uiFields), "length", 0)
    ) {
      this.title = getProperty(this.data, "sectionTitle", "");
      this.uiFieldKey = getProperty(this.data, "uiFieldKey", "");
      this.uiFieldMapKey = getProperty(this.data, "uiFieldMapKey", "");
      this.payloadType = getProperty(this.data, "payloadType", "");
      this.canViewReport = getProperty(this.data, "canViewReport", false);
      this.hideEditAction = getProperty(
        this.data,
        "hideEditAction",
        this.hideEditAction
      );

      this.matIconRegistry.addSvgIcon(
        "pdf-icon",
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/common/bi_file-earmark-pdf.svg"
        )
      );
      this.canViewReport = getProperty(this.data, "canViewReport", false);
      this.matIconRegistry.addSvgIcon(
        "pdf-icon",
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/common/bi_file-earmark-pdf.svg"
        )
      );

      this.uiConfigService.loadUiConfigurations(
        this.uiFieldsSubject,
        this.uiFieldsMapSubject,
        this.uiFieldKey,
        this.uiFieldMapKey,
        this.loanId
      );
      this.uiFieldsSubject.subscribe((data) => {
        this.uiFields = data || {};
        this.initialValues = JSON.parse(JSON.stringify(this.uiFields));
      });
      this.uiFieldsMapSubject.subscribe((data) => {
        this.uiFieldsMap = data;
      });
    }
    this.sectionKey = this.uiApiKey || this.uiFieldKey;
    this.dependableFieldCheck
      .getRemarksDTO()
      .subscribe((remarks: Array<any>) => {
        if (remarks && remarks.length > 0) {
          const sectionRemark: any = remarks.find((remark) => {
            const sectionName: string = getProperty(remark, "sectionName", "");
            return sectionName === this.sectionKey;
          });
          this.validationErrors = sectionRemark
            ? this.dependableFieldCheck.processValidationErrors(
                sectionRemark,
                this.sectionTitle
              )
            : { selfErrors: {}, dependentFieldErrors: {} };

          Object.keys(this.validationErrors.selfErrors).forEach((key) => {
            if (this.uiFields[key]) {
              this.uiFields[key].errors = this.validationErrors.selfErrors[key];
            } else {
              delete this.validationErrors.selfErrors[key];
            }
          });
          this.notificationService.addError(
            this.sectionKey,
            this.validationErrors.selfErrors,
            this.sectionTitle,
            this.validationErrors.dependentFieldErrors
          );
        }
      });
    this.validateSectionAuthority();
  }

  initiateUiFieldsUpdate(uiFields: UiFields) {
    this.uiFields = {...uiFields};
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!get(changes, "editSections.firstChange", true)) {
      this.validateSectionAuthority();
    }
    if (get(changes, "uiApiKey.firstChange", false)) {
      this.sectionKey = this.uiApiKey || this.uiFieldKey;
      this.validateSectionAuthority();
    }
    if (get(changes, "uiApiKey.firstChange", false)) {
      this.nestedInputKey = this.nestedInputKey? this.nestedInputKey : null;
    }
    this.initialValues = JSON.parse(JSON.stringify(this.uiFields? this.uiFields : {}));
    const uiFieldsChange = changes['uiFields'];
    if(uiFieldsChange?.currentValue !== uiFieldsChange?.previousValue) {
      this.mandatoryValidation.extractMandatoryFields(this.sectionKey, this.uiFieldsMap, this.uiFields);
    }
    
  }

  onCustomButtonClickHandler(event: Event, customButton: CustomButton) {
    customButton.onClickHandler(customButton.data);
  }
  validateSectionAuthority() {
    if (this.editSections) {
      let authority = getProperty(
        SECTION_INFORMATION,
        `${this.sectionKey}.authority`,
        ""
      );
      if (authority) {
        this.editSections = this.authorityService.hasAuthority(authority);
      }
    }
  }

  toggleEditDetails() {
    this.enableEdit = !this.enableEdit;
  }

  saveDetails(): void {
    const applcationStatus: string = this.loanReviewService.getLoanStatus();
    if (this.isSave) {
      this.saveData.emit(this.uiFields);
      this.enableEdit = false;
      return;
    }
    const sectionApiKey: string = getProperty(
      SECTION_INFORMATION,
      `${this.sectionKey}.apiKey`,
      ""
    );
    let payload = this.uiConfigService.getRequestpayload(
      this.uiFields,
      this.payloadTypeKey,
      this.payloadType
    );
    if(this.nestedInputKey) {
      payload = {[this.nestedInputKey] : payload};
    }
    this.uiConfigService
      .updateUiFields(sectionApiKey, payload, this.loanId)
      .subscribe(
        (response) => {
          this.dependableFieldCheck.getLoanStageCheck(
            response,
            this.loanId,
            applcationStatus
          );
          this.initialValues = JSON.parse(JSON.stringify(this.uiFields));
          location.reload();
        },
        (errorResponse) => {
          console.error(errorResponse);
          const errors: Array<string> = getProperty(
            errorResponse,
            "error.errors",
            []
          );
          this.snackBar.open(errors.join(", "), "Error", { duration: 3000 });
          this.uiFields = { ...this.initialValues };
        }
      );
    this.enableEdit = false;
  }

  cancelEditDetails(): void {
    this.enableEdit = false;
    this.uiFields = { ...this.initialValues };
  }

  viewReport() {
    let reportFileId = get(this.uiFields, "fileId.value", null);
    if (reportFileId) {
      this.fileService.getFileURL(reportFileId).subscribe((url) => {
        window.open(url, "_blank");
      });
    }
  }

  getNestedValue(propertyKey: string): string {
    if (propertyKey) {
      let keys = propertyKey.split(".");
      let value = this.uiFields;
      for (let key of keys) {
        if (value[key]) {
          value = value[key];
        } else {
          value = null;
          break;
        }
      }
      return value;
    }
    return "";
  }
}
