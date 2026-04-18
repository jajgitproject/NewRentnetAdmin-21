// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails, StopsModel } from '../controlPanelDesign/controlPanelDesign.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  standalone: false,
  selector: 'app-StopOnMapInfo',
  templateUrl: './StopOnMapInfo.component.html',
  styleUrls: ['./StopOnMapInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class StopOnMapInfoComponent {
  public stopDetailsInfo: ControlPanelDetails;
  dialogTitle: string;
  public dangerousMapUrl: string;
  public trustedUrl: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<StopOnMapInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails },
    public _generalService: GeneralService,
    private sanitizer: DomSanitizer
  ) {
    // Set the defaults
    this.dialogTitle = 'Stops on Map';
    this.stopDetailsInfo = this.data.advanceTable;
    console.log(this.stopDetailsInfo?.stopsDetails)
    if (this.stopDetailsInfo != null) {
      if(this.stopDetailsInfo.stopsDetails.length > 2)
        {
           //For three or more stops, include waypoints
          const origin = this.stopDetailsInfo.stopsDetails[0].reservationStopAddress;
          const destination = this.stopDetailsInfo.stopsDetails[1].reservationStopAddress;
          const waypoints = this.stopDetailsInfo.stopsDetails
          .slice(2) // Skip first two records
          .map((stop) => stop.reservationStopAddress)
          .join('|');
          console.log(waypoints)

    this.dangerousMapUrl =
    'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c&origin=' +
    encodeURIComponent(origin) +
    '&destination=' +
    encodeURIComponent(destination) +
    '&waypoints=' +
    encodeURIComponent(waypoints);
  
        this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.dangerousMapUrl
        );
    //       this.dangerousMapUrl =
    // 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c&origin=' +
    // encodeURIComponent(this.stopDetailsInfo?.stopsDetails[0].reservationStopAddress) +
    // '&destination=' +
    // encodeURIComponent(this.stopDetailsInfo?.stopsDetails[1].reservationStopAddress) +
    // '&waypoints=' +
    // encodeURIComponent(this.stopDetailsInfo?.stopsDetails[2].reservationStopAddress);

  this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousMapUrl);

      }
      else
      {
        this.dangerousMapUrl =
        'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAFoLcbOuZfbGJGCdlazGXZbOCYr8dW76c&origin=' +
        this.stopDetailsInfo?.stopsDetails[0].reservationStopAddress +
        '&destination=' +
        this.stopDetailsInfo?.stopsDetails[1].reservationStopAddress;

      this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.dangerousMapUrl
      );
      }
   
    } 
    
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


