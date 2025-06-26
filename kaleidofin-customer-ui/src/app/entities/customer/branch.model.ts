export class BranchDTO {
    constructor(public id?: number, public name?: string) {}
  }
  
  export class CenterDTO {
    constructor(
      public id?: number,
      public name?: string,
      public branchId?: number
    ) {}
  }
  
  export class BranchAndCenterDTO {
    constructor(
      public branchDTOList?: BranchDTO[],
      public centerDTOList?: CenterDTO[]
    ) {}
  }
  
  export class SearchDTO {
    constructor(public branchId?: number[], public centerId?: number[]) {}

  }
  