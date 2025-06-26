import {DedupeEntityType} from '../../../../models/kcredit-enum.model';
export class DedupeCheckRequest {
    constructor(
        public lenderId?: number,
        public loanApplicationId?: number,
        public dedupeEntityType?: DedupeEntityType,
        public dedupeEntityId?: number
        
) {
    }

    set setLenderId(lenderId: number) {
        this.lenderId = lenderId;
    }
    get getLenderId(): number{
        return this.lenderId;
    }
    set setDedupeEntityType(dedupeEntityType: DedupeEntityType) {
        this.dedupeEntityType = dedupeEntityType;
    }
    get getDedupeEntityType(): DedupeEntityType{
        return this.dedupeEntityType;
    }
    set setLoanApplicationId(loanApplicationId: number) {
        this.loanApplicationId = loanApplicationId;
    }
    get getLoanApplicationId(): number{
        return this.loanApplicationId;
    }
    set setDedupeEntityId(dedupeEntityId: number) {
        this.dedupeEntityId = dedupeEntityId;
    }
    get getDedupeEntityId(): number{
        return this.dedupeEntityId;
    }
}
