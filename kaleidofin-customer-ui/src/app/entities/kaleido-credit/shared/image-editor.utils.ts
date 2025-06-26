export const bytesToShortestUnit = (bytes: number): string => {
  if (!bytes) {
    return `0 B`;
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let unitIndex = 0;
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }
  return `${+(bytes).toFixed(2)} ${units[unitIndex]}`;
};


export const getFileSizeFromBase64 = (base4String: string = "") => {
  let blobFile: Blob = base64ToBlob(base4String, "image/jpg");
  return bytesToShortestUnit(blobFile.size);
};

export const openPdfFromBase64Image = (base64String: string = "") => {
  const blob = base64ToBlob(base64String, "application/pdf");
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};

export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = window.atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: mimeType });
};
