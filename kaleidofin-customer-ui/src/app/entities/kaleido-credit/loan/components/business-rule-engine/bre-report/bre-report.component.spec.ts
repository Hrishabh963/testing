import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreReportComponent } from './bre-report.component';

describe('BreReportComponent', () => {
  let component: BreReportComponent;
  let fixture: ComponentFixture<BreReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
