import { Component, Input } from "@angular/core";
import { get } from "lodash";
import { DEDUPE_TYPE_ENUM, DedupeData, DedupeResponseDTO, DedupeResponseWrapper, matchingParamsMapper } from "../dedupe.models";
import { DedupeService } from "../dedupe.service";

@Component({
  selector: "app-dedupe-accordion",
  templateUrl: "./dedupe-accordion.component.html",
  styleUrls: ["./dedupe-accordion.component.scss"],
})
export class DedupeAccordionComponent {
  @Input() data: DedupeData = undefined;
  dedupeData: DedupeResponseDTO[] = [];
  dedupeType: DEDUPE_TYPE_ENUM;
  enableReject: boolean = false;
  matchingParamsObject: Record<string, string> = {};
  dedupeReferenceId: number = null;
  dedupeReferenceType: string = null; 

  panelOpenState = false;
  customerId:number = null;
  showDedupeForm: boolean = false;
  constructor(private readonly dedupeService: DedupeService) {}


  updateAccordionOpenState() {
    this.panelOpenState = true;
    const dedupeData = get(this.data, "customerInformation", {});
    this.dedupeReferenceType = get(this.data, "type", null);
    this.customerId = get(dedupeData, "customerNumber", null);
    this.dedupeReferenceId = this.data?.id ?? null;
    this.dedupeService
      .fetchDedupeData(this.dedupeReferenceId, this.dedupeReferenceType)
      .subscribe((response: DedupeResponseWrapper) => {        
        this.dedupeData = response?.dedupeResponseDTOList; 
        this.showDedupeForm = this.dedupeData?.length > 0;
        this.dedupeType = response?.dedupeType;
        this.enableReject = response?.rejectEnable;
        this.extractMatchingParameters(response?.matchingParameterList ?? []);
      });
  }

  extractMatchingParameters(paramsList: string[]): void {
    paramsList.forEach((param)=> {
      this.matchingParamsObject[param] = matchingParamsMapper[param];
    });
  }

  updateAccordionCloseState() {
    this.panelOpenState = false;
  }
}
