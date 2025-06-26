export class ReferenceCode {
    constructor(
        public id?: number,
        public version?: number,
        public classifier?: string,
        public name?: string,
        public code?: string,
        public parentClassifier?: string,
        public parentReferenceCode?: string,
        public status?: any,
        public field1?: string,
        public field2?: string,
        public field3?: string,
        public field4?: string,
        public field5?: string,
    ) {
    }
}
