
import { get } from "lodash";
import { MatSelectOption } from "src/app/entities/kaleido-credit/loan/constant";

export const groupObjects = (
  inputArray: any[],
  title = "loanDocumentStage",
  category = "documentCategory",
  type = "documentType"
) => {
  let output = {};

  inputArray.forEach((obj) => {
    const loanDocumentStage = get(obj, title, "");
    const documentCategory = get(obj, category, "");
    const documentType = get(obj, type, "");
    if (!output[loanDocumentStage]) {
      output[loanDocumentStage] = {};
    }

    if (!output[loanDocumentStage][documentCategory]) {
      output[loanDocumentStage][documentCategory] = {};
    }

    if (!output[loanDocumentStage][documentCategory][documentType]) {
      output[loanDocumentStage][documentCategory][documentType] = [];
    }

    output[loanDocumentStage][documentCategory][documentType].push(obj);
  });
  return output;
};

export const groupObjectsWithMultiParams = (inputArray, ...groupProps) => {
  const output = { items: [] };

  inputArray.forEach((obj) => {
    let currentObj = output;
    for (const prop of groupProps) {
      const value = obj[prop] || "";
      if (!currentObj[value]) {
        currentObj[value] = {};
      }
      currentObj = currentObj[value];
    }
    (currentObj.items || (currentObj.items = [])).push(obj);
  });

  return output;
};

export const isImagePDF = (imageString: string): boolean => {
  // Convert the base64 string to a Uint8Array
  if (!imageString) {
    return false;
  }
  imageString = imageString.trim();
  const binaryData = window.atob(imageString);
  const bytes = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    bytes[i] = binaryData.charCodeAt(i);
  }

  // Check if the byte array starts with the PDF file signature "%PDF"
  const pdfSignature = [37, 80, 68, 70]; // [0x25, 0x50, 0x44, 0x46]
  for (let i = 0; i < pdfSignature.length; i++) {
    if (bytes[i] !== pdfSignature[i]) {
      return false;
    }
  }
  return true;
};

export const buildSelectOptions = (options: string[]):MatSelectOption[] => {
  return options.map((option):MatSelectOption => ({ value: option, viewValue: option }));
};
