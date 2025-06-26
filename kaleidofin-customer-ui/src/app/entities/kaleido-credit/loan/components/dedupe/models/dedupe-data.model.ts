
export class DedupeData {
    constructor(
        public preprocessingCustomerIdRef?: any,
        public applicantNameRef?: any,
        public kyc1Ref?: any,
        public kyc2Ref?: any,
        public loanAmountRef?: any,
        public createdDateTimeRef?: any,
        public dateOfBirthRef?: any,
        public statusRef?: any,
        public addressRef?: any,
        public dedupeEntityTypeRef?: any,
        public coApplicantIdRef?: any,
        public coApplicantNumberRef?: any,
        public ucicRef?: any
) {
    }

    set preprocessingCustomerId(preprocessingCustomerIdRef: any) {
        this.preprocessingCustomerIdRef = preprocessingCustomerIdRef;
    }
    get preprocessingCustomerId(): any{
        return this.preprocessingCustomerIdRef;
    }
    set applicantName(applicantNameRef: any) {
        this.applicantNameRef = applicantNameRef;
    }
    get applicantName(): any{
        return this.applicantNameRef;
    }
    set kyc1(kyc1Ref: any) {
        this.kyc1Ref = kyc1Ref;
    }
    get kyc1(): any{
        return this.kyc1Ref;
    }
    set kyc2(kyc2Ref: any) {
        this.kyc2Ref = kyc2Ref;
    }
    get kyc2(): any{
        return this.kyc2Ref;
    }
    set loanAmount(loanAmountRef: any) {
        this.loanAmountRef = loanAmountRef;
    }
    get loanAmount(): any{
        return this.loanAmountRef;
    }
    set createdDateTime(createdDateTimeRef: any) {
        this.createdDateTimeRef = createdDateTimeRef;
    }
    get createdDateTime(): any{
        return this.createdDateTimeRef;
    }
    set dateOfBirth(dateOfBirthRef: any) {
        this.dateOfBirthRef = dateOfBirthRef;
    }
    get dateOfBirth(): any{
        return this.dateOfBirthRef;
    }
    set status(statusRef: any) {
        this.statusRef = statusRef;
    }
    get status(): any{
        return this.statusRef;
    }
    set address(addressRef: any) {
        this.addressRef = addressRef;
    }
    get address(): any{
        return this.addressRef;
    }
    set coApplicantId(coApplicantIdRef: any) {
        this.coApplicantIdRef = coApplicantIdRef;
    }
    get coApplicantId(): any{
        return this.coApplicantIdRef;
    }
    set dedupeEntityType(dedupeEntityTypeRef: any) {
        this.dedupeEntityTypeRef = dedupeEntityTypeRef;
    }
    get dedupeEntityType(): any{
        return this.dedupeEntityTypeRef;
    }
    set coApplicantNumber(coApplicantNumberRef: any) {
        this.coApplicantNumberRef = coApplicantNumberRef;
    }
    get coApplicantNumber(): any{
        return this.coApplicantNumberRef;
    }
    set ucic(ucicRef: any) {
        this.ucicRef = ucicRef;
    }
    get ucic(): any{
        return this.ucicRef;
    }
}
