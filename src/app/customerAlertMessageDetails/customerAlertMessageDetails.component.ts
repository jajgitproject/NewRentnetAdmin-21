// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../general/general.service';
//import { CityDropDown } from 'src/app/general/CityDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { CustomerAlertMessageDetails, CustomerAlertMessageDetailsData } from './customerAlertMessageDetails.model';
import { CustomerAlertMessageDetailsService } from './customerAlertMessageDetails.service';
@Component({
  standalone: false,
  selector: 'app-customerAlertMessageDetails',
  templateUrl: './customerAlertMessageDetails.component.html',
  styleUrls: ['./customerAlertMessageDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerAlertMessageDetailsComponent
{

  //public CityList?: CityDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  dataSource: CustomerAlertMessageDetails[] | null;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerAlertMessageDetails;
  SearchBookingNumber: number ;
  SearchDateOfReg: string= '';
  SearchBooker: string= '';
  SearchPassenger: string= '';
  SearchVehicle: string= '';
  SearchCity: string;
  SearchDateOfTravel: string ='29/11/2022';
  SearchPackageType: string;
  SearchPackage: string;
  SearchDriverFeedbackInfo: string= 'Assigned';
  SearchVendor: string= '';
  SearchTripStatus: string;
  SearchDriver: string;
  SearchVehicles: string;
  SearchTripNotStarted: string;
  SearchTripStarted: string;
  SearchTripEnroute: string= '';
  SearchTripCompleted: string= '';

  searchBookingNumber : FormControl = new FormControl();
  searchRegDate : FormControl = new FormControl();
  searchBooker : FormControl = new FormControl();
  searchPassenger : FormControl = new FormControl();
  searchVehicle : FormControl = new FormControl();
  searchCity : FormControl = new FormControl();
  searchTravelDate : FormControl = new FormControl();
  searchPackageType : FormControl = new FormControl();
  searchPackage : FormControl = new FormControl();
  searchDriverFeedbackInfo : FormControl = new FormControl();
  searchVendor : FormControl = new FormControl();
  searchTripStatus : FormControl = new FormControl();
  searchDriver : FormControl = new FormControl();
  searchVehicles : FormControl = new FormControl();
  searchTripNotStarted : FormControl = new FormControl();
  searchTripStarted : FormControl = new FormControl();
  searchTripEnroute : FormControl = new FormControl();
  searchTripCompleted : FormControl = new FormControl();
  driverFeedbackInfo: CustomerAlertMessageDetails[];
  DriverName: string;
  isLoading = true;
  totalData = 0;
  PageNumber: number = 1;
  recordsPerPage = 5;

  searchActivationStatus: boolean;
  customerName: any;
  customerID: any;

ngOnInit() 
{
  //this.getFeedBackData(this.data.driverID);
  this.loadData();
}

constructor(
  public dialogRef: MatDialogRef<CustomerAlertMessageDetailsComponent>, 
  public customerAlertMessageDetailsService: CustomerAlertMessageDetailsService,
  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Alert Message';       
          this.advanceTable = data.advanceTable;
          this.customerName =data.customerName;
          this.customerID = data.customerID
        } else 
        {
          this.dialogTitle = 'Customer Alert Message';
          this.advanceTable = new CustomerAlertMessageDetails({});
  
        }
        this.customerName =data.customerName;
        this.customerID = data.customerID
    
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

// getFeedBackData(driverID:any){
//   this.driverFeedbackInfoService.GetDriverFeedBack(this.data.driverID).subscribe
//   (
//     (data:DriverFeedBackData) =>   
//     {
//       this.driverFeedbackInfo = data.driverDutyData;
//     
//     },
//     (error: HttpErrorResponse) => { this.driverFeedbackInfo = null;}
//   );

// }

public loadData() 
{
  if(this.customerID===undefined)
  {
    this.customerID=0;
  }
   this._generalService.GetCustomerAlertMessage(this.customerID).subscribe
 (
  (data)=>
   {

    if (data != null) {
     this.dataSource = data;
    }
  
   },
   (error: HttpErrorResponse) => { this.dataSource = null;}
 );
}
onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.PageNumber = pageData.pageIndex + 1;
this.loadData();
}
public SearchData(): void 
{
     
}

}



