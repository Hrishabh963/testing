import { Component, Input } from "@angular/core";
import { get } from "lodash";
import { CustomerFileMapping } from "../../../models/customer/customer-file-mapping.model";
import { KycDetailsForLoan } from "../../../models/kyc-details.model";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "jhi-kyc",
  templateUrl: "./kyc.component.html",
  styleUrls: ["../../kcredit-loan.css", "./kyc.component.css"],
})
export class KycComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() loanId: any;
  @Input() partnerId: any;
  @Input() customerId: number;
  @Input() kycDetailsList: KycDetailsForLoan[] = [];  

  eKycStatus:string = null;
  customerFileMappingDtoList: CustomerFileMapping[];
  poaDocuments: any = [];
  poiDocuments: any = [];

  poiPanelOpenState: boolean = true;
  poaPanelOpenState: boolean = true;


  ngOnInit() {
    this.customerFileMappingDtoList = get(
      this.loanDetails,
      "customerFileMappingDTOList",
      []
    );
    this.eKycStatus = getProperty(this.loanDetails,'customerDTO.customerAdditionalData.kycStatus',null);
    this.getCustomerFileMappingImages();
  }

  getCustomerFileMappingImages() {
    
    this.customerFileMappingDtoList =
      get(this.loanDetails, "customerFileMappingDTOList", []) || [];

    const customerMap = this.customerFileMappingDtoList.reduce((map, obj) => {
      map[obj.id] = obj.fileId;
      return map;
    }, {});

    const resultArray = this.kycDetailsList.map((kycDetail) => ({
      ...kycDetail,
      fileId:  kycDetail['fileId'] || customerMap[kycDetail.customerFileMappingId] ||null,
    }));

    resultArray.forEach((kycItem) =>
      this.setImageToCustomerFileMapping(kycItem)
    );
  }

  setImageToCustomerFileMapping(kycdetail: Object) {
    const purpose: string = getProperty(kycdetail, "purpose", "");
    if (purpose.toLowerCase() === "poa") {
      this.poaDocuments.push(kycdetail);
    } else if (purpose.toLowerCase() === "poi") {
      this.poiDocuments.push(kycdetail);
    }
  }


}
