// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { CarAndDriverSearchFormDialogComponent } from './form-dialog.component';

describe('CarAndDriverSearchFormDialogComponent', () => {
  let component: CarAndDriverSearchFormDialogComponent;
  let fixture: ComponentFixture<CarAndDriverSearchFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [CarAndDriverSearchFormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAndDriverSearchFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

