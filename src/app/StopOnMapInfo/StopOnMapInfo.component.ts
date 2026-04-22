// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RuntimeConfigService } from '../core/service/runtime-config.service';
import {
  orderReservationStops,
  getReservationStopMapQuery,
  buildGoogleMapsEmbedDirectionsUrl,
  buildGoogleMapsDirUrlForStops
} from '../shared/reservation-stops-map.util';

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
  /** Embedded map (place or directions). */
  trustedUrl: SafeResourceUrl | null = null;
  /** Same as Stop Details: open full route in browser. */
  routeDirectionsBrowserUrl = '';

  constructor(
    public dialogRef: MatDialogRef<StopOnMapInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: ControlPanelDetails },
    public _generalService: GeneralService,
    private sanitizer: DomSanitizer,
    private runtimeConfig: RuntimeConfigService
  ) {
    this.dialogTitle = 'Stops on Map';
    this.stopDetailsInfo = this.data?.advanceTable ?? new ControlPanelDetails({});
    this.buildMapUrls();
  }

  getOrderedStops(): any[] {
    return orderReservationStops(this.stopDetailsInfo?.stopsDetails);
  }

  getStopQuery(stop: any): string {
    return getReservationStopMapQuery(stop);
  }

  stopSectionHeading(item: any): string {
    const t = String(item?.reservationStopType || item?.stopType || '').toLowerCase();
    if (t === 'pickup') return 'Pick Up';
    if (t === 'enroute') return 'Stop';
    if (t === 'dropoff' || t === 'destination') return 'Drop Off';
    return 'Stop';
  }

  stopMapSearchUrl(stop: any): string {
    const q = this.getStopQuery(stop);
    if (!q) return 'https://www.google.com/maps';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }

  private buildMapUrls(): void {
    this.trustedUrl = null;
    this.routeDirectionsBrowserUrl = '';
    const ordered = this.getOrderedStops();
    const withQuery = ordered.filter((s) => getReservationStopMapQuery(s));
    const key = encodeURIComponent(this.runtimeConfig.getGoogleMapsApiKey());
    const embed = buildGoogleMapsEmbedDirectionsUrl(withQuery, key);
    if (embed) {
      this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    }
    this.routeDirectionsBrowserUrl = buildGoogleMapsDirUrlForStops(withQuery);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
