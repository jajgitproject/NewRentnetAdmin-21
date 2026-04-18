// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormDialogComponent } from "./form-dialog.component";

describe("FormDialogComponent", () => {
  let component: FormDialogComponent;
  let fixture: ComponentFixture<FormDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    
      providers: matDialogTestProviders(),declarations: [FormDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

