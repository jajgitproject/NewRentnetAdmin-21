// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ReservationSourceService } from '../../reservationSource.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ReservationSource } from '../../reservationSource.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

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
  isloading = false;
  advanceTable: ReservationSource;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ReservationSourceService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Reservation Source';       
          this.dialogTitle ='Reservation Source';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Create Reservation Source';
          this.dialogTitle = 'Reservation Source';
          this.advanceTable = new ReservationSource({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationSourceID: [this.advanceTable.reservationSourceID],
      reservationSource: [this.advanceTable.reservationSource,[this.noWhitespaceValidator]],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

reset(){
  this.advanceTableForm.reset();
}

  submit() 
  {

  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
 public Post(): void {
    this.isloading = true;  // Start spinner before request
    
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isloading = false;  // Stop spinner on success
          this.dialogRef.close();
          this._generalService.sendUpdate('ReservationSourceCreate:ReservationSourceView:Success');
        },
        error => {
          this.isloading = false;  // Stop spinner on error
          this._generalService.sendUpdate('ReservationSourceAll:ReservationSourceView:Failure');
        }
      );
  }

  public Put(): void {
    this.isloading = true;  // Start spinner before request

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isloading = false;  // Stop spinner on success
          this.dialogRef.close();
          this._generalService.sendUpdate('ReservationSourceUpdate:ReservationSourceView:Success');
        },
        error => {
          this.isloading = false;  // Stop spinner on error
          this._generalService.sendUpdate('ReservationSourceAll:ReservationSourceView:Failure');
        }
      );
  }

  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
}


