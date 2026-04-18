// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { ReservationAlertService } from '../../reservationAlert.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ReservationAlert } from '../../reservationAlert.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { ReservationAlertDropDown } from '../../reservationAlertDropDown.model';

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
  advanceTable: ReservationAlert;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public ReservationAlertList?: ReservationAlertDropDown[] = [];

  image: any;
  fileUploadEl: any;
  CustomerID: any;
  CustomerName: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ReservationAlertService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Reservation Alert for';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Reservation Alert for';
          this.advanceTable = new ReservationAlert({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerID=this.data.CustomerID;
        this.CustomerName=this.data.CustomerName;
  }
  public ngOnInit(): void
  {

    
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationAlertID: [this.advanceTable.reservationAlertID],
      customerID: [this.advanceTable.customerID],
      reservationAlert: [this.advanceTable.reservationAlert],
      startDate: [this.advanceTable.startDate],
      endDate: [this.advanceTable.endDate],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerID:this.CustomerID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('ReservationAlertCreate:ReservationAlertView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('ReservationAlertAll:ReservationAlertView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.advanceTable.customerID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('ReservationAlertUpdate:ReservationAlertView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('ReservationAlertAll:ReservationAlertView:Failure');//To Send Updates  
    }
  )
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
  

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }


}


