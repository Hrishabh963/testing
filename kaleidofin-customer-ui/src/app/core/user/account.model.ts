export class Account {
    constructor(
      public login: string,
      public firstName: string,
      public lastName: string,
      public email: string,
      public imageUrl: string,
      public activated: boolean,
      public langKey: string,
      public role: string,
      public branchId: number,
      public partnerId: number,
      public branchsetId: number,
      public customerId: number,
      public authorities: string[]
    ) {}
  }
  