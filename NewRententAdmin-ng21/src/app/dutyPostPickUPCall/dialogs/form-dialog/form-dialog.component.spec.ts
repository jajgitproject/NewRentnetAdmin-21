// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { DutyPostFormDialogComponent } from './form-dialog.component';

describe('DutyPostFormDialogComponent', () => {
  let component: DutyPostFormDialogComponent;
  let fixture: ComponentFixture<DutyPostFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [DutyPostFormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DutyPostFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

