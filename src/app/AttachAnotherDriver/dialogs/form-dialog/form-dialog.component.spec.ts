// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { AttachAnotherDriverFormDialogComponent } from './form-dialog.component';

describe('AttachAnotherDriverFormDialogComponent', () => {
  let component: AttachAnotherDriverFormDialogComponent;
  let fixture: ComponentFixture<AttachAnotherDriverFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [AttachAnotherDriverFormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachAnotherDriverFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

