// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { LumpsumRateDetailsDialogComponent } from './lumpsumRateDetails.component';

describe('LumpsumRateDetailsDialogComponent', () => {
  let component: LumpsumRateDetailsDialogComponent;
  let fixture: ComponentFixture<LumpsumRateDetailsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [LumpsumRateDetailsDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LumpsumRateDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

