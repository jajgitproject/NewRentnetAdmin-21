// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogComponentIL } from './form-dialog.component';

describe('FormDialogComponentIL', () => {
  let component: FormDialogComponentIL;
  let fixture: ComponentFixture<FormDialogComponentIL>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogComponentIL]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponentIL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

