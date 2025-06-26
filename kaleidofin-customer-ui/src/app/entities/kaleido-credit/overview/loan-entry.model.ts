
export class LoanEntry {
    constructor(
        public id?: number,
        public version?: number,
        public customerId?: number,
        public formsGeneratedLastTime?: number,
        public sequenceCurrentValue?: number,
        public partnerId?: number,
        public responseMessage?: string

) {
    }
}
