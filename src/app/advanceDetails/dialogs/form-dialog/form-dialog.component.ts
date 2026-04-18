// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AdvanceDetailsService } from '../../advanceDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AdvanceDetails } from '../../advanceDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';


@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogADComponent 
{
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AdvanceDetails;
  reservationID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogADComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: AdvanceDetailsService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Advance Details';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.dateOfAdvanceReceived).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(startDate);
        } else 
        {
          this.dialogTitle = 'Advance Details';
          this.advanceTable = new AdvanceDetails({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   this.buttonDisabled=true;
        // }
               if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationAdvanceDetailsID: [this.advanceTable.reservationAdvanceDetailsID],
      reservationID: [this.advanceTable.reservationID],
      advanceAmount: [this.advanceTable.advanceAmount],
      dateOfAdvanceReceived: [this.advanceTable.dateOfAdvanceReceived],
      modeOfPayment: [this.advanceTable.modeOfPayment],
      referenceNumber: [this.advanceTable.referenceNumber],
      advanceRemark: [this.advanceTable.advanceRemark],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}


  submit() {}
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
          
          this.showNotification(
            'snackbar-success',
            'Advance Details Created...!!!',
            'bottom',
            'center'
          );
          this.dialogRef.close(response);
          this.saveDisabled=true;
      },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed.....!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
      }
    )
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
    this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
          
          this.showNotification(
            'snackbar-success',
            'Advance Details Updated...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled=true;
          this.dialogRef.close(response);
      },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed.....!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
      }
    )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled=false;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }

  //start date
  onBlurUpdateDate(value: string): void {
      value= this._generalService.resetDateiflessthan12(value);
    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('dateOfAdvanceReceived')?.setValue(formattedDate);    
    } else {
      this.advanceTableForm.get('dateOfAdvanceReceived')?.setErrors({ invalidDate: true });
    }
  }
  
  
  onBlurUpdateDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.dateOfAdvanceReceived=formattedDate
      }
      else{
        this.advanceTableForm.get('dateOfAdvanceReceived')?.setValue(formattedDate);
      }
      
    } else {
      this.advanceTableForm.get('dateOfAdvanceReceived')?.setErrors({ invalidDate: true });
    }
  }
}



