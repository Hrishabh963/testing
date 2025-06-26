import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-uam-roles-checkbox-group",
  templateUrl: "./uam-roles-checkbox-group.component.html",
  styleUrls: ["./uam-roles-checkbox-group.component.scss"],
})
export class UamRolesCheckboxGroupComponent implements OnInit {
  
  @Input() selectedRoles: string[] = [];
  @Input() roleTypeOptions: Record<string, string>[] = [];
  @Output() emitSelectionChange = new EventEmitter<string[]>();
  

  ngOnInit(): void {
    this.selectionList = [...this.selectedRoles];
  }


  selectionList: string[];
  
  onSelectionChange(): void {
    this.emitSelectionChange.emit(this.selectionList)
  }

}
