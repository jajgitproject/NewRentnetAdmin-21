// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';

import { FormControl, Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DriverFeedBackData, DriverFeedbackInfo } from './DriverFeedbackInfo.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { DriverFeedbackInfoService } from './DriverFeedbackInfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-DriverFeedbackInfo',
  templateUrl: './DriverFeedbackInfo.component.html',
  styleUrls: ['./DriverFeedbackInfo.component.sass'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverFeedbackInfoComponent
{

  //public CityList?: CityDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  dataSource: DriverFeedbackInfo[] | null;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverFeedbackInfo;
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
  driverFeedbackInfo: DriverFeedbackInfo[];
  DriverName: string;
  isLoading = true;
  totalData = 0;
  PageNumber: number = 1;
  recordsPerPage = 5;
  driverID: any;
  searchActivationStatus: boolean;
  DriverID: any;
ngOnInit() 
{
  //this.getFeedBackData(this.data.driverID);
  this.loadData();
}


constructor(
  public dialogRef: MatDialogRef<DriverFeedbackInfoComponent>, 
  public driverFeedbackInfoService: DriverFeedbackInfoService,
  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='DriverFeedbackInfo';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Feedback';
          this.advanceTable = new DriverFeedbackInfo({});
  
        }
        this.DriverName =data.driverName;
        this.DriverID = data.driverID
  
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

getFeedBackData(driverID:any){
  this.driverFeedbackInfoService.GetDriverFeedBack(this.data.driverID).subscribe
  (
    (data:DriverFeedBackData) =>   
    {
      this.driverFeedbackInfo = data.driverDutyData;
   
    },
    (error: HttpErrorResponse) => { this.driverFeedbackInfo = null;}
  );

}


public loadData() 
{
  if(this.DriverID===undefined)
  {
    this.DriverID=0;
  }
   this.driverFeedbackInfoService.getDriverFeedBackData(this.DriverID,this.PageNumber).subscribe
 (
  (data:DriverFeedBackData)=>
   {

    if (data != null) {
     this.dataSource = data.driverDutyData;
     this.totalData =data.totalRecords
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



