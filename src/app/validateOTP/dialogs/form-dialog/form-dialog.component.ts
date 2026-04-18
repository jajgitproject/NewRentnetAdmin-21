// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ValidateOTPService } from '../../validateOTP.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ValidateOTP } from '../../validateOTP.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscription } from 'rxjs';
import moment from 'moment';
import { takeWhile } from 'rxjs/operators';
import { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent implements OnInit, OnDestroy
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ValidateOTP;
  validateOtp: any;
  otpErrorMessage: string = '';
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;
  currentUser: any;
  otpExpired:boolean = false;
  public timerSubscription: Subscription;
  expiryDate: Date;
  timerInterval: any;
  remainingTime: string = '10:00';
  role: string;
  otpValidationTime: number;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ValidateOTPService,
    private fb: FormBuilder,
    private navigateRoute: Router,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService,
  private cdr: ChangeDetectorRef)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Validate OTP';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Validate OTP';
          this.advanceTable = new ValidateOTP({});
          // this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
    
      enterOTP: [this.advanceTable.enterOTP],
     
    });
  }

  ngOnInit()
  {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const employee = currentUser?.employee ?? currentUser?.Employee;
    this.validateOtp = employee?.OTP ?? employee?.otp ?? null;
    this.otpValidationTime = Date.now();
    this.expiryDate = new Date();
    this.expiryDate.setMinutes(this.expiryDate.getMinutes() + 10);

    this.startTimer();
    this.updateRemainingTime();

  }

  ngOnDestroy()
  {
    if (this.timerSubscription)
    {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer() 
  {
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => !this.otpExpired)
    ).subscribe(() => {
      this.updateRemainingTime();
    });
  }

  updateRemainingTime() 
  {
    const now = new Date();
    const milliDiff = this.expiryDate.getTime() - now.getTime();

    if (milliDiff <= 0) 
    {
      this.otpExpired = true;
      this.remainingTime = '00:00';
      this.cdr.detectChanges();
      return;
    }

    const totalSeconds = Math.floor(milliDiff / 1000);
    const remSeconds = totalSeconds % 60;
    const remMinutes = Math.floor(totalSeconds / 60);

    this.remainingTime = `${this.pad(remMinutes)}:${this.pad(remSeconds)}`;
    this.cdr.detectChanges();
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
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

  public ResendOTP(): void 
  {
    //if (this.advanceTableForm.valid) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const employee = currentUser?.employee ?? currentUser?.Employee;
      let requestPayload = this.advanceTableForm.value;
      requestPayload.Email = employee?.Mobile ?? employee?.mobile;
      requestPayload.FirstName = employee?.FirstName ?? employee?.firstName;
      requestPayload.EmployeeEntityID =
        employee?.EmployeeEntityID ?? employee?.employeeEntityID;
      requestPayload.UserType = "Employee";
      console.log(requestPayload);
  
      this.advanceTableService.resendPassword(requestPayload).subscribe(
        response => {
          // Handle success response
          // Split the string in the message property using a colon
          let messageParts = response.message.split(":");
          this.validateOtp = messageParts[2];
          console.log(this.validateOtp);
          
          // Show success message
          this.showNotification(
            'snackbar-success',
            'Resent OTP successfully',
            'bottom',
            'center'
          );
           // Reset the timer
           this.otpExpired = false;
            this.otpValidationTime = Date.now();
            this.expiryDate = new Date();
            this.expiryDate.setMinutes(this.expiryDate.getMinutes() + 10); // Set expiry time to 1 minute from now
            if (this.timerSubscription) 
            {
              this.timerSubscription.unsubscribe();
            }
            this.startTimer();
            this.updateRemainingTime();
        },
        error => {
          // Handle error response
          console.error('Error updating password', error);
        }
      );
    //}
  }

  submit(){}

  verifyOTP()
  {
    this.role = localStorage.getItem('role');
    console.log(this.role)
    if (this.otpValidationTime == null) {
      this.otpValidationTime = Date.now();
    }
    const enteredOTP = this.advanceTableForm.get('enterOTP')?.value;
    if(this.validateOtp  === enteredOTP && !this.otpExpired)
    {
      this.dialogRef.close();
      // this.navigateRoute.navigate(['/welcome/welcome']);
      if (this.role === 'Admin') {
        this.navigateRoute.navigate(['/controlPanelDesign']);
      } else {
        this.navigateRoute.navigate(['/welcome/welcome']);
      }
    } 
    else
    {
      this.handleExpiredOTP();
      // this.otpExpired = true;
      // console.error('OTP not matched');
      // this.showNotification(
      //   'snackbar-danger',
      //   'OTP does not match',
      //   'bottom',
      //   'center'
      // );
      // this.navigateRoute.navigate(['/authentication/signin']);
    }
    
  }

  handleExpiredOTP() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.otpValidationTime) / 1000; 
    
    if (elapsedTime > 600) { 
      this.otpExpired = true;
      console.error('OTP expired');
      this.showNotification(
        'snackbar-danger',
        'OTP expired',
        'bottom',
        'center'
      );
      this.navigateRoute.navigate(['/authentication/signin']);
    } else {
      console.error('OTP not matched');
      this.showNotification(
        'snackbar-danger',
        'OTP does not match',
        'bottom',
        'center'
      );
    }
  }
  

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 5000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onClose(): void {
    this.dialogRef.close({ closed: true });
  }
}




