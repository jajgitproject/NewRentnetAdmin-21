// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogDropOffByExecutiveComponent } from './form-dialog.component';

describe('FormDialogDropOffByExecutiveComponent', () => {
  let component: FormDialogDropOffByExecutiveComponent;
  let fixture: ComponentFixture<FormDialogDropOffByExecutiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogDropOffByExecutiveComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogDropOffByExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

