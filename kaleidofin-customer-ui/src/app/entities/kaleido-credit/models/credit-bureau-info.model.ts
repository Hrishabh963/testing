export class CreditBureauInfo {
  constructor(
    public id?: number,
    public version?: number,
    public customerNumber?: any,
    public emiDate?: any,
    public writtenOffAccounts?: number,
    public overdueStatus?: any,
    public totalOutstandingAmount?: number,
    public noOfMFI?: number,
    public noOfBanks?: number,
    public cbName?: any,
    public cbScore?: number,
    public noOfLenders?: number,
    public reportFileId?: any,
    public cbScoreErs?: any,
    public cbScoreMrs?: any,
    
  ) {}
}
