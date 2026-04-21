// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DutyTrackingModel} from '../../dutyTracking.model';
import { DutyTrackingService } from '../../dutyTracking.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

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
  advanceTable: DutyTrackingModel;
  saveDisabled:boolean=true;
  dataSource: DutyTrackingModel | null;
  supplierID: any;
  address: any;
  email: any;
  phone: any;
  dutySlipID: any;
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dutyTrackingService: DutyTrackingService,
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
    // Set the defaults
    this.action = data.action;
    this.dutySlipID=data.dutySlipID;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Duty Tracking';       
      //this.advanceTable = data.advanceTable;
    }
    else 
    {
      this.dialogTitle = 'Duty Tracking';
      this.advanceTable = new DutyTrackingModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
    // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    // {
    //   this.isSaveAllowed = true;
    // } 
    // else
    // {
    //   this.isSaveAllowed = false;
    // }
             const status = (this.verifyDutyStatusAndCacellationStatus ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z\s]/g, ''); // 👈 ye line important hai

this.isSaveAllowed = status === 'changes allow';
  }
  

  ngOnInit():void{}
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyTrackingID: [this.advanceTable?.dutyTrackingID],
      dutySlipID: [this.dutySlipID],
      modeOfTracking: [this.advanceTable?.modeOfTracking],
      trackingDetails: [this.advanceTable?.trackingDetails],
      activationStatus: [this.advanceTable?.activationStatus],
    });
  }

  submit(){}

  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
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

  public Post(): void
  {
    this.dutyTrackingService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this.dialogRef.close(response);
        this.showNotification(
          'snackbar-success',
          'Pass To Supplier Created...!!!',
          'bottom',
          'center'
        );
      this.saveDisabled = true; 
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true; 
    }
    )
  }

  public Put(): void
  {
    this.dutyTrackingService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this.showNotification(
        'snackbar-success',
        'Pass To Supplier Updated...!!!',
        'bottom',
        'center'
      );     
      this.saveDisabled = true; 
    },
    error =>
    {
     this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
     this.saveDisabled = true; 
    }
    )
  }

  public confirmAdd(): void 
  {
    this.saveDisabled = false;
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


