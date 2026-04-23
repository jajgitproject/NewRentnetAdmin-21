// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogSendSmsWhatsappMailComponent } from './form-dialog.component';

describe('FormDialogSendSmsWhatsappMailComponent', () => {
  let component: FormDialogSendSmsWhatsappMailComponent;
  let fixture: ComponentFixture<FormDialogSendSmsWhatsappMailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogSendSmsWhatsappMailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogSendSmsWhatsappMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

