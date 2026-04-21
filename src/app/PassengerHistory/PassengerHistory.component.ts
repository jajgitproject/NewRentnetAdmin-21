// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { PassengerData, PassengerHistory } from './PassengerHistory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../general/general.service';
//import { CityDropDown } from 'src/app/general/CityDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { PassengerHistoryService } from './PassengerHistory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
@Component({
  standalone: false,
  selector: 'app-PassengerHistory',
  templateUrl: './PassengerHistory.component.html',
  styleUrls: ['./PassengerHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PassengerHistoryComponent
{

  isLoading = true;
  totalData = 0;
  PageNumber: number = 1;
  recordsPerPage = 2;
  dataSource: PassengerHistory[] | undefined;
 // public CityList?: CityDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: PassengerHistory;
  SearchBookingNumber: number ;
  SearchDateOfReg: string= '';
  SearchBooker: string= '';
  SearchPassenger: string= '';
  SearchVehicle: string= '';
  SearchCity: string;
  SearchDateOfTravel: string ='29/11/2022';
  SearchPackageType: string;
  SearchPackage: string;
  SearchPassengerHistory: string= 'Assigned';
  SearchVendor: string= '';
  SearchTripStatus: string;
  SearchDriver: string;
  SearchVehicles: string;
  SearchTripNotStarted: string;
  SearchTripStarted: string;
  SearchTripEnroute: string= '';
  SearchTripCompleted: string= '';
  activeData: string;

  searchBookingNumber : FormControl = new FormControl();
  searchRegDate : FormControl = new FormControl();
  searchBooker : FormControl = new FormControl();
  searchPassenger : FormControl = new FormControl();
  searchVehicle : FormControl = new FormControl();
  searchCity : FormControl = new FormControl();
  searchTravelDate : FormControl = new FormControl();
  searchPackageType : FormControl = new FormControl();
  searchPackage : FormControl = new FormControl();
  searchPassengerHistory : FormControl = new FormControl();
  searchVendor : FormControl = new FormControl();
  searchTripStatus : FormControl = new FormControl();
  searchDriver : FormControl = new FormControl();
  searchVehicles : FormControl = new FormControl();
  searchTripNotStarted : FormControl = new FormControl();
  searchTripStarted : FormControl = new FormControl();
  searchTripEnroute : FormControl = new FormControl();
  searchTripCompleted : FormControl = new FormControl();
  reservationID: any;
  PassengerID: any;
  passengerHistoryRecords: any;
  cityID: any;
  pickupCityID: any;

ngOnInit() 
{
  this.loadData();
}

constructor(
  public dialogRef: MatDialogRef<PassengerHistoryComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public passengerHistoryService: PassengerHistoryService,
  public _generalService:GeneralService)
  {
    this.PassengerID = this.data.PassengerID;
    this.pickupCityID =this.data.pickupCityID;
      // Set the defaults
      this.action = data.action;
      if (this.action === 'edit') 
      {
        //this.dialogTitle ='Edit PassengerHistory';       
        this.dialogTitle ='PassengerHistory';
        this.advanceTable = data.advanceTable;
      } else 
      {
        this.dialogTitle = 'Trip Filter';
        this.advanceTable = new PassengerHistory({});
        //this.advanceTable.activationStatus="true";
      }
      this.advanceTableForm = this.createContactForm();
  }

  public loadData() 
  {
     this.passengerHistoryService.getTableData(this.PassengerID, this.pickupCityID,this.PageNumber
       ).subscribe
   (
     (data:PassengerData) =>   
     {
        this.passengerHistoryRecords = data.passengerHistoryModel;
        this.totalData =data.totalRecords
     },
     (error: HttpErrorResponse) => { this.passengerHistoryRecords = null;}
   );
 }
 
 onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.PageNumber = pageData.pageIndex + 1;
this.loadData();
}
createContactForm(): FormGroup 
{
  return this.fb.group(
  {
    passengerHistoryID: [this.advanceTable.passengerHistoryID],
    passengerHistory: [this.advanceTable.passengerHistory,[this.noWhitespaceValidator]],
    //activationStatus: [this.advanceTable.activationStatus],
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



