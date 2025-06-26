import { Component, Input,  OnInit } from '@angular/core';
import { SECTION_INFORMATION } from 'src/app/constants/ui-config';
import { getProperty } from 'src/app/utils/app.utils';

@Component({
  selector: 'app-error-notifications-item',
  templateUrl: './error-notifications-item.component.html',
  styleUrls: ['./error-notifications-item.component.scss']
})
export class ErrorNotificationsItemComponent implements OnInit {

  @Input() key: string = "";
  @Input() sectionErrors: any = {};

  title: string = "";

  constructor() { }

  ngOnInit(): void {
    this.title = SECTION_INFORMATION[this.key].title;
  }

  getDependentErrorTitle(key): string {
    const title: string = getProperty(SECTION_INFORMATION[key], "title", "");
    return title;
  }

}
