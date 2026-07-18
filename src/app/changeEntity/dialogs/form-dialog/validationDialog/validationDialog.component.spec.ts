// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { MessageBoxFormDialogComponent } from './form-dialog.component';

describe('MessageBoxFormDialogComponent', () => {
  let component: MessageBoxFormDialogComponent;
  let fixture: ComponentFixture<MessageBoxFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [MessageBoxFormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBoxFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

