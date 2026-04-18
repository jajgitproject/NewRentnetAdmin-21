// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { PasswordReset } from './PasswordReset.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PasswordResetService } from './PasswordReset.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchValidator } from './form-match-validators';
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-PasswordReset',
  templateUrl: './PasswordReset.component.html',
  styleUrls: ['./PasswordReset.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PasswordResetComponent {
  public passwordReset: PasswordReset;
  advanceTableForm: FormGroup;
  dialogTitle: string;
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;

  ngOnInit() {
    this.SubscribeUpdateService();
    this.passwordReset = new PasswordReset({});
    this.passwordReset.userID = this.data.userID;
    this.passwordReset.userPasswordHistoryID = this.data.userPasswordHistoryID;
    this.passwordReset.email = this.data.email;
    this.advanceTableForm = this.createContactForm();
    this.advanceTableForm.controls['email'].disable();
  }

  constructor(
    public dialogRef: MatDialogRef<PasswordResetComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userID: number;
      userPasswordHistoryID: number;
      email: string;
      password: string;
    },
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public _passwordResetService: PasswordResetService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Set the defaults
    this.dialogTitle = 'Reset Password';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        userID: [this.passwordReset.userID],
        userPasswordHistoryID: [this.passwordReset.userPasswordHistoryID],
        email: [this.passwordReset.email],
        currentPassword: [this.passwordReset.currentPassword],
        newPassword: [
          this.passwordReset.newPassword,
          matchValidator('confirmNewPassword', true)
        ],
        confirmNewPassword: [
          this.passwordReset.confirmNewPassword,
          matchValidator('newPassword')
        ]
      }

      // {
      //   validators: [
      //     CustomValidators.match('newPassword', 'confirmNewPassword')
      //   ]
      // }
    );
  }

  public resetPassword(): void {
    this.Post();
  }

  public Post(): void {
    this._passwordResetService
      .resetPassword(this.advanceTableForm.getRawValue())
      .subscribe(
        (response) => {
          if (response.message.includes('Success')) {
            this._generalService.sendUpdate(
              'PasswordReset:PasswordResetView:Success'
            );
            this.dialogRef.close();
            this.router.navigate(['/authentication/signin']);
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
  }

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService
      .getUpdate()
      .subscribe((message) => {
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray = this.messageReceived.split(':');
        if (this.MessageArray.length == 3) {
          if (this.MessageArray[0] == 'PasswordReset') {
            if (this.MessageArray[1] == 'PasswordResetView') {
              if (this.MessageArray[2] == 'Success') {
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
                this.showNotification(
                  'snackbar-danger',
                  'Current password did not match',
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
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  submit() {
    // emppty stuff
  }
}


