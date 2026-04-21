// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails, StopsModel } from '../controlPanelDesign/controlPanelDesign.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RuntimeConfigService } from '../core/service/runtime-config.service';
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
    private sanitizer: DomSanitizer,
    private runtimeConfig: RuntimeConfigService
  ) {
    // Set the defaults
    this.dialogTitle = 'Stops on Map';
    this.stopDetailsInfo = this.data.advanceTable;
    if (this.stopDetailsInfo != null) {
      const apiKey = encodeURIComponent(this.runtimeConfig.getGoogleMapsApiKey());
      const base = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}`;

      if (this.stopDetailsInfo.stopsDetails.length > 2) {
        // For three or more stops, include waypoints
        const origin = this.stopDetailsInfo.stopsDetails[0].reservationStopAddress;
        const destination = this.stopDetailsInfo.stopsDetails[1].reservationStopAddress;
        const waypoints = this.stopDetailsInfo.stopsDetails
          .slice(2)
          .map((stop) => stop.reservationStopAddress)
          .join('|');

        this.dangerousMapUrl =
          `${base}&origin=${encodeURIComponent(origin)}` +
          `&destination=${encodeURIComponent(destination)}` +
          `&waypoints=${encodeURIComponent(waypoints)}`;
      } else {
        const origin = this.stopDetailsInfo?.stopsDetails[0].reservationStopAddress;
        const destination = this.stopDetailsInfo?.stopsDetails[1].reservationStopAddress;
        this.dangerousMapUrl =
          `${base}&origin=${encodeURIComponent(origin)}` +
          `&destination=${encodeURIComponent(destination)}`;
      }

      this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousMapUrl);
    }
    
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


