// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { CustomerAlertMessageTypeService } from '../../customerAlertMessageType.service';
import { GeneralService } from '../../../general/general.service';
import { of } from 'rxjs';

import { DeleteDialogComponent } from './delete.component';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: [...matDialogTestProviders(), { provide: CustomerAlertMessageTypeService, useValue: { delete: () => of({}) } }, { provide: GeneralService, useValue: { sendUpdate: () => {}, getUserID: () => 0, BaseURL: '' } }],declarations: [DeleteDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

