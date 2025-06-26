export interface IUser {
    id?: any;
    login?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    activated?: boolean;
    langKey?: string;
    authorities?: any[];
    createdBy?: string;
    createdDate?: Date;
    lastModifiedBy?: string;
    lastModifiedDate?: Date;
    password?: string;
  }
  
  export class User implements IUser {
    constructor(
      public id?: any,
      public login?: string,
      public firstName?: string,
      public lastName?: string,
      public email?: string,
      public activated?: boolean,
      public langKey?: string,
      public authorities?: any[],
      public createdBy?: string,
      public createdDate?: Date,
      public lastModifiedBy?: string,
      public lastModifiedDate?: Date,
      public password?: string,
      public role?: string,
      public branchSet?: string,
      public branchId?: number,
      public partnerId?: number,
      public branchsetId?: number,
      public customerId?: number,
      public isCustomer?: boolean,
      public activationKey?: string
    ) {
      this.id = id ?? null;
      this.login = login || '';
      this.firstName = firstName|| '';
      this.lastName = lastName || '';
      this.email = email || '';
      this.activated = activated ?? false;
      this.langKey = langKey || '';
      this.authorities = authorities || [];
      this.createdBy = createdBy || '';
      this.createdDate = createdDate || undefined;
      this.lastModifiedBy = lastModifiedBy || '';
      this.lastModifiedDate = lastModifiedDate || undefined;
      this.password = password || '';
    }
  }
  