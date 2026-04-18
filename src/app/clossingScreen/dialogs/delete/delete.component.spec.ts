// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { ClossingScreenService } from '../../clossingScreen.service';
import { GeneralService } from '../../../general/general.service';
import { of } from 'rxjs';

import { RSPDeleteDialogComponent } from './delete.component';

describe('RSPDeleteDialogComponent', () => {
  let component: RSPDeleteDialogComponent;
  let fixture: ComponentFixture<RSPDeleteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: [...matDialogTestProviders(), { provide: ClossingScreenService, useValue: { delete: () => of({}) } }, { provide: GeneralService, useValue: { sendUpdate: () => {}, getUserID: () => 0, BaseURL: '' } }],declarations: [RSPDeleteDialogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RSPDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

