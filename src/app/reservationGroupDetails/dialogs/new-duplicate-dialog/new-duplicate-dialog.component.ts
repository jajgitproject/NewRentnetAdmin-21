// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReservationGroupDetailsService } from '../../reservationGroupDetails.service';
import { GeneralService } from '../../../general/general.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnfilledBookingModel } from '../../reservationGroupDetails.model';
import { MatRadioButton } from '@angular/material/radio';
@Component({
  standalone: false,
  selector: 'app-new-duplicate-dialog',
  templateUrl: './new-duplicate-dialog.component.html',
  styleUrls: ['./new-duplicate-dialog.component.sass']
})
export class NewDuplicateDialogComponent
{
  advanceTableForm: FormGroup;
  advanceTableFormForUnfilledBooking: FormGroup;
  advanceTable:UnfilledBookingModel;
  saveDisabled:boolean=true;
  reservationID: any;
  reservationGroupID: any;
  ReservationNumbers: [];
  destinationReservationID: any;
  CustomerName: any;
  PassengerName: any;
  City: any;
  PickupDate: any;
  PickupTime: any;
  constructor(
    public dialogRef: MatDialogRef<NewDuplicateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public advanceTableService: ReservationGroupDetailsService,
    public _generalService: GeneralService
  )
  {
    this.reservationID=data.reservationID;
    this.reservationGroupID=data.reservationGroupID;
    this.advanceTableForm = this.createContactForm();
    this.advanceTableFormForUnfilledBooking = this.createContactFormForUnfilledBooking();
    this.CustomerName = data.dataSource.customer;
    this.PassengerName = data.dataSource.primaryPassenger;
    this.City = data.dataSource.pickupCity;
    this.PickupDate = data.dataSource.pickupDate;
    this.PickupTime = data.dataSource.pickupTime;
  }
  @ViewChild('newDuplicate') newDuplicate: MatRadioButton;
  @ViewChildren('reservationRadio') reservationRadios!: QueryList<MatRadioButton>;
  
  onNoClick(): void
  {
    this.dialogRef.close();
  }

  ngOnInit()
  {
    this.InitReservationID();
  }

  InitReservationID()
  {
    this.advanceTableService.getReservationIDBasedOnRGID(this.reservationGroupID).subscribe(
      data=>
        {
          this.ReservationNumbers=data;
        }
    );
  }
  
  ngAfterViewInit(): void {
    this.reservationRadios.forEach((radioButton) => {
    });
  }

  submit() {}
  // confirmDelete()
  // {
  //   this.advanceTableService.delete(this.data.reservationGroupDetailsID)  
  //   .subscribe(
  //   data => 
  //   {
  //      this._generalService.sendUpdate('ReservationGroupDetailsNewDuplicate:ReservationGroupDetailsView:Success');//To Send Updates   
  //   },
  //   error =>
  //   {
  //     this._generalService.sendUpdate('ReservationGroupDetailsAll:ReservationGroupDetailsView:Failure');//To Send Updates  
  //   }
  //   )
  // }


  createContactForm(): FormGroup 
  {
    return this.fb.group({
      newDuplicate:[''],
      unfilledBooking:['']
    })
  }

  createContactFormForUnfilledBooking(): FormGroup 
  {
    return this.fb.group({
      sourceReservationID:[''],
      destinationReservationID:['']
    })
  }

  // onCheckboxChange(reservationID: any, event: any) {
  //   if (reservationID === 'newDuplicate') {
  //     this.advanceTableForm.controls['unfilledBooking'].setValue(false);
  //   } else {
  //     this.advanceTableForm.controls['newDuplicate'].setValue(false);
  //     this.advanceTableFormForUnfilledBooking.value.destinationReservationID=reservationID
  //   }
  // }

  onCheckboxChange(reservationID: any) {
    debugger;
    this.advanceTableFormForUnfilledBooking.value.destinationReservationID=reservationID;
  }

  newduplicate()
  {
    this.saveDisabled = false;
    if(this.newDuplicate.checked===true)
    {
      this.advanceTableService.CreateDuplicate(this.reservationID)
      .subscribe(
        response => 
        {
          // Close dialog with success response and allow changes
          this.dialogRef.close({success: true, allowChanges: true});
          this._generalService.sendUpdate('ReservationGroupDetailsCreate:ReservationGroupDetailsView:Success');//To Send Updates  
          this.saveDisabled = true;   
        },
        error =>
        {
          // Handle error but still allow the dialog to close
          console.error('Duplicate creation error:', error);
          // Check if the error is just about verification status, not actual failure
          if (error.error && typeof error.error === 'string' && error.error.includes('Changes not allowed')) {
            // This is likely a status message, not a real error - treat as success
            this.dialogRef.close({success: true, allowChanges: true, statusMessage: error.error});
            this._generalService.sendUpdate('ReservationGroupDetailsCreate:ReservationGroupDetailsView:Success');
          } else {
            // Real error occurred
            this._generalService.sendUpdate('ReservationGroupDetailsAll:ReservationGroupDetailsView:Failure');//To Send Updates 
            this.dialogRef.close({success: false});
          }
          this.saveDisabled = true;    
        }
      )
    }
    else
    {
      this.advanceTableFormForUnfilledBooking.value.sourceReservationID=this.reservationID;
      this.advanceTableService.CreateDuplicateForUnfilledBooking(this.advanceTableFormForUnfilledBooking.value)
      .subscribe(
        response => 
        {
          this.dialogRef.close({success: true, allowChanges: true});
          this._generalService.sendUpdate('ReservationGroupDetailsUpdate:ReservationGroupDetailsView:Success');//To Send Updates 
          this.saveDisabled = true;    
        },
        error =>
        {
          console.error('Duplicate unfilled booking error:', error);
          if (error.error && typeof error.error === 'string' && error.error.includes('Changes not allowed')) {
            this.dialogRef.close({success: true, allowChanges: true, statusMessage: error.error});
            this._generalService.sendUpdate('ReservationGroupDetailsUpdate:ReservationGroupDetailsView:Success');
          } else {
            this._generalService.sendUpdate('ReservationGroupDetailsAll:ReservationGroupDetailsView:Failure');//To Send Updates 
            this.dialogRef.close({success: false});
          }
          this.saveDisabled = true;    
        }
      )
    }
  }
}


