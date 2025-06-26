import { Component, Input, OnInit } from "@angular/core";
import { UiConfigService } from "../../services/ui-config.service";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-business-data-sheet",
  templateUrl: "./business-data-sheet.component.html"
})
export class BusinessDataSheetComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() editSections: boolean = false;
  businessDataSheet: Array<any> = [];
  businessDataSheetMap: any = {};

  constructor(private readonly uiConfigService: UiConfigService) {}

  ngOnInit(): void {
    this.getUiConfiguration();
  }
  getUiConfiguration(): void {
    this.uiConfigService.getUiInformationBySections("BUSINESS_DATA_SHEET",this.loanId).subscribe(
      (response) => {
        this.businessDataSheet = getProperty(response, "subSections", []);
      },
      (error) => console.error(error)
    );
    this.uiConfigService.getUiConfig("LOAN_REVIEW").subscribe(
      (data)=>{
        this.businessDataSheetMap = this.uiConfigService.getUiConfigurationsBySection(data,"BUSINESS_DATA_SHEET",true);
      },
      (error)=>{
        console.error(error); 
      }
    )
  }
}
