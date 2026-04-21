// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { ReservationClosingDetailsService } from '../../reservationClosingDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ReservationClosingDetails } from '../../reservationClosingDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-locationDetails-dialog',
  templateUrl: './locationDetails-dialog.component.html',
  styleUrls: ['./locationDetails-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class LocationDetailsDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: any;
  
  
  reservationID: any;
  constructor(
  public dialogRef: MatDialogRef<LocationDetailsDialogComponent>, 
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ReservationClosingDetailsService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.advanceTable = data.advanceTable;
        this.dialogTitle='Location Details';

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
  


  submit() 
  {
    // emppty stuff
  }
  reset(){
    this.advanceTableForm.reset();
  }


  // {
  //   const dialogRef = this.dialog.open(FormDialogComponent, 
  //     {
  //       width:'60%',
  //       data: 
  //         {
  //           advanceTable: this.advanceTableForm.value,
  //           // action: 'add'
            
  //         }
  //     });
  // }

  // customerShort()
  // {
  //   const dialogRef = this.dialog.open(FormDialogCustomerShortComponent, 
  //     {
  //       data: 
  //         {
  //           advanceTable: this.customerDetailData,
  //           action: 'add',
  //           customerID: this.customerID,
  //           customerGroupID: this.customerGroupID,
            
  //         }
  //     });
  // }

  // onNoClick(): void 
  // {
  //   this.dialogRef.close();
  // }

  // personShort()
  // {
  //   this.customer=this.advanceTable.customer.split('-')[0];
  //   this.customerDetailData={customerID: this.advanceTable.customerID, customerName: this.customer, customerGroupID: this.advanceTable.customerGroupID, customerGroup: this.advanceTable.customerGroup};
  //   const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
  //     {
  //       data: 
  //         {
  //           advanceTable: this.customerDetailData,
  //           action: 'add',
  //           forCP:'CP',
  //           CustomerGroupID:this.customerDetailData.customerGroupID,
  //           CustomerGroupName:this.customerDetailData.customerGroup
  //         }
  //     });
  //     dialogRef.afterClosed().subscribe(res => {
  //       // received data from dialog-component
  //       //console.log(res.data);
  //       this.InitBooker();
  //       this.InitPassenger();
  //     })
  // }

  // onCustomerGroupInputChange(event: any) {
  //   if(event.target.value.length === 0) {
  //     this.advanceTableForm.controls['primaryBooker'].setValue('');
  //     this.advanceTableForm.controls['primaryPassenger'].setValue('');
  //   } 
  // }

  // onCustomerInputChange(event: any) {
  //   if(event.target.value.length === 0) {
  //     this.advanceTableForm.controls['customer'].setValue('');
      
  //   } 
  // }

  // public Put(): void
  // {
  //   this.advanceTableService.update(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //   response => 
  //   {
  //       this.dialogRef.close();
  //      this._generalService.sendUpdate('ReservationClosingDetailsUpdate:ReservationClosingDetailsView:Success');//To Send Updates  
       
  //   },
  //   error =>
  //   {
  //    this._generalService.sendUpdate('ReservationClosingDetailsAll:ReservationClosingDetailsView:Failure');//To Send Updates  
  //   }
  // )
  // }
  // public confirmAdd(): void 
  // {
  //         this.Put();
  // }
  
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


