import { AddressType } from "./address-enum.model";

export class Address {
  constructor(
    public id?: number,
    public version?: number,
    public customerId?: number,
    public addressType?: AddressType,
    public address1?: string,
    public address2?: string,
    public address3?: string | null,
    public city?: string | null,
    public district?: string | null,
    public landmark?: string | null,
    public state?: string,
    public country?: string | null,
    public pincode?: number,
    public email?: string | null,
    public mobile?: string | null,
    public contactDetails?: string | null,
    public stayDuration?: string | null,
    public stayType?: string | null,
    public postOffice?: string | null,
    public loanApplicationId?: number | null,
    public village?: string | null,
    public taluka?: string | null,
    public currentAndPermanentSame?: boolean | null,
    public entityName?: string | null,
    public entityId?: number | null,
    public addressAdditionalData?: string | null,
    public street?: string | null
  ) {}
}
