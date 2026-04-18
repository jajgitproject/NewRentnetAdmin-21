// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { ConfirmGenerateEInvoiceComponent } from './confirmGenerateEInvoice.component';

describe('DeleteComponent', () => {
  let component: ConfirmGenerateEInvoiceComponent;
  let fixture: ComponentFixture<ConfirmGenerateEInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [ConfirmGenerateEInvoiceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmGenerateEInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

