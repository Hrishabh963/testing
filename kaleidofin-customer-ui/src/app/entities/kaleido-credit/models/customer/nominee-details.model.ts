import { Address } from "./address.model";

export class NomineeDetails {
    constructor(
        public id?: number,
        public version?: number,
        public name?: any,
        public customerId?: number,
        public addressId?: number,
        public dateOfBirth?: any,
        public nomineeRelationship?: any,
        public address1?: any,
        public address2?: any,
        public city?: any,
        public state?: any,
        public pincode?: any,
        public isDefault?: any,
        public minor?: any,
        public guardianName?: any,
        public guardianDOB?: any,
        public guardianNomineeRelationship?: any,
        public guardianAddressId?: any,
        public nomineeAddress?: Address
) {
    }

}
