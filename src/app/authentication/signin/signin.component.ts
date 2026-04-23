// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from 'src/app/validateOTP/dialogs/form-dialog/form-dialog.component';
import { ExpirationDateService } from 'src/app/shared/expirationDate.service';

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
  errorMessageToBeShown:string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private expirationDateService:ExpirationDateService,
   
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      //email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
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
      //this.rememberMe=true;
      // this.checkPasswordStatus();
    }
    
  }
  onNumberInput(event: any) {
  const input = event.target.value.replace(/[^0-9]/g, ''); // keep only digits
  this.loginForm.get('email')?.setValue(input, { emitEvent: false });
}

  toggleCheckbox(checked: boolean) {
    this.rememberMe = checked;
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.formSubmitted = true;
    this.error = null;
    if (this.loginForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.isSubmitting = true;
      if (this.rememberMe) {
        //store email in local storage if Remember me is checked
        localStorage.setItem('email', this.f.email.value);
        localStorage.setItem('password', this.f.password.value);
      }
      this.authService
        .login(this.f.email.value, this.f.password.value, 'Employee')
        .subscribe(
          (res) => {
            this.error = res?.Message || null;
            if(res.Message === "Invalid User: User not found")
            {
              this.errorMessageToBeShown = "User not found";
            }
            else if(res.Message === "Invalid User: Please enter correct username and password")
            {
              this.errorMessageToBeShown = "Please enter correct username and password";
            }
            
            if (res) {
              const token = res.Token ?? res.token;
              const employee = res.employee ?? res.Employee;

              if (token && employee) {
                localStorage.setItem('expirationDate', employee.PasswordExpirationDate ?? employee.passwordExpirationDate);
                localStorage.setItem('roleID', employee.RoleID ?? employee.roleID);
                localStorage.setItem('role', employee.Role ?? employee.role);
                localStorage.setItem('canCreateReservation', employee.CanCreateReservation ?? employee.canCreateReservation);
                //this.expirationDateService.setExpirationDate(res.employee.PasswordExpirationDate);
                // Call the method to open ValidateOTP modal on successful login
                this.calculateDaysLeft();
              
              }
            } else {
              this.error = 'Invalid Login';
            }
            this.isSubmitting = false;
          },
          (error) => {
            this.error = error;
            this.isSubmitting = false;
          }
        );
    }
  }

  public calculateDaysLeft(): void {
    var currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const employee = currentUser.employee ?? currentUser.Employee;
    const pwdExp =
      employee?.PasswordExpirationDate ?? employee?.passwordExpirationDate;
    const currentDate = new Date();
    const expirationDate = new Date(pwdExp);
    const timeDiff = expirationDate.getTime() - currentDate.getTime();
 
    this.daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // if (this.daysLeft <= 10) {
    //   this.showExpiryWarning = true;
    // }
  
    // If the password is not reset within 75 days, deactivate the account
    if (this.daysLeft <= 0) {
      this.isPasswordDeactivated = true;
      this.deactivateAccount();
      return ;
    }
    else{
      this.isPasswordDeactivated = false;

      // TEST-ONLY OTP BYPASS — remove before production.
      // For the test account 9560342610 skip the OTP modal and route
      // directly to the post-OTP destination.
      const mobile = String(employee?.Mobile ?? employee?.mobile ?? '');
      const typedLogin = String(this.f.email?.value ?? '');
      const OTP_BYPASS_NUMBERS = ['9560342610'];
      if (OTP_BYPASS_NUMBERS.includes(mobile) || OTP_BYPASS_NUMBERS.includes(typedLogin)) {
        const role = localStorage.getItem('role');
        if (role === 'Admin') {
          this.router.navigate(['/controlPanelDesign']);
        } else {
          this.router.navigate(['/welcome/welcome']);
        }
        return;
      }

      this.openValidateOTPModal();
    }
  }

  private deactivateAccount(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const employee = currentUser?.employee ?? currentUser?.Employee;
    if (!currentUser || !employee) {
      console.error('currentUser or currentUser.employee is null or undefined');
      this.error = 'Error: Unable to retrieve current user data';
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

    dialogRef.afterClosed().subscribe(() => {
      this.otpDialogOpen = false;
    });
  }

  // checkPasswordStatus() {
  //   const passwordStatus = 'deactivated'; 
  //   if (passwordStatus === 'deactivated') {
  //     this.isPasswordDeactivated = true;
  //   }
  // }

}


