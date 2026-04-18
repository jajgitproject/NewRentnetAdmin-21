// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReservationStopDropDown } from '../../reservationStopDropDown.model';
import { CustomerPersonDetailsDropDown } from '../../customerPersonDetailsDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdditionalKmsDetails } from '../../additionalKmsDetails.model';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { AdditionalKmsDetailsService } from '../../additionalKmsDetails.service';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class AdditionalDialogComponent 
{
  saveDisabled:boolean=true;
  advanceTableForm: FormGroup;
  DutySlipID: any;
  tableRecord: any;
  action: string;
  dialogTitle: string;
  advanceTable: AdditionalKmsDetails;
  type: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean;

  constructor(
  public dialogRef: MatDialogRef<AdditionalDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public additionalKmsDetailsService :AdditionalKmsDetailsService ,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    if (data?.record && data.record.length > 0) {
      this.tableRecord = data.record[0];
    } else {
      this.tableRecord = {}; // fallback to empty object
     // console.warn('No record data passed to dialog. Using empty object.');
    }

    this.DutySlipID = data?.dutySlipID;
    this.type = data?.type;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
      this.advanceTableForm = this.createContactForm();
      if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
      {
        this.isSaveAllowed = true;
      } 
      else
      {
        this.isSaveAllowed = false;
      }
  }
  
  ngOnInit()
  {
    if(this.type === 'additionalKMs' )
      {
        this.advanceTableForm.controls['additionalMinutes'].disable();
      }
    if(this.type === 'additionalMinutes' )
      {
        this.advanceTableForm.controls['additionalKMs'].disable();
      }
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySlipID: [this.tableRecord?.dutySlipID || ''],
      additionalKMs: [this.tableRecord?.additionalKMs || ''],
      additionalMinutes: [this.tableRecord?.additionalMinutes || '']
    });
  }

  submit() 
  {
   
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
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
    this.saveDisabled = false;
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID})
    this.additionalKmsDetailsService.updateAdditional(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.showNotification(
          'snackbar-success',
          'Additionals Updated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
        this.dialogRef.close(true);
       
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
    }
  )
  }
  
}


