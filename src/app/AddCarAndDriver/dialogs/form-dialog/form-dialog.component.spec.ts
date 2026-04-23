// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { AddCarAndDriverFormDialogComponent } from './form-dialog.component';

describe('AddCarAndDriverFormDialogComponent', () => {
  let component: AddCarAndDriverFormDialogComponent;
  let fixture: ComponentFixture<AddCarAndDriverFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [AddCarAndDriverFormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCarAndDriverFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

