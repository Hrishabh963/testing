
export class AssignUCICRequest {
    constructor(
        public acknowledgementID?: any,
        public ucicFlag?: any,
        public verifiedUCIC?: any
) {
    }

    set setAcknowledgementId(acknowledgementID: any) {
        this.acknowledgementID = acknowledgementID;
    }
    get getAcknowledgementId(): any{
        return this.acknowledgementID;
    }
    set setUcicFlag(ucicFlag: any) {
        this.ucicFlag = ucicFlag;
    }
    get getUcicFlag(): any{
        return this.ucicFlag;
    }
    set setVerifiedUCIC(verifiedUCIC: any) {
        this.verifiedUCIC = verifiedUCIC;
    }
    get getVerifiedUCIC(): any{
        return this.verifiedUCIC;
    }
}
