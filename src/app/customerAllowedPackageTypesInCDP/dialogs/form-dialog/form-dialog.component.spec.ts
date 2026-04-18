// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogComponentCustomerAllowedPackageTypesInCDP } from './form-dialog.component';

describe('FormDialogComponentCustomerAllowedPackageTypesInCDP', () => {
  let component: FormDialogComponentCustomerAllowedPackageTypesInCDP;
  let fixture: ComponentFixture<FormDialogComponentCustomerAllowedPackageTypesInCDP>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogComponentCustomerAllowedPackageTypesInCDP]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponentCustomerAllowedPackageTypesInCDP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

