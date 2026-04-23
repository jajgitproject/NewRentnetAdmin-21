// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { BillingInstructionsDetailsDialogComponent } from './billing-instruction-dialog.component';

describe('BillingInstructionsDetailsDialogComponent', () => {
  let component: BillingInstructionsDetailsDialogComponent;
  let fixture: ComponentFixture<BillingInstructionsDetailsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [BillingInstructionsDetailsDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingInstructionsDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

