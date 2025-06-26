import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { get } from 'lodash';

@Injectable()
export class FileService {
  constructor(private readonly http: HttpClient) {}

  downloanFromS3(s3Url: any, jobDetails: any) {
    const out = {
      data: {},
      filename:
        jobDetails.jobName + '_' + new Date().getDate() + '_' + jobDetails.id,
    };
    this.http.get(s3Url).subscribe((res: any) => {
      const type = res.headers.get('content-type');
      const file = res._body;
      out.data = new Blob([file]);
      if (!out.filename.includes('.')) {
        out.filename = out.filename + '.' + type;
      }
      out.filename = out.filename + '.' + type;
      if (get(out, 'data.size', 0) > 0) {
        saveAs(get(out.data, out.filename));
      }
    });
  }
}
