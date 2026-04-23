// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ControlPanelDetails, StopsModel } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-TimeAndAddressInfo',
  templateUrl: './TimeAndAddressInfo.component.html',
  styleUrls: ['./TimeAndAddressInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TimeAndAddressInfoComponent {
  public timeAndAddressInfo: StopsModel;
  /** Normalized for template (API uses several alternate property names). */
  displayCountry = '';
  displayState = '';
  displayCity = '';
  displayCityGroup = '';
  /** Date/time row: filled from stop, or from parent pickup/drop summary when the stop row is sparse. */
  displayStopDate: Date | string | null = null;
  displayStopTime: Date | string | null = null;
  /** Full address line + details when stop row omits them (same as pickup/drop summary on grid). */
  displayGoogleAddressLine = '';
  displayAddressDetailsLine = '';
  /** Google Maps embed URL for iframe (from address string / lat,lng). */
  public trustedUrl: SafeResourceUrl | null = null;
  dialogTitle: string;
  status: string = '';
  buttonDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<TimeAndAddressInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      advanceTable: StopsModel;
      status?: any;
      parentRow?: any;
      /** Pickup vs drop-off row: drives parentRow fallbacks (drop uses `drop`, `dropOffCity`, etc.). */
      locationKind?: 'pickup' | 'drop';
    },
    public _generalService: GeneralService,
    private sanitizer: DomSanitizer
  ) {
    // Set the defaults
    this.dialogTitle = 'Time & Address Info';
    this.timeAndAddressInfo = this.data.advanceTable;
    const locationKind = this.data.locationKind === 'drop' ? 'drop' : 'pickup';
    this.applyStopDateTimeDisplay(this.data.advanceTable, this.data.parentRow, locationKind);
    this.buildLocationDisplay(this.data.advanceTable, this.data.parentRow, locationKind);
    // Extract status robustly (string or nested)
    this.status = this.extractStatus(this.data);
    const normalizedStatus = (this.status || '').toLowerCase().trim();
    // Allow updates when status was not supplied (same pattern as pickup-time dialog)
    this.buttonDisabled =
      normalizedStatus.length > 0 && normalizedStatus !== 'changes allow';

    this.buildMapEmbedUrl();
  }

  /** Pin map from Google address line; supports lat,lng in encodedStopAddressGeoLocation. */
  private buildMapEmbedUrl(): void {
    const stop = (this.data.advanceTable || {}) as any;
    const geo = (stop.encodedStopAddressGeoLocation || '').trim();
    let query = '';

    if (/^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(geo)) {
      query = geo.replace(/\s+/g, '');
    } else {
      const fromGoogleLine = (this.displayGoogleAddressLine || '').trim();
      const details = (this.displayAddressDetailsLine || '').trim();
      const combined =
        fromGoogleLine && details && !fromGoogleLine.includes(details)
          ? `${fromGoogleLine}, ${details}`
          : TimeAndAddressInfoComponent.firstNonEmpty(fromGoogleLine, details);
      query = TimeAndAddressInfoComponent.firstNonEmpty(
        combined,
        [
          this.displayCity,
          this.displayState,
          this.displayCountry
        ]
          .filter((x) => x && String(x).trim())
          .join(', ')
      );
    }

    if (!query) {
      this.trustedUrl = null;
      return;
    }

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(
      query
    )}&output=embed&z=15`;
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private applyStopDateTimeDisplay(
    stop: any,
    parentRow: any,
    locationKind: 'pickup' | 'drop'
  ): void {
    const s = stop || {};
    const p = parentRow || {};
    let d = s.reservationStopDate;
    let t = s.reservationStopTime;
    if (locationKind === 'drop' && p.drop) {
      if (this.isMissingOrInvalidDate(d)) d = p.drop.dropOffDate;
      if (this.isMissingOrInvalidDate(t)) t = p.drop.dropOffTime;
    } else if (locationKind === 'pickup' && p.pickup) {
      if (this.isMissingOrInvalidDate(d)) d = p.pickup.pickupDate;
      if (this.isMissingOrInvalidDate(t)) t = p.pickup.pickupTime;
    }
    this.displayStopDate = this.isMissingOrInvalidDate(d) ? null : d;
    this.displayStopTime = this.isMissingOrInvalidDate(t) ? null : t;
  }

  private isMissingOrInvalidDate(v: any): boolean {
    if (v === null || v === undefined || v === '') return true;
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime());
  }

  private static firstNonEmpty(...vals: any[]): string {
    for (const v of vals) {
      if (v === null || v === undefined) continue;
      const s = String(v).trim();
      if (s !== '') return s;
    }
    return '';
  }

  /**
   * Maps reservation stop payloads that use reservationStopCountry / reservationStopState /
   * reservationStopCity, PascalCase, or comma-separated google address strings.
   */
  private buildLocationDisplay(
    stop: any,
    parentRow?: any,
    locationKind: 'pickup' | 'drop' = 'pickup'
  ): void {
    const s = stop || {};
    const p = parentRow || {};
    const isDrop = locationKind === 'drop';

    this.displayCountry = TimeAndAddressInfoComponent.firstNonEmpty(
      s.country,
      s.Country,
      s.reservationStopCountry,
      p.country,
      p.Country
    );
    this.displayState = TimeAndAddressInfoComponent.firstNonEmpty(
      s.state,
      s.State,
      s.reservationStopState,
      p.state,
      p.State
    );
    this.displayCity = isDrop
      ? TimeAndAddressInfoComponent.firstNonEmpty(
          s.city,
          s.City,
          s.reservationStopCity,
          p.dropOffCity,
          p.city,
          p.City,
          p.pickupCity
        )
      : TimeAndAddressInfoComponent.firstNonEmpty(
          s.city,
          s.City,
          s.reservationStopCity,
          p.pickupCity,
          p.city,
          p.City,
          p.dropOffCity
        );
    this.displayCityGroup = TimeAndAddressInfoComponent.firstNonEmpty(
      s.cityGroup,
      s.CityGroup,
      s.cityGroupName,
      s.cityTierName,
      p.cityGroup,
      p.customerGroup,
      p.CustomerGroup
    );

    this.displayGoogleAddressLine = TimeAndAddressInfoComponent.firstNonEmpty(
      s.reservationStopAddress,
      this.resolveStopAddressForDisplay(s, p, locationKind)
    );
    this.displayAddressDetailsLine = TimeAndAddressInfoComponent.firstNonEmpty(
      s.reservationStopAddressDetails,
      isDrop && p.drop ? p.drop.dropOffAddressDetails : null,
      !isDrop && p.pickup ? p.pickup.pickupAddressDetails : null
    );

    const addr = this.resolveStopAddressForDisplay(s, p, locationKind).trim();
    if (!addr) return;
    const parts = addr.split(',').map((x: string) => x.trim()).filter(Boolean);
    if (parts.length < 2) return;
    // e.g. "Mumbai, Maharashtra, India" or "A, B, City, State, Country"
    if (parts.length >= 3) {
      if (!this.displayCountry)
        this.displayCountry = parts[parts.length - 1];
      if (!this.displayState)
        this.displayState = parts[parts.length - 2];
      if (!this.displayCity)
        this.displayCity = parts.slice(0, parts.length - 2).join(', ');
    } else {
      if (!this.displayCity) this.displayCity = parts[0];
      if (!this.displayState) this.displayState = parts[1];
    }
  }

  /** Prefer stop row; for pickup/drop fall back to summary fields on the reservation row. */
  private resolveStopAddressForDisplay(
    stop: any,
    parentRow: any,
    locationKind: 'pickup' | 'drop'
  ): string {
    const s = stop || {};
    const p = parentRow || {};
    const direct = (s.reservationStopAddress || '').trim();
    if (direct) return direct;
    if (locationKind === 'drop') {
      const fromDrop = p.drop && (p.drop.dropOffAddress || p.drop.DropOffAddress);
      return TimeAndAddressInfoComponent.firstNonEmpty(
        fromDrop,
        p.dropOffAddress,
        p.DropOffAddress
      );
    }
    const fromPickup = p.pickup && (p.pickup.pickupAddress || p.pickup.PickupAddress);
    return TimeAndAddressInfoComponent.firstNonEmpty(
      fromPickup,
      p.pickupAddress,
      p.PickupAddress
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private extractStatus(input: any): string {
    try {
      if (typeof input === 'string') return input;
      if (input?.status && typeof input.status === 'string') return input.status;
      if (input?.status?.status && typeof input.status.status === 'string') return input.status.status;
      return '';
    } catch {
      return '';
    }
  }
}
