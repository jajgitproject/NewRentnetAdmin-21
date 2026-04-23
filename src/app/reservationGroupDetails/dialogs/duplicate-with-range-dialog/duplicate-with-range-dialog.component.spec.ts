// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { DuplicateWithRangeDialogComponent } from './duplicate-with-range-dialog.component';

describe('DuplicateWithRangeDialogComponent', () => {
  let component: DuplicateWithRangeDialogComponent;
  let fixture: ComponentFixture<DuplicateWithRangeDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [DuplicateWithRangeDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateWithRangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

