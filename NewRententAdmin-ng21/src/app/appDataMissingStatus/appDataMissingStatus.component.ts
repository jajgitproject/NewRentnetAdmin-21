// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AppDataMissingStatusModel } from './appDataMissingStatus.model';
import { AppDataMissingStatusService} from './appDataMissingStatus.service';

@Component({
  standalone: false,
  selector: 'app-appDataMissingStatus',
  templateUrl: './appDataMissingStatus.component.html',
  styleUrls: ['./appDataMissingStatus.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AppDataMissingStatusComponent {
  @Output() statusChange = new EventEmitter<string>();
  dialogTitle: string;
  dutySlipID: number;
  dataSource: AppDataMissingStatusModel | null;
  currentAddress: any;
  currentLocationLatitude: string;
  currentLocationLongitude: string;
  locationBeforeTwoMinutesLatitude: string;
  locationBeforeTwoMinutesLongitude: string;
  locationBeforeTwoMinutesAddress: any;
  status: string;

  constructor(
    public dialogRef: MatDialogRef<AppDataMissingStatusComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public appDataMissingStatusService: AppDataMissingStatusService
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'App Data Missing Status Details';
    this.dutySlipID = data.dutySlipID;
    console.log(this.dutySlipID)
  }

  ngOnInit() 
  {
    this.LoadData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public LoadData() 
  {
     this.appDataMissingStatusService.getDropOffData(this.dutySlipID).subscribe
     (
      (data:AppDataMissingStatusModel) =>   
        {
          this.dataSource = data;

          //---------- Current Location --------
          var currentLocationLatLong = this.dataSource.currentLocation.replace('(','');
          currentLocationLatLong = currentLocationLatLong.replace(')', '');
          this.currentLocationLatitude = currentLocationLatLong.split(' ')[2];
          this.currentLocationLongitude = currentLocationLatLong.split(' ')[1];

          const apiKey = 'AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c&origin';
          const currentLocationURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.currentLocationLatitude},${this.currentLocationLongitude}&key=${apiKey}`;

          fetch(currentLocationURL).then(response => response.json()).then(data => {
            if (data.results && data.results.length > 0) 
            {
              this.currentAddress = data.results[1].formatted_address;
            }
            else
            {
              console.error('No address found for the coordinates');
            }
          }).catch(error => console.error('Error:', error));


          //---------- Location Before Two Minute --------
          var locationBeforeTwoMinutesLatLong = this.dataSource.locationBeforeTwoMinutes.replace('(','');
          locationBeforeTwoMinutesLatLong = locationBeforeTwoMinutesLatLong.replace(')', '');
          this.locationBeforeTwoMinutesLatitude = locationBeforeTwoMinutesLatLong.split(' ')[2];
          this.locationBeforeTwoMinutesLongitude = locationBeforeTwoMinutesLatLong.split(' ')[1];

          const locationBeforeTwoMinutesURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.locationBeforeTwoMinutesLatitude},${this.locationBeforeTwoMinutesLongitude}&key=${apiKey}`;

          fetch(locationBeforeTwoMinutesURL).then(response => response.json()).then(data => {
            if (data.results && data.results.length > 0) 
            {
              this.locationBeforeTwoMinutesAddress = data.results[1].formatted_address;
            }
            else
            {
              console.error('No address found for the coordinates');
            }
          }).catch(error => console.error('Error:', error));

          if(this.currentAddress === this.locationBeforeTwoMinutesAddress)
          {
            this.status = "Not Moving";
          }
          else if(this.currentAddress !== this.locationBeforeTwoMinutesAddress)
          {
            this.status = "Not Moving";
          }
          else
          {
            this.status = "Stop";
          }
          
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

}


