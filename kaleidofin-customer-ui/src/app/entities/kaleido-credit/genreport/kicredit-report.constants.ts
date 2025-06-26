import { DataItem } from "./DataItem.model";
export const LOAN_APPLICATION_DETAILS = "Loan Application";
export const INTERNAL_REPORT_TYPES = {
  [LOAN_APPLICATION_DETAILS]: `${LOAN_APPLICATION_DETAILS} Report`,
  Booking: "Booking Report",
  CMS: "CMS Report",
  Approval: "Approval Report",
  Disbursement: "Disbursal Report",
};
export const EXTERNAL_REPORT_TYPES = {
  Approval: "Approval Report",
  Disbursement: "Disbursal Report",
};

export const CUSTOMER_TYPES = {
  ENTREPRENEURAL: "Entrepreneural",
  JLG: "JLG",
};

export const createSelectAllObjects = (map = {}, withKeys = false) => {
  let dataList: string[] = withKeys ? Object.keys(map) : Object.values(map);
  return dataList.map((report) => new DataItem(report));
};
export const transformArrayToObject = (array: string[]): { [key: string]: string } => {
  return array.reduce((obj, currentValue) => {
    return { ...obj, [currentValue]: currentValue };
  }, {});
}
