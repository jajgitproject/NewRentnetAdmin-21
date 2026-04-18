// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PasswordService } from '../../password.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
// import { Password } from '../../password.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import {Password } from '../../password.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Password;
  private subscriptionName: Subscription;
  MessageArray: string[] = [];
  messageReceived: string;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PasswordService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Password';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Password';
          this.advanceTable = new Password({});
          // this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup {
    return this.fb.group({
      currentpassword: [this.advanceTable.currentpassword, [Validators.required, this.noWhitespaceValidator]],
      newPassword: [
        this.advanceTable.newPassword, 
        [
          Validators.required, 
          Validators.minLength(8), 
          Validators.maxLength(12), 
          this.noWhitespaceValidator, 
          this.consecutiveCharsValidator,
          this.passwordStrengthValidator
        ]
      ],
      confirmNewPassword: [
        this.advanceTable.confirmNewPassword, 
        [
          Validators.required, 
          Validators.minLength(8), 
          Validators.maxLength(12), 
          this.noWhitespaceValidator, 
          this.consecutiveCharsValidator,
          this.passwordStrengthValidator
        ]
      ]
    });
  }

 noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  consecutiveCharsValidator(control: FormControl) {
    const value = control.value || '';
    const hasConsecutiveChars = /(.)\1\1/.test(value);
    return hasConsecutiveChars ? { 'consecutiveChars': true } : null;
  }

  passwordStrengthValidator(control: FormControl) {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return isValid ? null : { 'passwordStrength': true };
  }

  submit() 
  {
   
  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }

  public password(): void {
    this.updatePassword();
  }

  updatePassword() {
    if (this.advanceTableForm.valid) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      let requestPayload = this.advanceTableForm.value;
      requestPayload.EmployeeEntityPasswordID = currentUser.employee.EmployeeEntityPasswordID;
      requestPayload.EmployeeEntityID = currentUser.employee.EmployeeEntityID;
      requestPayload.UserType = "Employee";
      console.log(requestPayload);
      this.advanceTableService.password(requestPayload).subscribe(
        response => {
          // Handle success response
          console.log('Password updated successfully', response);
          this.dialogRef.close(true);
          this.router.navigate(['/authentication/signin']);
        },
        error => {
          // Handle error response
          console.error('Error updating password', error);
        }
      );
    }
  }
}


