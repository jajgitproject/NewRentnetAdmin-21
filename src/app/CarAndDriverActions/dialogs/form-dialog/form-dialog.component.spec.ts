// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { CarAndDriverActionsFormDialogComponent } from './form-dialog.component';

describe('CarAndDriverActionsFormDialogComponent', () => {
  let component: CarAndDriverActionsFormDialogComponent;
  let fixture: ComponentFixture<CarAndDriverActionsFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [CarAndDriverActionsFormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAndDriverActionsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

