// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { NoDataDialogComponent } from './no-data-dialog.component';

describe('NoDataDialogComponent', () => {
  let component: NoDataDialogComponent;
  let fixture: ComponentFixture<NoDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [ NoDataDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

