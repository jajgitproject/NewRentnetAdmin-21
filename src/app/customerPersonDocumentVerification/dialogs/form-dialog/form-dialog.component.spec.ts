// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogVerificationComponentHolder } from './form-dialog.component';

describe('FormDialogVerificationComponentHolder', () => {
  let component: FormDialogVerificationComponentHolder;
  let fixture: ComponentFixture<FormDialogVerificationComponentHolder>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogVerificationComponentHolder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogVerificationComponentHolder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

