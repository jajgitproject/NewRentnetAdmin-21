// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { FetchDataFromGPSComponent } from './fetch-data-from-gps.component';

describe('FetchDataFromGPSComponent', () => {
  let component: FetchDataFromGPSComponent;
  let fixture: ComponentFixture<FetchDataFromGPSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [ FetchDataFromGPSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchDataFromGPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

