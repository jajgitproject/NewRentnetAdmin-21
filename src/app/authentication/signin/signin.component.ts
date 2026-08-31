// @ts-nocheck

import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/service/auth.service';

import { MatDialog } from '@angular/material/dialog';

import { FormDialogComponent } from 'src/app/validateOTP/dialogs/form-dialog/form-dialog.component';

import { ExpirationDateService } from 'src/app/shared/expirationDate.service';
import { RuntimeConfigService } from 'src/app/core/service/runtime-config.service';
import { isLoginOtpRequired } from 'src/app/core/service/login-otp-policy';
// Login geolocation disabled (EmployeeLoginSessionSettings.RequireLoginLocation = false on API).

@Component({

  standalone: false,

  selector: 'app-signin',

  templateUrl: './signin.component.html',

  styleUrls: ['./signin.component.scss']

})

export class SigninComponent implements OnInit {

  otpDialogOpen = false;

  loginForm: FormGroup;

  email: string = '';

  password: string = '';

  rememberMe: boolean = false;

  formSubmitted = false;

  isSubmitting = false;

  error: string | null = null;

  hide = true;

  langStoreValue: string;

  defaultFlag: string;

  expirationDate: any;

  daysLeft: number;

  showExpiryWarning: boolean = false;

  isPasswordDeactivated: boolean = false;
  errorMessageToBeShown: string = '';
  readonly passwordExpiredMessage =
    'Password has expired. Please contact administrator to reset your password.';

