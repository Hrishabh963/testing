class IDynamicColumns {
    constructor(
        public type: string,
        public value: number,
        public editable: boolean,
    ) { }
}

class IGroupInfoFields {
    constructor(
        public branchId: IDynamicColumns,
        public groupName: IDynamicColumns,
        public customerId: IDynamicColumns,
        public branchName: IDynamicColumns,
        public commonGroupDetails: ICommmonGroupDetails,
    ) { }
}

export class ICommonGroupDetail {
    constructor(
        public loanApplicationId: string,
        public customerName: string,
        public partnerCustomerId: string,
        public partnerLoanId: string,
        public applicationDate: string,
        public applicationStatus: string,
    ) { }
}

class ICommmonGroupDetails {
    constructor(
        public type: string,
        public value: ICommonGroupDetail[],
    ) { }
}

export class KGroupInfoDetails {
    constructor(
        public title: string,
        public formPost: string,
        public subsections: string,
        public fields: IGroupInfoFields
    ) { }
}