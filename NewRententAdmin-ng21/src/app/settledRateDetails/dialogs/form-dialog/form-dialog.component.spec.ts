// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogSRDComponent } from './form-dialog.component';

describe('FormDialogSRDComponent', () => {
  let component: FormDialogSRDComponent;
  let fixture: ComponentFixture<FormDialogSRDComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogSRDComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogSRDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

