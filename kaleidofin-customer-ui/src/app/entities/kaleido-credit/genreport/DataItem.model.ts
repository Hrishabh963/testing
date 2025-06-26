import { MatSelectOption } from "../loan/constant";

export class DataItem implements MatSelectOption {
    name: string;
    isDefault: boolean;
    viewValue: string;
    value: any;
  
    constructor(name: string) {
      this.name = name;
    }
  }