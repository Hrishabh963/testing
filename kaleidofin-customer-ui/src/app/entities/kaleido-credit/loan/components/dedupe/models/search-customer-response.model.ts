import {DedupeEntityType} from '../../../../models/kcredit-enum.model';
import {ExecutedDedupeResult} from './executed-dedupe-result.model';

export class SearchCustomerResponse {
    constructor(
    public  acknowledgementID?: any,
    public  dedupeEntityType?: DedupeEntityType,
    public  matchCount?: any,
    public  executedDedupeResultList?: ExecutedDedupeResult[],
    public  loanApplicationId?: number,
    public  entityId?: any,
    public  entityName?: any,
    public  poiId?: any,
    public  poiName?: any,
    public  poaId?: any,
    public  poaName?: any,
    public  loanAmount?: any,
    public  createdDateAndTime?: any,
    public  dateOfBirth?: any,
    public  ucic?: any,
    public  message?: any,
    public  responseCode?: any,
    public  status?: any
) {
}
}
