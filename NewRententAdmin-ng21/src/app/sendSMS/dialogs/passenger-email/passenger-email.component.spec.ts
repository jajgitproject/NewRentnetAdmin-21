// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';

import { PassengerEmailComponent } from './passenger-email.component';

describe('PassengerEmailComponent', () => {
  let component: PassengerEmailComponent;
  let fixture: ComponentFixture<PassengerEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [ PassengerEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

