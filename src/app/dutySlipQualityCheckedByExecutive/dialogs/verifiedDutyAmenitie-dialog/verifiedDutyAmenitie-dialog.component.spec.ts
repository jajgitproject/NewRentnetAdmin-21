// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { VerifiedDutyAmenitieDialogComponent } from './verifiedDutyAmenitie-dialog.component';


describe('FormDialogComponent', () => {
  let component: VerifiedDutyAmenitieDialogComponent;
  let fixture: ComponentFixture<VerifiedDutyAmenitieDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      
      providers: matDialogTestProviders(),declarations: [VerifiedDutyAmenitieDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedDutyAmenitieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

