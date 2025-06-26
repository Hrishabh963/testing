import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanKycDocumentAccoridonComponent } from './loan-kyc-document-accoridon.component';

describe('LoanKycDocumentAccoridonComponent', () => {
  let component: LoanKycDocumentAccoridonComponent;
  let fixture: ComponentFixture<LoanKycDocumentAccoridonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanKycDocumentAccoridonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanKycDocumentAccoridonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
