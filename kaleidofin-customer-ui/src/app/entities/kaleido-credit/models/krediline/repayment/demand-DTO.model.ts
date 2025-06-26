export class DemandDetailsDTO{
    constructor(
		public  emiDate?: Date,
		public  amount?: number,
		public  amountPending?: number,
		public  amountPaid?: number,
		public  amountDue?: number,
		public  interest?: number,
		public  principal?: number,
		public  penalty?: number,
		public  status?: string,
		public  paidDate ?: Date,
		public  PaymentMode ?: any,
		public  paymentId ?: any,
		public  paymentStatus?: any,
		public  routingInstruction?: any,
		public balance?: any

    ){}
}