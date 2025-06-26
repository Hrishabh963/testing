export class Payment {
  constructor(
    public partnerCustomerId?: string,
    public customerId?: number,
    public customerName?: string,
    public subscriptionId?: number,
    public subscriptionType?: string,
    public demandId?: number,
    public demandAmount?: number,
    public demandStatus?: string,
    public demandCreatedDate?: string,
    public accountNumber?: string,
    public accountType?: string,
    public paymentDate?: string,
    public paymentMode?: string,
    public totalAmount?: number,
    public paymentStatus?: string,
    public transactionReferenceId?: string,
    public branch?: string,
    public branchCode?: string,
    public center?: string,
    public centerCode?: string,
    public branchId?: number,
    public centerId?: number,
    public paymentModeId?: string,
    public fee?: string
  ) {}
}

export class PaymentPage {
  constructor(
    public content?: Payment[],
    public totalPages?: number,
    public totalElements?: number
  ) {}
}
