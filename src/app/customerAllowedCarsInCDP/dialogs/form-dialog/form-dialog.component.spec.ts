// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogComponentCustomerAllowedCarsInCDP } from './form-dialog.component';

describe('FormDialogComponentCustomerAllowedCarsInCDP', () => {
  let component: FormDialogComponentCustomerAllowedCarsInCDP;
  let fixture: ComponentFixture<FormDialogComponentCustomerAllowedCarsInCDP>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogComponentCustomerAllowedCarsInCDP]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponentCustomerAllowedCarsInCDP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

