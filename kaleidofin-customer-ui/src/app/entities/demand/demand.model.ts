export class Demand {
  constructor(
    public id?: number,
    public inputFileId?: number,
    public jobName?: string,
    public outputFileId?: number,
    public errorFileId?: number,
    public totalCount?: number,
    public successCount?: number,
    public failureCount?: number,
    public uploadedDate?: string,
    public jobStatus?: string,
    public createdDate?: Date
  ) {}
}

export class DemandPage {
  constructor(
    public content?: Demand[],
    public size?: number,
    public number?: number,
    public totalPages?: number,
    public totalElements?: number,
    public first?: boolean,
    public last?: boolean
  ) {}
}
