import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { UserSearchDTO } from "../../services/user-access-management/user-access-management.constants";

@Component({
  selector: "app-uam-search-filter",
  templateUrl: "./uam-search-filter.component.html",
  styleUrls: ["./uam-search-filter.component.scss"],
})
export class UamSearchFilterComponent implements OnInit {
  @Input() roleTypeOptions: Record<string, string>[] = [];

  userSearchDto: UserSearchDTO = {
    roles: [],
    status: [],
  };
  readonly statusType: any[] = [
    {
      label: "Active",
      value: "ACTIVE",
    },
    {
      label: "Locked",
      value: "LOCKED",
    },
    {
      label: "Suspended",
      value: "SUSPENDED",
    },
    {
      label: "Inactive",
      value: "INACTIVE",
    },
    {
      label: "Deleted",
      value: "DELETED",
    },
  ];

  enableSearch = false;
  inputForm: FormControl;

  @Output() emitSearchValues: EventEmitter<UserSearchDTO> = new EventEmitter();

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.inputForm = this.fb.control("");
    this.inputForm.valueChanges.subscribe((value: string) => {
      this.userSearchDto.nameOrEmailOrExternalId = value ?? "";
    });
  }

  toggleSearch(): void {
    this.enableSearch = !this.enableSearch;
    if (
      !this.enableSearch
    ) {
      this.emitSearchValues.emit({
        ...this.userSearchDto,
        nameOrEmailOrExternalId: "",
      });
    }
    this.userSearchDto.nameOrEmailOrExternalId = "";
  }

  onMenuClose(): void {
    this.emitSearchValues.emit(this.userSearchDto);
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.emitSearchValues.emit(this.userSearchDto);
    }
  }
}
