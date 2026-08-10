// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeModeOfPaymentDetailsComponent } from './changeModeOfPaymentDetails.component';

describe('ChangeModeOfPaymentDetailsComponent', () => {
  let component: ChangeModeOfPaymentDetailsComponent;
  let fixture: ComponentFixture<ChangeModeOfPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeModeOfPaymentDetailsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeModeOfPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
