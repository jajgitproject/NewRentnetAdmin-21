// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CarMovingStatusByAppModel } from './carMovingStatusByApp.model';
import { CarMovingStatusByAppService} from './carMovingStatusByApp.service';
import { RuntimeConfigService } from '../core/service/runtime-config.service';

@Component({
  standalone: false,
  selector: 'app-carMovingStatusByApp',
  templateUrl: './carMovingStatusByApp.component.html',
  styleUrls: ['./carMovingStatusByApp.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CarMovingStatusByAppComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: CarMovingStatusByAppModel | null;
  latitude: string;
  longitude: string;
  currentAddress: any;
  currentLocationLatitude: string;
  currentLocationLongitude: string;
  locationBeforeTwoMinutesLatitude: string;
  locationBeforeTwoMinutesLongitude: string;
  locationBeforeTwoMinutesAddress: any;

  constructor(
    public dialogRef: MatDialogRef<CarMovingStatusByAppComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public carMovingStatusByAppService: CarMovingStatusByAppService,
    private runtimeConfig: RuntimeConfigService
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Car Moving Status Details';
    this.dutySlipID = data.dutySlipID;
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
     this.carMovingStatusByAppService.getDropOffData(this.dutySlipID).subscribe
     (
      (data:CarMovingStatusByAppModel) =>   
        {
          this.dataSource = data;

          //---------- Current Location --------
          var currentLocationLatLong = this.dataSource.currentLocation.replace('(','');
          currentLocationLatLong = currentLocationLatLong.replace(')', '');
          this.currentLocationLatitude = currentLocationLatLong.split(' ')[2];
          this.currentLocationLongitude = currentLocationLatLong.split(' ')[1];

          const apiKey = encodeURIComponent(this.runtimeConfig.getGoogleMapsApiKey());
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
          
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

}


