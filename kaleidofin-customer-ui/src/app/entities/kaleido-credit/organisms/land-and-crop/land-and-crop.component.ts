import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from "@angular/core";
import { SECTION_INFORMATION } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "../../services/ui-config.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cloneDeep, get } from "lodash";
import { DependableFieldValidationService } from "../../dependable-field-validation.service";
import { LoanReviewService } from "../../report/loan-review.service";
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: "app-land-and-crop",
  templateUrl: "./land-and-crop.component.html",
})
export class LandAndCropComponent implements OnInit, OnChanges {
  @Input() loanId: number = null;
  @Input() editSections: boolean = null;

  panelOpenState: boolean = true;
  enableEdit: boolean = false;
  cropSubsections: Array<any> = [];
  cropsSections: Array<any> = [];
  sub30ProductSchemeSections: Array<any> = [];
  landInformationSections: Array<any> = [];

  landAndCropMap: Array<any> = [];
  cropSectionMap: Array<any> = [];
  sub30ProductScheme: Array<any> = [];
  initialCropSubsections: Array<any> = [];

  uiFieldMap: Array<any> = [];
  validationErrors: {[key: string] :  Array<string>}
  hasAuthority: boolean = false;

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly snackBar: MatSnackBar,
    private readonly dependableFieldCheck: DependableFieldValidationService,
    private readonly loanReviewService: LoanReviewService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.hasAuthority = this.authorizationService.hasAuthority(
      SECTION_INFORMATION.LAND_AND_CROP_DETAILS.authority
    );
    this.uiConfigService
      .getUiInformationBySections(
        SECTION_INFORMATION.LAND_AND_CROP_DETAILS.sectionKey,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          let sections = getProperty(response, "subSections", []);
          this.initialCropSubsections = JSON.parse(JSON.stringify(sections));
          this.updateLandAndCropStates(sections);
        },
        (error) => console.error(error)
      );
    this.uiConfigService
      .getUiConfigBySection(
        SECTION_INFORMATION.LAND_AND_CROP_DETAILS.sectionKey
      )
      .subscribe((response: any = {}) => {
        this.uiFieldMap = this.uiConfigService.getUiConfigurationsBySection(
          response,
          SECTION_INFORMATION.LAND_AND_CROP_DETAILS.sectionKey,
          true
        );
        this.cropSectionMap = getProperty(this.uiFieldMap, "cropDetails", []);
        this.landAndCropMap = getProperty(this.uiFieldMap, "landAndCrop", []);
        this.sub30ProductScheme = getProperty(
          this.uiFieldMap,
          "sub30ProductScheme",
          []
        );
      });

  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentEditSection: SimpleChange = get(changes, "editSections");
    this.updateSub30(currentEditSection?.currentValue);
  }

  updateSub30(editSection: boolean): void {
    let sub30Subsection = this.sub30ProductSchemeSections.find((section) =>
      section?.title.includes("Product scheme SUB-30")
    );
    sub30Subsection.customButtons = [
      {
        label: "Add Crop",
        class: "btn btn-primary",
        disabled: !editSection || !this.hasAuthority,
        onClickHandler: () =>
          this.addCropInformation(null, this.sub30ProductSchemeSections, true),
      },
    ];
  }

  updateLandAndCropStates(sections: Array<any> = []) {
    this.landInformationSections = sections.filter(
      (subSection) => !getProperty(subSection, "title", null)
    );

    this.cropsSections = sections.filter((subSection) => {
      const title: string = getProperty(subSection, "title", "");
      return title.toLowerCase().includes("crop");
    });

    this.sub30ProductSchemeSections = sections.filter((subSection) => {
      const title: string = getProperty(subSection, "title", "");
      return title.includes("SUB-30");
    });
    this.updateSub30(this.editSections);
  }
  toggleEditDetails(event) {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
  }

  removeCropInformation(data: any = {}, sections: Array<any> = []) {
    console.log(data);
    const indexToBeRemoved = getProperty(data, "index", null);
    if (indexToBeRemoved !== null) {
      sections.splice(indexToBeRemoved, 1);
    }
  }

  addCropInformation(
    event,
    section = this.cropsSections,
    isSub30Crop: boolean = false
  ) {
    if (event) {
      event.stopPropagation();
    }
    section.push({
      ...cloneDeep(newCropDetail),
      title: isSub30Crop
        ? `SUB-30 HP ${section.length} `
        : `Crop ${section.length + 1}`,
      customButtons: [
        {
          label: "Remove",
          onClickHandler: (data) =>
            this.removeCropInformation(
              data,
              isSub30Crop ? this.sub30ProductSchemeSections : this.cropsSections
            ),
          data: { index: section.length },
          class: "delete-button",
        },
      ],
    });

    if (isSub30Crop) {
      this.sub30ProductSchemeSections = section;
    } else {
      this.cropSubsections = section;
    }
  }

  getUiFieldMap(cropInformation: any = {}): any {
    let title: string = getProperty(cropInformation, "title", null);
    if (!title) {
      return this.landAndCropMap;
    } else if (title.includes("Product scheme")) {
      return this.sub30ProductScheme;
    } else {
      return this.cropSectionMap;
    }
  }

  cancel(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    this.cropSubsections = JSON.parse(
      JSON.stringify(this.initialCropSubsections)
    );
  }

  getPayload(): any {
    const payload: any = {};
    const landInformation: any = getProperty(
      this.landInformationSections,
      "[0].fields",
      {}
    );
    Object.keys(landInformation).forEach((key) => {
      payload[key] = getProperty(landInformation[key], "value", null);
    });

    const cropSubSectionData = this.cropsSections.map((subSection: any) => {
      const fields: any = getProperty(subSection, "fields", {});
      const cropData: any = {};
      Object.keys(fields).forEach((key) => {
        cropData[key] = getProperty(fields[key], "value", null);
      });
      return cropData;
    });
    payload["cropDetails"] = cropSubSectionData;

    const sub30ProductScheme: any = this.sub30ProductSchemeSections.find(
      (subSection) => {
        const title: string = getProperty(subSection, "title", "");
        return title.toLowerCase().includes("scheme");
      }
    );

    const sub30Fields: any = getProperty(sub30ProductScheme, "fields", {});
    Object.keys(sub30Fields).forEach((key) => {
      payload[key] = getProperty(sub30Fields[key], "value", null);
    });

    let sub30HpSections: Array<any> = this.sub30ProductSchemeSections.filter(
      (section) => !section.title.includes("Product scheme")
    );

    sub30HpSections = sub30HpSections.map((subSection: any) => {
      const fields: any = getProperty(subSection, "fields", {});
      const data: any = {};
      Object.keys(fields).forEach((key) => {
        data[key] = getProperty(fields[key], "value", null);
      });
      data["scheme"] = "sub-30 hp";
      return data;
    });
    payload["cropDetails"] = payload["cropDetails"].concat(sub30HpSections);

    return payload;
  }

  save(event: Event): void {
    event.stopPropagation();
    this.enableEdit = !this.enableEdit;
    const payload: any = this.getPayload();

    this.uiConfigService
      .updateUiFields(
        SECTION_INFORMATION.LAND_AND_CROP_DETAILS.apiKey,
        payload,
        this.loanId
      )
      .subscribe(
        (response: any) => {
          const applcationStatus: string =
            this.loanReviewService.getLoanStatus();
          this.dependableFieldCheck.getLoanStageCheck(
            response,
            this.loanId,
            applcationStatus
          );
          this.snackBar.open(`Updated successfully`, "", {
            duration: 3000,
          });
          location.reload();
        },
        (error) => {
          console.error(error);
          this.cropSubsections = JSON.parse(
            JSON.stringify(this.initialCropSubsections)
          );
          this.snackBar.open(`Error updating Land and Crop details`, "", {
            duration: 3000,
          });
        }
      );
  }
}

const newCropDetail = {
  title: "Crop 1",
  formPost: null,
  subSections: null,
  fields: {
    grossAgricultureIncome: {
      type: "number",
      value: null,
      editable: false,
    },
    pricePerQuintal: {
      type: "number",
      value: null,
      editable: true,
    },
    cropPlanted: {
      type: "string",
      value: null,
      editable: true,
    },
    sowingMonth: {
      type: "string",
      value: null,
      editable: true,
    },
    yeildPerAcre: {
      type: "number",
      value: null,
      editable: true,
    },
    costOfCultivationPerAcre: {
      type: "number",
      value: null,
      editable: true,
    },
    cropType: {
      type: "string",
      value: null,
      editable: true,
    },
    harvestMonth: {
      type: "string",
      value: null,
      editable: true,
    },
    noOfAcresCultivated: {
      type: "number",
      value: null,
      editable: true,
    },
  },
};
