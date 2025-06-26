import { Component, Input } from "@angular/core";

@Component({
  selector: 'jhi-item-count',
  templateUrl: './pagination-item-count.component.html'
})
export class PaginationItemCountComponent {
  @Input() page: any;
  @Input() itemsPerPage: any;
  @Input() total: any;

  constructor() {}

}