  constructor(

    private formBuilder: FormBuilder,

    private router: Router,

    private authService: AuthService,

    private dialog: MatDialog,
    private expirationDateService: ExpirationDateService,
    private runtimeConfig: RuntimeConfigService,
  ) {}



  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],

      password: ['', Validators.required]

    });



    const savedEmail = localStorage.getItem('email');

    const savedPassword = localStorage.getItem('password');



    if (savedEmail && savedPassword) {

      this.email = savedEmail;

      this.password = savedPassword;

      this.loginForm.patchValue({ email: this.email });

      this.loginForm.patchValue({ password: this.password });
    }
  }


  onNumberInput(event: any) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    this.loginForm.get('email')?.setValue(input, { emitEvent: false });
  }

  toggleCheckbox(checked: boolean) {

    this.rememberMe = checked;

  }



  get f() {

    return this.loginForm.controls;

  }

  private extractLoginErrorMessage(error: any): string {
    if (!error) {
      return 'Login failed. Please try again.';
    }
    if (typeof error === 'string') {
      return error;
    }
    const status = error?.status;
    if (status === 0) {
      return `Cannot reach the API at ${this.runtimeConfig.getBaseUrl()}. Check that the API site is running and try again.`;
    }
    if (status === 500) {
      const body = error?.error;
      if (body && typeof body === 'object') {
        const message = body.Message ?? body.message;
        if (message) {
          return String(message);
        }
      }
      return 'Server error during login. Please contact the administrator.';
    }
    const body = error?.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      const message = body.Message ?? body.message ?? body.LoginDetails ?? body.loginDetails;
      if (message) {
        return String(message);
      }
    }
    return error?.message || 'Login failed. Please try again.';
  }



  onSubmit() {

    this.formSubmitted = true;

    this.error = null;

    this.errorMessageToBeShown = '';

    if (this.loginForm.invalid) {

      this.error = 'Username and Password not valid !';

      this.errorMessageToBeShown = this.error;

      return;
    }

    this.isSubmitting = true;
    if (this.rememberMe) {
      localStorage.setItem('email', this.f.email.value);
      localStorage.setItem('password', this.f.password.value);
    }

    this.authService
      .login(this.f.email.value, this.f.password.value, 'Employee')
      .subscribe(
        (res) => {
          console.log('Login response:', res);
          const message = res?.Message ?? res?.message;
          const loginDetails = res?.LoginDetails ?? res?.loginDetails;
          this.error = message || (typeof loginDetails === 'string' ? loginDetails : null) || null;
          if (res?.Status === 'Failure' && message)
          {
            this.errorMessageToBeShown = message;
          }
          if (message === 'Invalid User: User not found')
          {
            this.errorMessageToBeShown = 'User not found';
          }
          else if (message === 'Invalid User: Please enter correct username and password')
          {
            this.errorMessageToBeShown = 'Please enter correct username and password';
          }
          else if (message === this.passwordExpiredMessage)
          {
            this.errorMessageToBeShown = this.passwordExpiredMessage;
            this.authService.clearLocalSession();
          }
          else if (typeof loginDetails === 'string' && loginDetails.includes('Invalid User: User not found'))
          {
            this.errorMessageToBeShown = 'Unauthorized';
          }
          else if (this.error && !this.errorMessageToBeShown)
          {
            this.errorMessageToBeShown = this.error;
          }

          if (res) {
            const token = res.Token ?? res.token;
            const employee = res.employee ?? res.Employee;

            if (token && employee) {
              localStorage.setItem('expirationDate', employee.PasswordExpirationDate ?? employee.passwordExpirationDate);
              localStorage.setItem('roleID', employee.RoleID ?? employee.roleID);
              localStorage.setItem('role', employee.Role ?? employee.role);
              localStorage.setItem('canCreateReservation', employee.CanCreateReservation ?? employee.canCreateReservation);
              localStorage.setItem('canThisRoleCreateBackDateBooking', employee.CanThisRoleCreateBackDateBooking ?? employee.canThisRoleCreateBackDateBooking);
              localStorage.setItem(
                'canThisRoleCreateBillOnClosingScreen',
                String(employee.CanThisRoleCreateBillOnClosingScreen ?? employee.canThisRoleCreateBillOnClosingScreen ?? false)
              );
              localStorage.setItem(
                'canThisRoleViewBillOnClosingScreen',
                String(employee.CanThisRoleViewBillOnClosingScreen ?? employee.canThisRoleViewBillOnClosingScreen ?? false)
              );
              localStorage.setItem(
                'canThisRoleDoGoodForBillingOnClosingScreen',
                String(employee.CanThisRoleDoGoodForBillingOnClosingScreen ?? employee.canThisRoleDoGoodForBillingOnClosingScreen ?? false)
              );
              localStorage.setItem(
                'canThisRoleViewDummyInvoice',
                String(employee.CanThisRoleViewDummyInvoice ?? employee.canThisRoleViewDummyInvoice ?? false)
              );
              localStorage.setItem(
                'isThisAKeyAccountManagerRole',
                String(employee.IsThisAKeyAccountManagerRole ?? employee.isThisAKeyAccountManagerRole ?? false)
              );
              localStorage.setItem(
                'canActAsContractTariffAuditor',
                String(employee.CanActAsContractTariffAuditor ?? employee.canActAsContractTariffAuditor ?? false)
              );
              localStorage.setItem(
                'canActAsContractTariffVerifier',
                String(employee.CanActAsContractTariffVerifier ?? employee.canActAsContractTariffVerifier ?? false)
              );
              localStorage.setItem(
                'canResetOdometer',
                String(employee.CanResetOdometer ?? employee.canResetOdometer ?? false)
              );
              localStorage.setItem(
                'canDeleteFuelEntry',
                String(employee.CanDeleteFuelEntry ?? employee.canDeleteFuelEntry ?? false)
              );
              localStorage.setItem(
                'canFindFuelEntry',
                String(employee.CanFindFuelEntry ?? employee.canFindFuelEntry ?? false)
              );
              localStorage.setItem(
                'canCloseIncident',
                String(employee.CanCloseIncident ?? employee.canCloseIncident ?? false)
              );
              localStorage.setItem(
                'canEditDSAfterGoodForBilling',
                (employee.CanEditDSAfterGoodForBilling === true ||
                  employee.canEditDSAfterGoodForBilling === true ||
                  employee.CanEditDSAfterGoodForBilling === 'true' ||
                  employee.canEditDSAfterGoodForBilling === 'true' ||
                  employee.CanEditDSAfterGoodForBilling === 1 ||
                  employee.canEditDSAfterGoodForBilling === 1)
                  ? 'true'
                  : 'false'
              );
              localStorage.setItem(
                'canCancelBackDateAllotment',
                String(
                  employee.CanCancelBackDateAllotment ??
                    employee.canCancelBackDateAllotment ??
                    false
                )
              );
              this.calculateDaysLeft();
            }
          } else {
            this.error = 'Invalid Login';
          }
          this.isSubmitting = false;
        },
        (error) => {
          this.error = this.extractLoginErrorMessage(error);
          this.errorMessageToBeShown = this.error;
          this.isSubmitting = false;
        }
      );
  }



  private getPasswordExpirationDate(employee: any): Date | null {
    const pwdExp =
      employee?.PasswordExpirationDate ?? employee?.passwordExpirationDate;

    if (!pwdExp) {
      return null;
    }

    const expirationDate = new Date(pwdExp);
    return isNaN(expirationDate.getTime()) ? null : expirationDate;
  }

  private getCalendarDaysUntilExpiration(expirationDate: Date): number {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfExpiration = new Date(expirationDate);
    startOfExpiration.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(
      (startOfExpiration.getTime() - startOfToday.getTime()) / msPerDay
    );
  }

  private isPasswordExpired(employee: any): boolean {
    const expirationDate = this.getPasswordExpirationDate(employee);
    if (!expirationDate) {
      return false;
    }

    return this.getCalendarDaysUntilExpiration(expirationDate) < 0;
  }

  private blockExpiredPasswordLogin(): void {
    this.isPasswordDeactivated = false;
    this.authService.clearLocalSession();
    this.error = this.passwordExpiredMessage;
    this.errorMessageToBeShown = this.passwordExpiredMessage;
  }

  public calculateDaysLeft(): void {

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const employee = currentUser.employee ?? currentUser.Employee;

    if (this.isPasswordExpired(employee)) {
      this.blockExpiredPasswordLogin();
      return;
    }

    const mobile = String(employee?.Mobile ?? employee?.mobile ?? '');

    const typedLogin = String(this.f.email?.value ?? '');

    const bypassOTPForAll =
      employee?.BypassOTPForAll === true || employee?.bypassOTPForAll === true;

    const canBypassOTP =
      employee?.CanBypassOTP === true || employee?.canBypassOTP === true;

    if (!isLoginOtpRequired(bypassOTPForAll, canBypassOTP, mobile, typedLogin)) {

      this.isPasswordDeactivated = false;

      this.authService.markOtpVerified();

      const role = localStorage.getItem('role');

      if (role === 'Admin') {

        this.router.navigate(['/controlPanelDesign']);

      } else {

        this.router.navigate(['/welcome/welcome']);

      }

      return;

    }

    const expirationDate = this.getPasswordExpirationDate(employee);

    if (!expirationDate) {

      this.isPasswordDeactivated = false;

      this.openValidateOTPModal();

      return;

    }

    this.daysLeft = this.getCalendarDaysUntilExpiration(expirationDate);

    this.isPasswordDeactivated = false;

    this.openValidateOTPModal();

  }



  private deactivateAccount(): void {

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const employee = currentUser?.employee ?? currentUser?.Employee;

    if (!currentUser || !employee) {

      console.error('currentUser or currentUser.employee is null or undefined');

      this.error = 'Error: Unable to retrieve current user data';

      this.errorMessageToBeShown = this.error;

      return;

    }



    const payload = {

      EmployeeEntityPasswordID:

        employee.EmployeeEntityID ?? employee.employeeEntityID,

      UserType: 'Employee'

    };



    this.authService.deactivateAccount(payload).subscribe(

      res => {

        this.router.navigate(['/authentication/signin']);

      },

      error => {

        console.error('Error deactivating account', error);

        this.error = error.message ? error.message : 'Error deactivating account';

        this.errorMessageToBeShown = this.error;

      }

    );

  }



  openValidateOTPModal() {

    this.otpDialogOpen = true;

    const dialogRef = this.dialog.open(FormDialogComponent, {

      width: '300px',

      disableClose: true,

      data: { action: 'validate' }

    });



    dialogRef.afterClosed().subscribe((result) => {

      this.otpDialogOpen = false;

      // Dialog dismissed without completing OTP: drop the half-authenticated session.
      if (!result?.verified && !this.authService.isOtpVerified()) {
        this.authService.clearLocalSession();
      }

    });

  }
}
