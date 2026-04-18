// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ChangePasswordService } from '../../changePassword.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ChangePasswordModel } from '../../changePassword.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmPasswordValidator } from '../confirm-password.validator';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ChangePasswordModel;
  public showPassword: boolean;
  public showNewPassword:boolean;
  public showConfirmNewPassword: boolean;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ChangePasswordService,
  private fb: FormBuilder,
  public _generalService:GeneralService,
  private snackBar: MatSnackBar)
  {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Change Password';       
      this.advanceTable = data.advanceTable;
    } 
    else 
    {
      this.dialogTitle = 'Change Password';
      this.advanceTable = new ChangePasswordModel({});
    }
    this.advanceTableForm = this.createContactForm();
  }
  
  markAsTouched(controlName: string) 
  {
    this.advanceTableForm.controls[controlName].markAsTouched();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      newPassword: [this.advanceTable.newPassword,[
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(12), 
        this.noWhitespaceValidator, 
        this.consecutiveCharsValidator,
        this.passwordStrengthValidator
      ]],
      confirmNewPassword: [this.advanceTable.confirmNewPassword,[
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(12), 
        this.noWhitespaceValidator, 
        this.consecutiveCharsValidator,
        this.passwordStrengthValidator
      ]],
      oldPassword: [this.advanceTable.oldPassword],
    },
    {
      validator: ConfirmPasswordValidator("newPassword", "confirmNewPassword")
    }
    );
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

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    //console.log(this.advanceTableForm.value);
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void
  {
    this.advanceTableService.resetPassword(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      //this._generalService.sendUpdate('ChangePasswordCreate:ChangePasswordView:Success');//To Send Updates  
      this.showNotification(
        'snackbar-success',
        'Password Updated...!!!',
        'bottom',
        'center'
      );       
    },
    error =>
    {
      //this._generalService.sendUpdate('ChangePasswordAll:ChangePasswordView:Failure');//To Send Updates  
      this.showNotification(
        'snackbar-danger',
        'Old Password did not matched...!!!',
        'bottom',
        'center'
      ); 
    })
  }

}


