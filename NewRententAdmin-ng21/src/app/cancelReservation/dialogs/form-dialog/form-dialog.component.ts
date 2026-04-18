// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CancelReservation } from '../../cancelReservation.model';
import { CancelReservationService } from '../../cancelReservation.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCRComponent 
{
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CancelReservation;
  reservationID: any;
  dataSource: any;
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogCRComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CancelReservationService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Cancel Reservation';       
          this.advanceTable = data.advanceTable;
         
        } else 
        {
          this.dialogTitle = 'Reason Of Deattachment';
          this.advanceTable = new CancelReservation({});
         
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        
        // Extract status robustly
        if (typeof data?.status === 'string') {
          this.status = data.status;
        } else if (data?.status && typeof data.status.status === 'string') {
          this.status = data.status.status;
        } else {
          this.status = '';
        }
        
        // Set button disabled state
        const normalizedStatus = (this.status || '').toString().trim().toLowerCase();
        this.buttonDisabled = normalizedStatus !== 'changes allow';
        // console.log('CancelReservation dialog - normalizedStatus:', normalizedStatus);
        // console.log('CancelReservation dialog - reservationID:', this.reservationID);
        // console.log('CancelReservation dialog - raw data.status:', data?.status);
        // console.log('CancelReservation dialog - final status:', this.status);
        // console.log('CancelReservation dialog - buttonDisabled:', this.buttonDisabled);
     
  }
  formControl = new FormControl('', 
  [
    Validators.required

  ]);
  ngOnInit() {
   
    this.loadData();
    
  }
  public loadData() 
  {
     this.advanceTableService.getTableData(this.reservationID).subscribe
   (
     data =>   
     {
       this.dataSource = data;
       console.log(this.dataSource)
       this.advanceTableForm.patchValue({cancellationReason:this.dataSource.cancellationReason});
      
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }
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
      reservationID: [this.advanceTable?.reservationID],
      cancellationReason: [this.advanceTable?.cancellationReason],
     

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
  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CancelReservationCreate:CancelReservationView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('CancelReservationAll:CancelReservationView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({reservationID: this.reservationID});
    
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close({isClose:false});
      this._generalService.sendUpdate('CancelReservationUpdate:CancelReservationView:Success');//To Send Updates 
      this.showNotification(
        'snackbar-success',
        'CancelReservation Updated...!!!',
        'bottom',
        'center'
      );
      
    },
    error =>
    {
     this._generalService.sendUpdate('CancelReservationAll:CancelReservationView:Failure');//To Send Updates  
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
  public confirmAdd(): void 
  {
    this.Put();
  }
   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => 
   {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({cancelAllotmentSign:this.ImagePath})
   }
 /////////////////for Image Upload ends////////////////////////////
 
}


