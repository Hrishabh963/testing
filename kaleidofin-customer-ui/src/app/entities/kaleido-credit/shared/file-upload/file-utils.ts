import { get } from "lodash";
import { ACCEPTED_FILE_TYPES, THUMBNAIL_ICONS } from "./file.constants";
export const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || "";
};

export const validateFileTypes = (
  file: File,
  acceptedFileTypes = ACCEPTED_FILE_TYPES
): boolean => {
  const fileExtension = getFileExtension(file.name);

  if (!acceptedFileTypes.includes(fileExtension)) {
    return false; // File type is not allowed
  }

  return true; // All files have accepted file types
};

export const getThumbnailUrl = (fileExtension: string = ""): string => {
  let extenstion = fileExtension?.toLowerCase();
  const thumbnailPath = THUMBNAIL_ICONS[fileExtension.toLowerCase()];
  if (thumbnailPath) {
    return thumbnailPath;
  } else {
    return extenstion;
  }
};

export const checkDocumentFormats = (doc): boolean => {
  let allowedFormats: Array<string> = [
    "pdf",
    "xlsx",
    "xls",
    "csv",
    "doc",
    "docx",
    "eml",
  ];
  let docType: string = get(doc, "docType", "") || "";
  if (docType) {
    docType = docType.toLowerCase();
  }
  return allowedFormats.some((format) => docType.includes(format));
};
