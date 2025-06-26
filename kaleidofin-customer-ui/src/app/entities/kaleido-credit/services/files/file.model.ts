export class File {
    constructor(
        public id?: number,
        private readonly fileName?: string,
        private readonly fileSize?: number,
        private readonly type?: string,
        public uploaderId?: string
    ) {
    }
}

