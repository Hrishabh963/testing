import clipboardCopy from "clipboard-copy";

export const copyToClipboard = (textToCopy: string = ""): boolean => {
  (async () => {
    try {
      await clipboardCopy(textToCopy);
      return true;
    } catch (error) {
      console.error("Failed to copy text: ", error);
      return false;
    }
  })();

  return true;
};

/** Return Date in this format -> ${year}-${month}-${day} */
export const formatDate = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const createRequestpayloadForDynamicSection = (
  uiFields: any = {}
): any => {
  const payload: any = {};
  Object.keys(uiFields).forEach((key) => {
    payload[key] = uiFields[key].value;
  });
  return payload;
};

export const getFormattedDate = (date: Date = null) => {
  if (date) {
    return `${date.getFullYear()}-${getFullDate(
      date.getMonth() + 1
    )}-${getFullDate(date.getDate())}`;
  }
  return date;
};
const getFullDate = (value) => {
  let formattedValue = value;
  if (value) {
    formattedValue = value < 10 ? "0" + value : value;
  }
  return formattedValue;
};
