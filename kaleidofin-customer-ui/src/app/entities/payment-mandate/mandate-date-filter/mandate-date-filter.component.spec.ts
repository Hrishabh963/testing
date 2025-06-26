import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MandateDateFilterComponent } from "./mandate-date-filter.component";

describe("MandateDateFilterComponent", () => {
  let component: MandateDateFilterComponent;
  let fixture: ComponentFixture<MandateDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MandateDateFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
