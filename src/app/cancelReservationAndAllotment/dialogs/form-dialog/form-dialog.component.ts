// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CancelReservationAndAllotment } from '../../cancelReservationAndAllotment.model';
import { CancelReservationAndAllotmentService } from '../../cancelReservationAndAllotment.service';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCRAComponent 
{
   buttonDisabled:boolean=false;
  status: any;
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CancelReservationAndAllotment;
  AllotmentID: any;
  AllotmentStatus: any;
  ReservationID: any;
  AllotmentType: any;
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogCRAComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CancelReservationAndAllotmentService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Cancel Reservation';       
          this.advanceTable = data.advanceTable;
          this.ImagePath=this.advanceTable.cancellationProof;
          this.advanceTableForm.patchValue({attachment:this.ImagePath});
        } else 
        {
          this.dialogTitle = 'Cancel Reservation';
          this.advanceTable = new CancelReservationAndAllotment({});
        }
          
        // Extract status robustly
        if(typeof data?.status === 'string') {
          this.status = data.status;
        } else if(data?.status && typeof data.status.status === 'string') {
          this.status = data.status.status;
        } else {
          this.status = '';
        }
        
        // Set button disabled state
        const normalizedStatus = (this.status || '').toString().trim().toLowerCase();
        this.buttonDisabled = normalizedStatus !== 'changes allow';
        
        
        this.advanceTableForm = this.createContactForm();
        this.AllotmentID=data.allotmentID;
        this.AllotmentStatus=data.allotmentStatus;
        this.ReservationID=data.reservationID;
         this.AllotmentType=data.allotmentType;
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
      allotmentID: [this.advanceTable.allotmentID],
      reservationID: [this.advanceTable.reservationID],
      dateOfCancellation: [this.advanceTable.dateOfCancellation],
      timeOfCancellation: [this.advanceTable.timeOfCancellation],
      cancellationByEmployeeID: [this.advanceTable.cancellationByEmployeeID],
      cancellationRemark: [this.advanceTable.cancellationRemark],
      allotmentStatus: [this.advanceTable.allotmentStatus],
      cancellationProof: [this.advanceTable.cancellationProof],
      isCancellationChargeable: [this.advanceTable.isCancellationChargeable],
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
      this.ImagePath="";
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
       this._generalService.sendUpdate('ReservationAllotmentCreate:ReservationAllotmentView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('ReservationAllotmentAll:ReservationAllotmentView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({allotmentID: this.AllotmentID || 0});
    this.advanceTableForm.patchValue({reservationID: this.ReservationID});
    this.advanceTableForm.patchValue({allotmentStatus:this.AllotmentStatus});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      
      this._generalService.sendUpdate('CancelReservationAndAllotmentUpdate:CancelReservationAndAllotmentView:Success');//To Send Updates 
      this.showNotification(
        'snackbar-success',
        'Cancel Reservation And Allotment...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
      this.dialogRef.close({isClose:false});
    },
    error =>
    {
     this._generalService.sendUpdate('CancelReservationAndAllotmentAll:CancelReservationAndAllotmentView:Failure');//To Send Updates  
     this.saveDisabled = true;
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
    this.saveDisabled = false;
    this.Put();   
  }
   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => 
   {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({cancellationProof:this.ImagePath})
   }
 /////////////////for Image Upload ends////////////////////////////
 
}


