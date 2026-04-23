// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { CustomerKeyAccountManagerService } from '../../customerKeyAccountManager.service';
import { GeneralService } from '../../../general/general.service';
import { of } from 'rxjs';

import { DeleteDialogComponent } from './delete.component';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: [...matDialogTestProviders(), { provide: CustomerKeyAccountManagerService, useValue: { delete: () => of({}) } }, { provide: GeneralService, useValue: { sendUpdate: () => {}, getUserID: () => 0, BaseURL: '' } }],declarations: [DeleteDialogComponent],
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

