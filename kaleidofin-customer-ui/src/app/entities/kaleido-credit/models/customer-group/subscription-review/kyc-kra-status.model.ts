export enum Status {
  VERIFIED = "VERIFIED",
  SUBMITTED = "SUBMITTED",
  ON_HOLD = "ON_HOLD",
  REJECTED = "REJECTED",
  DEACTIVATED = "DEACTIVATED",
  NOT_AVAILABLE = "NOT_AVAILABLE",
}

export class KycKraStatus {
  constructor(
    public id?: number,
    public customerId?: number,
    public kycStatus?: Status,
    public modStatus?: string,
    public kycSubmitResponse?: string,
    public providerInformation?: any,
    public kycType?: string,
    public provider?: string,
    public actor?: string,
    public opsOverride?: boolean,
    public submittedDate?: Date,
    public modificationDate?: Date,
    public statusModifiedDate?: Date
  ) {
    // code...
  }
}
