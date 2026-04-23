// @ts-nocheck

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Component, Inject } from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { GeneralService } from '../general/general.service';

import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';

import {

  orderReservationStops,

  getReservationStopMapQuery,

  buildGoogleMapsDirUrlForStops

} from '../shared/reservation-stops-map.util';



@Component({

  standalone: false,

  selector: 'app-StopDetailsInfo',

  templateUrl: './StopDetailsInfo.component.html',

  styleUrls: ['./StopDetailsInfo.component.sass'],

  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]

})

export class StopDetailsInfoComponent {

  public stopDetailsInfo: ControlPanelDetails;

  dialogTitle: string;

  /** Opens full Google Maps in a new tab (path between all stops with a query). */

  routeDirectionsBrowserUrl = '';



  constructor(

    public dialogRef: MatDialogRef<StopDetailsInfoComponent>,

    @Inject(MAT_DIALOG_DATA)

    public data: { advanceTable: ControlPanelDetails},

    public _generalService: GeneralService

  ) {

    this.dialogTitle = 'Stop Details';

    this.stopDetailsInfo = new ControlPanelDetails({});

    this.stopDetailsInfo = this.data.advanceTable;

    this.buildRouteBrowserUrl();

  }



  getOrderedStops(): any[] {

    return orderReservationStops(this.stopDetailsInfo?.stopsDetails);

  }



  getStopQuery(stop: any): string {

    return getReservationStopMapQuery(stop);

  }



  private buildRouteBrowserUrl(): void {

    const ordered = this.getOrderedStops().filter((s) => getReservationStopMapQuery(s));

    this.routeDirectionsBrowserUrl = buildGoogleMapsDirUrlForStops(ordered);

  }



  stopSectionHeading(item: any): string {

    const t = String(item?.reservationStopType || item?.stopType || '').toLowerCase();

    if (t === 'pickup') return 'Pick Up';

    if (t === 'enroute') return 'Stop';

    if (t === 'dropoff' || t === 'destination') return 'Drop Off';

    return 'Stop';

  }



  /** Single-stop "View on map" link (properly encoded query). */

  stopMapSearchUrl(stop: any): string {

    const q = this.getStopQuery(stop);

    if (!q) return 'https://www.google.com/maps';

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  }



  onNoClick(): void {

    this.dialogRef.close();

  }

}



