import { Injectable } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { ITEMS_PER_PAGE } from "src/app/shared";

@Injectable()
export class PaginationConfig {
  constructor(private readonly config: MatPaginator) {
    this.config.pageSize = ITEMS_PER_PAGE;
  }
}
