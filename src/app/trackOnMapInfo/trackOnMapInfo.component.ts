// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails, StopsModel } from '../controlPanelDesign/controlPanelDesign.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TrackOnMapInfo } from './trackOnMapInfo.model';
import { TrackOnMapInfoService } from './trackOnMapInfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RuntimeConfigService } from '../core/service/runtime-config.service';

@Component({
  standalone: false,
  selector: 'app-trackOnMapInfo',
  templateUrl: './trackOnMapInfo.component.html',
  styleUrls: ['./trackOnMapInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TrackOnMapInfoComponent {
  public stopDetailsInfo: ControlPanelDetails;
  dialogTitle: string;
  public dangerousMapUrl: string;
  public trustedUrl: SafeUrl;
  stops: { lat: number; lng: number; time?: string }[] = [];
   dataSource: TrackOnMapInfo[] | null;
   dutySlipID:number;
   currentCarPosition: string = '';
   
  constructor(
    public dialogRef: MatDialogRef<TrackOnMapInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService,
    public trackOnMapInfoService: TrackOnMapInfoService,
    private sanitizer: DomSanitizer,
    private runtimeConfig: RuntimeConfigService
  ) {
    // Set the defaults
    this.dialogTitle = 'Track on Map';
    this.dutySlipID = this.data.dutySlipID;
    this.getTrackOnMap();
    
    
  }

generateMapUrl(): void {
  if (!this.stops || this.stops.length === null) {
    console.error('No stops available to generate map URL');
    this.trustedUrl ='No stops available to generate map URL';
    return;
  }

  const apiKey = encodeURIComponent(this.runtimeConfig.getGoogleMapsApiKey());

  // Handle single stop
  if (this.stops.length === 1) {
    const singleStop = this.stops[0];
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${singleStop.lat},${singleStop.lng}`;
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
    return;
  }

  // Handle directions for multiple stops
  const origin = this.stops[0];
  const destination = this.stops[this.stops.length - 1];
  const waypoints = this.stops
    .slice(1, -1)
    .map((stop) => `${stop.lat},${stop.lng}`)
    .join('|');

  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&waypoints=${encodeURIComponent(waypoints)}`;
  this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
}


  ngOnInit() {

  }
  getTrackOnMap() {
    debugger;
    this.trackOnMapInfoService.getTrackOnMapInfo(this.dutySlipID).subscribe(
      data => {
        this.dataSource = data;
  
        if (this.dataSource && this.dataSource.length > 0) {
          // Clear existing stops array
          this.stops = [];
  
          this.dataSource.forEach(item => {
            if (item.geoLatLong) {
              const geoLatLong = item.geoLatLong.replace('POINT (', '').replace(')', '').split(' ');
              const lat = parseFloat(geoLatLong[1]);
              const lng = parseFloat(geoLatLong[0]);
  
              // Ensure valid coordinates before pushing
              if (!isNaN(lat) && !isNaN(lng)) {
                const time = item.locationTime 
                  ? new Date(item.locationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                  : '';
                this.stops.push({ lat, lng, time });
              }
            }
          });
  
          this.generateMapUrl();
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching track on map data:', error);
        this.dataSource = null;
      }
    );
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }
}


