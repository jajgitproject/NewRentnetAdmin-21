// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ContactDeleteComponent } from './delete.component';

describe('ContactDeleteComponent', () => {
  let component: ContactDeleteComponent;
  let fixture: ComponentFixture<ContactDeleteComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        
      providers: matDialogTestProviders(),declarations: [ContactDeleteComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
