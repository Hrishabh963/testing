export type StatusENUM  = "ACTIVE"| "LOCKED" |  "SUSPENDED" | "INACTIVE" | "DELETED";

export interface HrmsUser {
  employeeId?: number;
  firstName?: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string | number;
  emailId: string;
  designation: string;
  uamStatus: string;
  salutation?: string;
  smName?: string;
  smHrmsId?: number;
  stateHeadName?: string;
  stateHeadHrmsId?: number;
  state?: string;
  solCode?: string;
  branch?: string;
  error?: string;
  status?: StatusENUM;
  requestUUID: string;
  empLdapUserId: string
}


export const USER_ACCESS_MANAGEMENT = {
  NEW_USER_DETAILS_MAP: "newUserDetailsMap",
  EDIT_USER_DETAILS_MAP: "editUserDetailsMap",
  USER_ROLES_MAP: "userRolesMap",
  OPTIONS_MAP: "optionsMap"
};


  export interface UserDTO {
    id: number;
    status: string;
    firstName: string;
    lastName: string;
    mobileNumber: number;
    customPassword?: string;
    reActivationDate?: string;
    branchId: number;
    langKey?: string;
    login: string;
    role: any;
    email: string;
    customRolesAndAuthority?: string;
    partnerId?: number;
    externalId?: number;
    recentLogin?: string;
  }

  export interface CreateUserRequestDto {
    id?: number;                 
    username: string;
    firstname: string;
    middleName?: string;
    lastname: string;
    email: string;
    langKey?: string;
    roles: string[];
    mobileNumber: number| string;
    employeeId?: number;
    partnerId?: number;
    password?: string;
    status: string;
    requestUUID?: string;
  }

  export interface UserSearchDTO {
    roles?: string[],
    login?: string,
    partnerId?: number,
    firstName?: string,
    externalId?: string,
    status?: StatusENUM[],
    size?:number,
    page?:number,
    nameOrEmailOrExternalId?: string,
  }


  export interface UserStatusUpdateDTO {
    status: StatusENUM,
    reActivationDate?: string
  }

export interface UserRoleCount {
    role: string;
    roleCount: number;
}

export interface UserCountDTO {
    totalUsers: number;
    activeUsers: number;
    userRoleCountList: UserRoleCount[];
}
