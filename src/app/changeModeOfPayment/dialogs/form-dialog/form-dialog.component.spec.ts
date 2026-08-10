// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeModeOfPaymentFormDialogComponent } from './form-dialog.component';

describe('ChangeModeOfPaymentFormDialogComponent', () => {
  let component: ChangeModeOfPaymentFormDialogComponent;
  let fixture: ComponentFixture<ChangeModeOfPaymentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeModeOfPaymentFormDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeModeOfPaymentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
