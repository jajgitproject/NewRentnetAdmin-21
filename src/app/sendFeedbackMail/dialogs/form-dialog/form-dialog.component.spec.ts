// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogSendFeedbackMailComponent } from './form-dialog.component';

describe('FormDialogSendFeedbackMailComponent', () => {
  let component: FormDialogSendFeedbackMailComponent;
  let fixture: ComponentFixture<FormDialogSendFeedbackMailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogSendFeedbackMailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogSendFeedbackMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

