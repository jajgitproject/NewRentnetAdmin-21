// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogComponentCustomerDesignation } from './form-dialog.component';

describe('FormDialogComponentCustomerDesignation', () => {
  let component: FormDialogComponentCustomerDesignation;
  let fixture: ComponentFixture<FormDialogComponentCustomerDesignation>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogComponentCustomerDesignation]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponentCustomerDesignation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

