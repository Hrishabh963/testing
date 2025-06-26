import { HttpParams } from "@angular/common/http";
import { get } from "lodash";

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach((key) => {
      if (key !== "sort") {
        options = options.set(key, req[key]);
      }
    });
    if (req.sort) {
      req.sort.forEach((val: any) => {
        options = options.append("sort", val);
      });
    }
  }
  return options;
};

export const updateName = (
  instance = {},
  instanceFormKey = "name",
  canUpdateOtherNames = true
) => {
  let applicantName = get(instance, instanceFormKey, "");
  let newApplicantName = applicantName.split(" ");
  switch (true) {
    case newApplicantName.length === 3:
      instance[instanceFormKey] = newApplicantName[0];
      if (canUpdateOtherNames) {
        instance["middleName"] = newApplicantName[1];
        instance["lastName"] = newApplicantName.slice(2).join(" ");
      }
      break;
    case newApplicantName.length === 2:
      instance[instanceFormKey] = newApplicantName[0];
      if (canUpdateOtherNames) {
        instance["middleName"] = "";
        instance["lastName"] = newApplicantName.slice(1).join(" ");
      }
      break;
    case newApplicantName.length === 1:
      instance[instanceFormKey] = newApplicantName[0];
      if (canUpdateOtherNames) {
        instance["middleName"] = "";
        instance["lastName"] = "";
      }
      break;
    default:
      instance[instanceFormKey] = newApplicantName[0];
      if (canUpdateOtherNames) {
        instance["lastName"] = newApplicantName.slice(1).join(" ");
      }
      break;
  }
  return instance;
};

export const splitAndUpdateNames = (instance: any = {},instanceKey:string = "") => {
  if (instance?.[instanceKey]) {
    instance[instanceKey] = `${instance[instanceKey]} ${instance["middleName"] || ""} ${
      instance["lastName"] || ""
    }`;
  }
  return instance;
}

export const formattedDateForDateUtils = (date: Date) => {
  if(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    return [year, month, day].join("-");
  }
  return null;
};

export const getUploadStatusEnum = (loanStatus:string='') => {
  // Need to create a MAP to map Enum.
  return loanStatus;
}

export const createHttpParams = (searchParams: any = {}) => {
  let params = new HttpParams();

  Object.keys(searchParams).forEach((key) => {
    params = params.append(key, searchParams[key]);
  });
  return params;
}