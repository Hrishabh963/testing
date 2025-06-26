import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { find, pull } from "lodash";
import { ReviewStateManagementService } from "../../services/review-state-management.service";

@Component({
  selector: "jhi-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  @ViewChild("tagInput") tagInputRef: ElementRef;
  @Output() searchEvent = new EventEmitter<{
    searchBy: string[];
    executeSearch: boolean;
  }>();
  @Input() placeholder: string = "Search by Application ID/Mobile/Group ID";
  tags: string[] = [];
  form: FormGroup;

  constructor(
      private readonly fb: FormBuilder,
      private readonly reviewStateService: ReviewStateManagementService
    ) {}

  ngOnInit() {
    this.form = this.fb.group({
      tag: [undefined],
    });
    this.tags = this.reviewStateService.$searchTags;
  }

  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.form.controls["tag"].value;
    if (event.code === "Backspace" && !inputValue) {
      this.removeTag();
    } else if (event.code === "Comma" || event.code === "Space") {
        this.addTag(inputValue);
        this.form.controls["tag"].setValue("");
      
    }
  }

  addTag(tag: string): void {
    
    
    if (tag?.length > 0) {
      if (tag.endsWith(',') || tag.endsWith(' ')) {
      tag = tag.slice(0, -1);
      }
      if (!find(this.tags, tag)) {
        this.tags.push(tag);
      }
    }
this.reviewStateService.$searchTags = this.tags;
  }

  removeTag(tag?: string): void {
    if (tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
    this.onSubmit(false);
  }

  removeAllTag(): void {
    this.tags = [];
    this.onSubmit(true);
  }

  onSubmit(executeSearch: boolean): void {
    let value = this.form.controls["tag"].value;
    this.addTag(value);
    this.form.controls["tag"].setValue("");
    this.searchEvent.emit({ searchBy: this.tags, executeSearch });
  }
}
