// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordResetService } from 'src/app/PasswordReset/PasswordReset.service';
import { GeneralService } from 'src/app/general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchValidator } from 'src/app/PasswordReset/form-match-validators';
import { Subscription } from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  showOTP = false;
  submitted = false;
  public isOTPSent: boolean = false;
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public _passwordResetService: PasswordResetService,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.SubscribeUpdateService();
    debugger
    if (this.isOTPSent) {
      this.loginForm = this.formBuilder.group({
        // email: [
        //   '',
        //   [Validators.required, Validators.email, Validators.minLength(5)]
        // ],
        email: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        otp: ['', Validators.required],
        newPassword: [
          '',
          Validators.required,
          matchValidator('confirmNewPassword', true)
        ],
        confirmNewPassword: [
          '',
          Validators.required,
          matchValidator('newPassword')
        ]
      });
    } else {
      this.loginForm = this.formBuilder.group({
        // email: [
        //   '',
        //   [Validators.required, Validators.email, Validators.minLength(5)]
        // ],
       email: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        otp: [''],
        newPassword: [''],
        confirmNewPassword: ['']
      });
    }
  }
  get f() {
    return this.loginForm.controls;
  }
  forgotPasswordOTP() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this._passwordResetService
        .forgotPasswordOTP(this.loginForm.getRawValue())
        .subscribe(
          (response) => {
            console.log(response)
            if (response.message.includes('Success')) {
              this._generalService.sendUpdate('SendOTP:SendOTPView:Success');
              this.isOTPSent = true;
              this.ngOnInit();
              this.loginForm.controls['otp'].setValidators([
                Validators.required
              ]);
              this.loginForm.controls['newPassword'].setValidators([
                Validators.required,
                matchValidator('confirmNewPassword', true)
              ]);
              this.loginForm.controls['confirmNewPassword'].setValidators([
                Validators.required,
                matchValidator('newPassword')
              ]);
            } else if (response.message.includes('Invalid')) {
              this._generalService.sendUpdate('SendOTP:SendOTPView:Invalid');
              this.SubscribeUpdateService();
            } else if (response.message.includes('Failure')) {
              this._generalService.sendUpdate('SendOTP:SendOTPView:Failure');
              this.SubscribeUpdateService();
            }
          },
          (error) => {
            this._generalService.sendUpdate('SendOTP:SendOTPView:Failure'); //To Send Updates
          }
        );
    }
  }

  
  forgotPassword() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this._passwordResetService
        .forgotPassword(this.loginForm.getRawValue())
        .subscribe(
          (response) => {
            if (response.message.includes('Success')) {
              this.router.navigate(['/authentication/signin']);
              this._generalService.sendUpdate(
                'PasswordReset:PasswordResetView:Success'
              );
            } else if (response.message.includes('UserName')) {
              this._generalService.sendUpdate(
                'PasswordReset:PasswordResetView:UserName'
              );
              this.SubscribeUpdateService();
            } else if (response.message.includes('Invalid')) {
              this._generalService.sendUpdate(
                'PasswordReset:PasswordResetView:Invalid'
              );
              this.SubscribeUpdateService();
            } else if (response.message.includes('Failure')) {
              this._generalService.sendUpdate(
                'PasswordReset:PasswordResetView:Failure'
              );
              this.SubscribeUpdateService();
            }
          },
          (error) => {
            this._generalService.sendUpdate(
              'PasswordReset:PasswordResetView:Failure'
            ); //To Send Updates
          }
        );
      console.log();
    }
  }

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService
      .getUpdate()
      .subscribe((message) => {
        
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray = this.messageReceived.split(':');
        if (this.MessageArray.length == 3) {
          if (this.MessageArray[0] == 'SendOTP') {
            if (this.MessageArray[1] == 'SendOTPView') {
              if (this.MessageArray[2] == 'Success') {
                //this.refresh();
                this.showNotification(
                  'snackbar-success',
                  'OTP sent on your registered email',
                  'bottom',
                  'center'
                );
              } else if (this.MessageArray[2] == 'Invalid') {
                //this.refresh();
                this.showNotification(
                  'snackbar-danger',
                  'Email not registered',
                  'bottom',
                  'center'
                );
              } else {
                this.showNotification(
                  'snackbar-danger',
                  'SMS could not be sent',
                  'bottom',
                  'center'
                );
              }
            }
          }
          
          if (this.MessageArray[0] == 'PasswordReset') {
            if (this.MessageArray[1] == 'PasswordResetView') {
              if (this.MessageArray[2] == 'Success') {
                //this.refresh();
                this.showNotification(
                  'snackbar-success',
                  'Password Changed Successfully',
                  'bottom',
                  'center'
                );
              } else if (this.MessageArray[2] == 'UserName') {
                this.showNotification(
                  'snackbar-danger',
                  'Password could not be derivative of Username',
                  'bottom',
                  'center'
                );
              } else if (this.MessageArray[2] == 'Invalid') {
                //this.refresh();
                this.showNotification(
                  'snackbar-danger',
                  'OTP Mismatch Error',
                  'bottom',
                  'center'
                );
              } else {
                this.showNotification(
                  'snackbar-danger',
                  'Password could not be changed',
                  'bottom',
                  'center'
                );
              }
            }
          }
        }
      });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 5000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  // onSubmit() {
  //   this.submitted = true;
  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   } else {
  //     this.router.navigate(['/dashboard/main']);
  //   }
  // }
  submit() {
    // emppty stuff
  }
  onNumberInput(event: any) {
  const input = event.target.value.replace(/[^0-9]/g, ''); // keep only digits
  this.loginForm.get('email')?.setValue(input, { emitEvent: false });
}

}


