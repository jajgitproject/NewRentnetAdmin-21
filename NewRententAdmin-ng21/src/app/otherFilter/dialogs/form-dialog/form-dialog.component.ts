// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { OtherFilterService } from '../../otherFilter.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { OtherFilter } from '../../otherFilter.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { CityDropDown } from 'src/app/general/CityDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class OtherFilterFormDialogComponent 
{
  //public CityList?: CityDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: OtherFilter;
  SearchBookingNumber: number= 123;
  SearchDateOfReg: string= '03/11/2022';
  SearchBooker: string= 'Shruti Sharma';
  SearchPassenger: string= 'Amar Singh';
  SearchVehicle: string= 'Crysta';
  SearchCity: string;
  SearchDateOfTravel: string ='29/11/2022';
  SearchPackageType: string;
  SearchPackage: string;
  SearchVendorAssignment: string= 'Assigned';
  SearchVendor: string= ' Eco Rent a car';
  SearchTripStatus: string;
  SearchDriver: string;
  SearchVehicles: string;
  SearchTripNotStarted: string;
  SearchTripStarted: string;
  SearchTripEnroute: string= 'Delhi, India, B-183, Trilok Puri';
  SearchTripCompleted: string= 'Noida, India, M-3, Sector 34';


  searchBookingNumber : FormControl = new FormControl();
  searchRegDate : FormControl = new FormControl();
  searchBooker : FormControl = new FormControl();
  searchPassenger : FormControl = new FormControl();
  searchVehicle : FormControl = new FormControl();
  searchCity : FormControl = new FormControl();
  searchTravelDate : FormControl = new FormControl();
  searchPackageType : FormControl = new FormControl();
  searchPackage : FormControl = new FormControl();
  searchvendorAssignment : FormControl = new FormControl();
  searchVendor : FormControl = new FormControl();
  searchTripStatus : FormControl = new FormControl();
  searchDriver : FormControl = new FormControl();
  searchVehicles : FormControl = new FormControl();
  searchTripNotStarted : FormControl = new FormControl();
  searchTripStarted : FormControl = new FormControl();
  searchTripEnroute : FormControl = new FormControl();
  searchTripCompleted : FormControl = new FormControl();



  constructor(
  public dialogRef: MatDialogRef<OtherFilterFormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: OtherFilterService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Other Filters';       
          this.dialogTitle ='Other Filters';
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Other Filters';
          this.advanceTable = new OtherFilter({});
          this.advanceTable.activationStatus="Active";
        }
        this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      otherFilterID: [this.advanceTable.otherFilterID],
      otherFilter: [this.advanceTable.otherFilter,[this.noWhitespaceValidator]],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      updateDateTime: [this.advanceTable.updateDateTime]
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
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
 
 
  public SearchData(): void 
  {
       
  }
}


