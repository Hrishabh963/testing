import { Customer } from "../customer/customer.model";

export class CashTransactions {
  constructor(
    public id?: number,
    public version?: number,
    public customerSubscriptionsId?: number,
    public transactionDate?: any,
    public status?: any,
    public advisoryFee?: number,
    public liquidityCardEnrollmentFee?: number,
    public dueDate?: any,
    public dueAmount?: number,
    public customerDTO?: Customer,
    public partnerId?: number,
    public branchId?: number,
    public paymentMode?: string,
    public misses?: number,
    public accountNum?: string
  ) {}
}
