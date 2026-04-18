// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { PassengerMobileComponent } from './passenger-mobile.component';

describe('PassengerMobileComponent', () => {
  let component: PassengerMobileComponent;
  let fixture: ComponentFixture<PassengerMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [ PassengerMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

