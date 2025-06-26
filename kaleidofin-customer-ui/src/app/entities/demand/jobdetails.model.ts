export class JobDetailsDTO {
  constructor(
    public id?: number,
    public version?: number,
    public jobName?: string,
    public partnerId?: number,
    public jobConfiguration?: string,
    public inputFileId?: number,
    public outputFileId?: number,
    public errorFileId?: number,
    public totalCount?: number,
    public successCount?: number,
    public failureCount?: number,
    public jobStatus?: string,
    public responseMessage?: string,
    public uploadedDate?: string,
    public createdBy?: string,
    public successResponse?: boolean,
    public outputFileId2?: number,
    public outputFileId3?: number,
    public errorFileId2?: number,
    public errorFileId3?: number,
    public createdDate?: string,
    public jobType?: string
  ) {}
}
