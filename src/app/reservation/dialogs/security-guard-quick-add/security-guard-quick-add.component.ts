// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerPersonService } from '../../../customerPerson/customerPerson.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-security-guard-quick-add',
  templateUrl: './security-guard-quick-add.component.html',
  styleUrls: ['./security-guard-quick-add.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class SecurityGuardQuickAddComponent {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private customerPersonService: CustomerPersonService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SecurityGuardQuickAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customerGroupID: number; customerID: number; reservationID?: number }
  ) {
    this.form = this.fb.group({
      customerPersonName: ['', Validators.required],
      primaryEmail: ['', [Validators.required, Validators.email]],
      primaryMobile: ['', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const raw = this.form.getRawValue();
    const mobileDigits = String(raw.primaryMobile || '').replace(/\D/g, '');
    const payload = {
      customerPersonName: raw.customerPersonName.trim(),
      primaryEmail: raw.primaryEmail.trim(),
      billingEmail: raw.primaryEmail.trim(),
      primaryMobile: mobileDigits ? `91-${mobileDigits}` : null,
      customerGroupID: this.data.customerGroupID,
      customerID: this.data.customerID,
      salutationID: 6,
      gender: 'Male',
      importance: 'General',
      isPassenger: true,
      isSecurityGuard: true,
      isBooker: false,
      isAdmin: false,
      isContactPerson: false,
      maskMobileNumber: false,
      sendSMSWhatsApp: true,
      sendEmail: true,
      reservationConfirmationWhatsApp: true,
      isPostPickUpCallAllowed: true,
      isFeedbackEmailAllowed: false,
      allowLoginToCDP: false,
      allowLoginToCustomerApp: false,
      loyalGuest: false,
      isDefaultForIntegrationRequest: false,
      activationStatus: true,
      skipWelcomeEmail: true,
      reservationID: this.data.reservationID > 0 ? this.data.reservationID : null,
    };

    this.customerPersonService.add(payload).subscribe({
      next: (response) => {
        this.saving = false;
        if (response?.status === 'Failure') {
          this.snackBar.open(response.message || 'Failed to create security guard', 'Close', { duration: 5000 });
          return;
        }
        const customerPersonID = response?.customerPersonID ?? response?.CustomerPersonID;
        const customerPersonName =
          response?.customerPersonName ?? response?.CustomerPersonName ?? payload.customerPersonName;
        if (!customerPersonID) {
          this.snackBar.open('Security guard saved but ID was not returned', 'Close', { duration: 5000 });
          return;
        }
        this.dialogRef.close({
          customerPersonID,
          customerPersonName,
          primaryEmail: payload.primaryEmail,
          primaryMobile: payload.primaryMobile,
        });
      },
      error: (err) => {
        this.saving = false;
        const msg =
          err?.error?.message
          ?? (typeof err?.error === 'string' ? err.error : null)
          ?? 'Failed to create security guard';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      },
    });
  }
}
