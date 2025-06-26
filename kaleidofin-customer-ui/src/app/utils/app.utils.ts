import { get } from "lodash";
import { ROLES } from "../core/auth/roles.constants";
import { ApplicationStatus } from "../entities/kaleido-credit/loan/constant";
import { UiFields, UiFieldsDto } from "../constants/ui-config";

export const getProperty = (
  referenceData: any,
  key: string,
  defaultValue: any = null
) => {
  return get(referenceData, key, defaultValue) || defaultValue;
};

export const getUiConfig = (configResponse: any) => {
  try {
    let configString = getProperty(configResponse, "[0].uiConfigurations", "");
    return JSON.parse(configString);
  } catch (error) {
    console.error(error);
  }
  return {};
};

export const camelCaseToRegularText = (str: string = ""): string => {
  if (!str) {
    return str;
  }
  str = str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .join(" ")
    .toLowerCase();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
};

export const getSubsectionFields = (
  subSections: Array<any> = [],
  sectionKey: string = ""
): Array<any> => {
  return (
    subSections.find((subsection: any) => {
      const title: string = subsection?.title ?? "";
      return title.toLowerCase().includes(sectionKey.toLowerCase());
    })?.uiFields ?? []
  );
};

export const getSubsection = (
  subSections: Array<UiFieldsDto> = [],
  sectionKey: string = ""
): UiFields => {
  const fields = subSections.find(
    (subsection: UiFieldsDto) =>
      subsection?.title?.toLowerCase() === sectionKey?.toLowerCase()
  );
  return fields?.fields;
};

export const determineStatus = (
  status: string = "",
  workflow: string = "",
  showStatus: boolean = true
): string => {
  const roleStatus =
    workflow === ROLES.ROLE_UNDERWRITER
      ? "Credit Underwriter - Pending"
      : "Credit Analyst - Pending";
  const loanStatus =
    workflow === ROLES.ROLE_UNDERWRITER
      ? "Loan Review - Credit Underwriter - Pending"
      : "Loan Review - Credit Analyst - Pending";
  switch (status) {
    // Review stages
    case ApplicationStatus.externalpending:
      if (!workflow) {
        return "Pending";
      }
      return showStatus ? loanStatus : roleStatus;
    case ApplicationStatus.reject:
      return showStatus ? "Loan Review - Rejected" : "Rejected";
    case ApplicationStatus.retry:
      return showStatus ? "Loan Review - Rework" : "Rework";
    case ApplicationStatus.conditionalapprove:
      return showStatus ? "Loan Review - Approved" : "Approved";
    case ApplicationStatus.cancelled:
      return showStatus ? "Loan Review - Cancelled" : "Cancelled";
    // Agreement stages
    case ApplicationStatus.pendingagreement:
      return showStatus ? "Loan Agreement - Pending" : "Pending";
    case ApplicationStatus.agreementreceived:
      return showStatus ? "Loan Agreement - Received" : "Received";
    case ApplicationStatus.agreementretry:
      return showStatus ? "Loan Agreement - Rework" : "Rework";
    case ApplicationStatus.approve:
      return showStatus ? "Loan Agreement - Approved" : "Approved";
    // Booking stages
    case ApplicationStatus.pendingbooking:
    case ApplicationStatus.externalbooking:
      return showStatus ? "Loan Booking - Pending" : "Pending";
    case ApplicationStatus.booked:
      return showStatus ? "Loan Booking - Booked" : "Booked";
    case ApplicationStatus.rejectedbooking:
    case ApplicationStatus.rejectedexternalbooking:
      return showStatus ? "Loan Booking - Rejected" : "Rejected";
    // Disbursal stages
    case ApplicationStatus.pendingdisbursal:
    case ApplicationStatus.externaldisbursal:
      return showStatus ? "Loan Disbursal - Pending" : "Pending";
    case ApplicationStatus.disbursed:
      return "Loan Disbursed";
  }
  return status;
};

export const titleCase = (st: string): string => {
  if (!st?.length) {
    return "";
  }
  return st
    .toLowerCase()
    .split(" ")
    .reduce(
      (s, c) => s + "" + (c.charAt(0).toUpperCase() + c.slice(1) + " "),
      ""
    );
};

export const formatCurrencyINR = (amount) => {
  if (typeof amount !== "number") return "";

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};
