
export class CustomerFileMapping {
    constructor(
        public id?: number,
        public customerId?: number,
        public fileId?: number,
        public fileType?: any,
        public expiryDate?: any,
        public origFileMappingId?: any,
        public rejectReason?: any,
        public reviewStatus?: any,
        public techIssueReason?: any,
        public techIssueStatus?: any,
        public uploadedDate?: any,
        public purpose?: any,
        public image?: any
    ) {

    }
}
