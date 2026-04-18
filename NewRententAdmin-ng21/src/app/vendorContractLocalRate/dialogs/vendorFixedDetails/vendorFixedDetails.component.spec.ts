// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { VendorLocalFixedDetails } from './vendorFixedDetails.component';

describe('VendorLocalFixedDetails', () => {
  let component: VendorLocalFixedDetails;
  let fixture: ComponentFixture<VendorLocalFixedDetails>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [VendorLocalFixedDetails]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorLocalFixedDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

