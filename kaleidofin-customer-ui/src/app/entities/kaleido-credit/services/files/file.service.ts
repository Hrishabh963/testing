import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { saveAs } from "file-saver";
import { Observable } from "rxjs";
import {
  KALEIDO_SERVER_API_URL,
  KREDILINE_SERVER_URL,
} from "src/app/app.constants";
import { File } from "../files/file.model";
import { DocumentViewerComponent } from "../../atoms/document-viewer/document-viewer.component";

@Injectable()
export class FileService {
  private readonly fileUrl = "resources/file/upload";
  private downloadApi = "api/backoffice/file/stream/";
  constructor(private readonly http: HttpClient, private dialog: MatDialog) {}

  upload(files: any): Observable<File[]> {
    const fileUpload = new FormData();
    const fileCount = files.length;
    if (fileCount > 0) {
      for (let i = 0; i < fileCount; i++) {
        fileUpload.append(files[i].key, files[i].value, files[i].value.name);
      }
    } else {
      fileUpload.append("files", "");
    }
    return this.http.post<File[]>(this.fileUrl, fileUpload);
  }

  uploadKalImage(files: any, partnerId: number): Observable<File[]> {
    const fileUpload = new FormData();
    const fileCount = files.length;
    if (fileCount > 0) {
      for (let i = 0; i < fileCount; i++) {
        fileUpload.append("file" + i, files[i], files[i].name);
      }
    } else {
      fileUpload.append("files", "");
    }
    return this.http.post<File[]>(
      `${KALEIDO_SERVER_API_URL}api/backoffice/customer/files/upload?partnerId=${partnerId}`,
      fileUpload
    );
  }

  uploadKaleidofinImage(
    files: any,
    source: string,
    partnerId: number
  ): Observable<File[]> {
    const fileUpload = new FormData();
    const fileCount = files.length;
    if (fileCount > 0) {
      for (let i = 0; i < fileCount; i++) {
        fileUpload.append("file" + i, files[i], files[i].name);
      }
    } else {
      fileUpload.append("files", "");
    }
    return this.http.post<File[]>(
      `${KREDILINE_SERVER_URL}api/backoffice/files/upload/source?fileSource=${source}&partnerId=${partnerId}`,
      fileUpload
    );
  }

  fileStream(id: number, fileType: string) {
    return this.http.get(
      `${KALEIDO_SERVER_API_URL}api/backoffice/file/getBase64/${id}/${fileType}`
    );
  }

  fileStreamString(id: number, fileType: string) {
    this.http
      .get(
        `${KALEIDO_SERVER_API_URL}api/backoffice/file/getBase64/${id}/${fileType}`
      )
      .subscribe(
        (res: any) => {
          return res.text();
        },
        () => {
          console.log("Image not found : " + fileType);
          return "";
        }
      );
  }

  fileStreamS3(id: number, fileType: string, fileName?: any) {
    return this.http.get(
      `${KREDILINE_SERVER_URL}api/backoffice/file/stream/${id}/${fileType}`,
      {
        observe: "body",
        responseType: "blob" as "json",
      }
    );
  }

  hasFileExtension(fileName: string): boolean {
    const parts = fileName.split(".");
    return parts.length > 1 && parts[parts.length - 1].length > 0;
  }



  downloadFile(id: any, fileName?: any, api?: any) {
    const out = { data: null, filename: null };
    if (api) {
      this.downloadApi = api;
    }
    return this.http
      .get(KALEIDO_SERVER_API_URL + this.downloadApi + id, {
        observe: "response",
        responseType: "blob",
      })
      .subscribe((res: any) => {
        const type = res.headers.get("content-type");
        if (res.headers.get("x-file-name")) {
          out.filename = res.headers.get("x-file-name");
        } else if (fileName !== null && fileName !== undefined) {
          out.filename = fileName;
        } else {
          out.filename = id;
        }
        out.data = new Blob([res.body]);
        out.filename =
          !["forwardFeed", "kaleidoID"].includes(type) &&
          this.hasFileExtension(out.filename)
            ? out.filename
            : out.filename + "." + type;
        out.data.size > 0
          ? saveAs(out.data, out.filename)
          : console.log("error");
      });
  }

  downloadForwordFeedFile(id: any, fileName?: any) {
    const out = { data: null, filename: null };
    return this.http
      .get(this.downloadApi + id, {
        observe: "body",
        responseType: "blob" as "json",
      })
      .subscribe((res: HttpResponse<Blob>) => {
        if (res.headers.get("x-file-name")) {
          out.filename = res.headers.get("x-file-name");
        } else if (fileName !== null && fileName !== undefined) {
          out.filename = fileName;
        } else {
          out.filename = id;
        }
        out.data = new Blob();
        out.filename = fileName;
        out.data.size > 0
          ? saveAs(out.data, out.filename)
          : console.log("error");
      });
  }
  fileStreamById(id: number) {
    const out = { data: null, filename: null };
    return this.http
      .get(`${KREDILINE_SERVER_URL}api/backoffice/file/stream/${id}`, {
        observe: "body",
        responseType: "blob" as "json",
      })
      .subscribe((res: Response) => {
        const type = res.headers.get("content-type");
        out.filename = res.headers.get("x-file-name");
        out.data = new Blob();
        if (!out.filename.includes(".")) {
          out.filename = out.filename + "." + type;
        }
        out.data.size > 0
          ? saveAs(out.data, out.filename)
          : console.log("error");
      });
  }

