import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  private readonly matListnerSubject = new Subject();
  constructor() {
    super();
    this.matListnerSubject.subscribe(() => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.itemsPerPageLabel = '';
    this.nextPageLabel = 'Next';
    this.previousPageLabel = 'Previous';
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `Showing ${startIndex + 1} to ${endIndex} of ${length} entr${
      length > 1 ? 'ies' : 'y'
    }`;
  };
}
