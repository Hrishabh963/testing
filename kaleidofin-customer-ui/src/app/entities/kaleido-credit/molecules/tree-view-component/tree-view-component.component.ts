import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tree-view-component',
  templateUrl: './tree-view-component.component.html',
  styleUrls: ['./tree-view-component.component.scss']
})
export class TreeViewComponentComponent {

  @Input() list: Array<string> = [];
  @Input() title: string = "";
  @Input() optionalToolTip: string = null;
  @Input() showErrorTooltip: boolean = false;


  isEmpty(content: string): boolean {
    if(!content?.length){
      return true;
    }
    if(content?.length) {
      return content.toUpperCase() === "N/A";
    } 
    return false;
  }

}
