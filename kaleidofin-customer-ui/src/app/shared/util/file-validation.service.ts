import { Injectable } from "@angular/core";

@Injectable()
export class FileValidation {
  public validateFormat(oInput: { type: string; name: any; }, _validFileExtensions: string | any[]) {
    if (!oInput) {
      return false;
    }
    let fileType = "";
    if (oInput.type == "" || !oInput.type) {
      fileType = this.getExtension(oInput);
    }
    if (oInput.type || fileType) {
      let sFileName = oInput.name;
        if (sFileName.length > 0 && !this.helperFunction(sFileName,_validFileExtensions)) {
          return false;
        }
    }
    return true;
  }

  public getExtension(file: { name: any; }) {
    const basename = file.name;
    const pos = basename.lastIndexOf(".");
    if (basename === "" || pos < 1) return "";
    return basename.slice(pos + 1);
  }
  
  helperFunction(sFileName, _validFileExtensions) {
    let blnValid = false;
    for (let elm of _validFileExtensions) {
      let sCurExtension = elm;
      if (
        sFileName
          .substr(
            sFileName.length - sCurExtension.length,
            sCurExtension.length
          )
          .toLowerCase() == sCurExtension.toLowerCase()
      ) {
        blnValid = true;
        break;
      }
    }
    return blnValid;
    
  }
}