  getFileURL(
    id: any,
    defaultContext: string = KREDILINE_SERVER_URL
  ): Observable<any> {
    return this.http.get(
      `${defaultContext}api/backoffice/file/streamv2/${id}`,
      {
        responseType: "text",
      }
    );
  }

  downloadFileFromS3(fileId: number = null, useFileType = true) {
    this.downloadMandateReports(fileId, useFileType);
  }

  downloadMandateReports(fileId: number = null, useFileType = true) {
    this.getFileURL(fileId, KALEIDO_SERVER_API_URL).subscribe((url) => {
      this.downloadFromS3(url, useFileType);
    });
  }

  downloadFromS3(s3Url, useFileType: boolean = false) {
    let out = { data: null, filename: null };
    this.http
      .get(s3Url, {
        observe: "response",
        responseType: "blob" as "json",
      })
      .subscribe((res: any) => {
        const type = res.headers.get("content-type");
        out.data = new Blob([res.body], { type: `application/${type}` });
        out.filename = this.extractFileName(s3Url);
        let temp: any;
        if (useFileType) {
          temp = `${out.filename}.${type}`;
        } else {
          temp = out.filename;
        }
        out.data.size > 0 ? saveAs(out.data, temp) : console.log("error");
      });
  }

  uploadKalImage1(files: any): Observable<File[]> {
    const fileUpload = new FormData();
    const fileCount = files.length;
    if (fileCount > 0) {
      for (let i = 0; i < fileCount; i++) {
        fileUpload.append("file" + i, files[i], files[i].name);
      }
    } else {
      fileUpload.append("files", "");
    }
    return this.http.post<File[]>(
      `${KALEIDO_SERVER_API_URL}api/backoffice/customer/files/upload`,
      fileUpload
    );
  }

  getFileURLByIdAndType(id: number, fileType: string): Observable<any> {
    return this.http.get(
      `${KREDILINE_SERVER_URL}api/backoffice/file/streamv2/${id}?fileType=${fileType}`,
      { responseType: "text" }
    );
  }

  downloadFileV2(id: string, jobName: string = "download") {
    this.getFileURL(id).subscribe((url) => {
      this.downloadS3Blob(url._body).subscribe((res: any) => {
        const fileBlob = new Blob([res._body], {
          type: res.headers.get("content-type"),
        });
        const fileName = `${jobName}-${id}.${res.headers.get("content-type")}`;
        saveAs(fileBlob, fileName);
      });
    });
  }
  downloadS3Blob(s3Url) {
    return this.http.get(s3Url, {
      observe: "body",
      responseType: "blob" as "json",
    });
  }
  extractFileName(s3Url: string = "") {
    const url = new URL(s3Url);
    const path = url.pathname;
    const pathParts = path.split("/");
    return decodeURIComponent(pathParts[pathParts.length - 1]);
  }
  fetchS3Json(s3Url: string = ""): Observable<any> {
    return this.http.get(s3Url);
  }

  getFileContent(s3Url: string): Observable<string> {
    return new Observable((observer) => {
      this.http
        .get(s3Url, {
          observe: "response",
          responseType: "blob" as "json",
        })
        .subscribe(
          (res: any) => {
            const type = res.headers.get("content-type");
            const blob = new Blob([res.body], { type: `application/${type}` });
            const blobUrl = URL.createObjectURL(blob);
            observer.next(blobUrl);
            observer.complete();
          },
          (error) => {
            console.error("Error fetching file:", error);
            observer.error(error);
          }
        );
    });
  }

  downloadBlobFromS3(s3Url: string): Promise<Blob> {
    return this.http
      .get(s3Url, { observe: "response", responseType: "blob" as "json" })
      .toPromise()
      .then((res: any) => new Blob([res.body], { type: res.headers.get("content-type") }));
  }

   blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }



  viewPdf(
    document: any,
    documentName: string,
    hideActions: boolean = false
  ): Observable<any> {
    const dialogRef = this.dialog.open(DocumentViewerComponent, {
      width: "70vw",
      height: "80vh",
      panelClass: "pdf-viewer-dialog",
      data: {
        pdfData: document,
        fileName: documentName,
        hideActions: hideActions,
      },
    });

    return dialogRef.afterClosed();
  }

  extractFileExtension(fileName: string): string {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "pdf";
  }

}
