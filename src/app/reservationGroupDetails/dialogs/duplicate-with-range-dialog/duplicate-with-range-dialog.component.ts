// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReservationGroupDetailsService } from '../../reservationGroupDetails.service';
import { GeneralService } from '../../../general/general.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnfilledBookingModel } from '../../reservationGroupDetails.model';
import { MatRadioButton } from '@angular/material/radio';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-duplicate-with-range-dialog',
  templateUrl: './duplicate-with-range-dialog.component.html',
  styleUrls: ['./duplicate-with-range-dialog.component.sass']
})
export class DuplicateWithRangeDialogComponent
{
  advanceTableForm: FormGroup;
  reservationID: any;
  saveDisabled:boolean=true;
  CustomerName: any;
  PassengerName: any;
  City: any;
  PickupDate: any;
  PickupTime: any;
  constructor(
    public dialogRef: MatDialogRef<DuplicateWithRangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public advanceTableService: ReservationGroupDetailsService,
    public _generalService: GeneralService
  )
  {
    this.reservationID = data.reservationID;
    this.advanceTableForm = this.createContactFormForBookingWithRange();
    this.CustomerName = data.dataSource.customer;
    this.PassengerName = data.dataSource.primaryPassenger;
    this.City = data.dataSource.pickupCity;
    this.PickupDate = data.dataSource.pickupDate;
    this.PickupTime = data.dataSource.pickupTime;
  }

  minDate = new Date(); // आज की तारीख

// Optional: अगर आप चाहें कि आज को भी allow करें तो ये फ़िल्टर ज़रूरी नहीं है,
// लेकिन अगर future enhancement हो, तो dateFilter काम आएगा
dateFilter = (date: Date | null): boolean => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date >= today;
};
  
  onNoClick(): void
  {
    this.dialogRef.close();
  }

  ngOnInit()
  {
  }

  submit() {}

  createContactFormForBookingWithRange(): FormGroup 
  {
    return this.fb.group({
      reservationID :[this.reservationID],
      startDate:[''],
      endDate:['']
    })
  }

  onBlurUpdateDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm?.get('startDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm?.get('startDate')?.setErrors({ invalidDate: true });
  }
  }

  onBlurUpdateEndDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm?.get('endDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm?.get('endDate')?.setErrors({ invalidDate: true });
  }
  }


  duplicateWithRange()
  {
    this.saveDisabled = false;
      this.advanceTableService.CreateDuplicateWithDateRange(this.advanceTableForm.getRawValue()).subscribe(
        response => 
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('ReservationGroupDetailsCreate:ReservationGroupDetailsView:Success');//To Send Updates
          this.saveDisabled = true;   
        },
        error =>
        {
          this._generalService.sendUpdate('ReservationGroupDetailsAll:ReservationGroupDetailsView:Failure');//To Send Updates  
          this.saveDisabled = true; 
        }
      )
    }
  }




