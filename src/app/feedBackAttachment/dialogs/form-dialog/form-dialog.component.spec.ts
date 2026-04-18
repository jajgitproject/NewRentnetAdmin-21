// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { tripFeedBackAttachmentFormDialogComponent } from './form-dialog.component';

describe('tripFeedBackAttachmentFormDialogComponent', () => {
  let component: tripFeedBackAttachmentFormDialogComponent;
  let fixture: ComponentFixture<tripFeedBackAttachmentFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [tripFeedBackAttachmentFormDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(tripFeedBackAttachmentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

