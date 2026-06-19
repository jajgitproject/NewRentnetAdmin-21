// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FormDialogComponent } from './mopDetails.component';

describe('FormDialogComponent', () => {
  let component: FormDialogComponent;
  let fixture: ComponentFixture<FormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [FormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

