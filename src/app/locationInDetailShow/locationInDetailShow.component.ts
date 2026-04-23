// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LocationInDetailShow } from './locationInDetailShow.model';
import { LocationInDetailShowService } from './locationInDetailShow.service';

@Component({
  standalone: false,
  selector: 'app-locationInDetailShow',
  templateUrl: './locationInDetailShow.component.html',
  styleUrls: ['./locationInDetailShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LocationInDetailShowComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: LocationInDetailShow | null;
  viewAddress: any = 'N/A';
  viewKM: any = 'N/A';
  viewDate: any = null;
  viewTime: any = null;

  constructor(
    public dialogRef: MatDialogRef<LocationInDetailShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public locationInDetailShowService: LocationInDetailShowService,
    private httpClient: HttpClient,
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Garage In Details';
    this.dutySlipID = data.dutySlipID;
  }

  ngOnInit() {
    this.scheduleApplyViewModel(this.data?.rowRecord);
    this.LocationInLoadData();
    this.loadKmFromGarageInServicesByAllotment();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public LocationInLoadData() 
  {
     this.locationInDetailShowService.getLocationInData(this.dutySlipID).subscribe
     (
      (data:LocationInDetailShow) =>   
        {
          // API may return object, array, or wrapped payload.
          const payload: any = data as any;
          this.dataSource = Array.isArray(payload)
            ? (payload[0] || null)
            : (payload?.data?.[0] || payload?.data || payload);
          this.scheduleApplyViewModel(payload);
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

  private scheduleApplyViewModel(source: any): void {
    setTimeout(() => {
      this.applyViewModel(source);
      this.cdr.detectChanges();
    }, 0);
  }

  private firstNonNull(...values: any[]): any {
    for (const v of values) {
      if (v !== null && v !== undefined && v !== '') {
        return v;
      }
    }
    return null;
  }

  private toKmNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private selectPreferredKm(...values: any[]): any {
    const normalized = values
      .map((v) => this.toKmNumber(v))
      .filter((v) => v !== null) as number[];
    if (!normalized.length) {
      return null;
    }
    // Prefer first positive KM; keep zero only if no positive value exists.
    const positive = normalized.find((v) => v > 0);
    return positive !== undefined ? positive : normalized[0];
  }

  private findValueByKeyPattern(obj: any, pattern: RegExp): any {
    if (!obj || typeof obj !== 'object') {
      return null;
    }
    const queue: any[] = [obj];
    const seen = new Set<any>();
    while (queue.length) {
      const current = queue.shift();
      if (!current || typeof current !== 'object' || seen.has(current)) {
        continue;
      }
      seen.add(current);
      for (const key of Object.keys(current)) {
        const value = current[key];
        if (pattern.test(key) && value !== null && value !== undefined && value !== '') {
          return value;
        }
        if (value && typeof value === 'object') {
          queue.push(value);
        }
      }
    }
    return null;
  }

  private resolveLocationInKM(source?: any): any {
    const ctx = source ?? this.dataSource;
    const selected = Array.isArray(ctx)
      ? (ctx[0] || null)
      : (ctx?.data?.[0] || ctx?.data || ctx);
    const known = this.selectPreferredKm(
      selected?.locationInKM,
      selected?.locationInKm,
      selected?.garageInKM,
      selected?.garageInKm,
      selected?.pickupKM,
      selected?.pickupKm,
      selected?.locationInOdo,
      selected?.garageInOdo,
      selected?.odometer,
      selected?.locationIn?.locationInKM,
      selected?.locationIn?.locationInKm,
      selected?.locationIn?.garageInKM,
      selected?.locationIn?.garageInKm,
      selected?.locationIn?.locationInOdo,
      selected?.locationIn?.garageInOdo,
      selected?.data?.pickupKM,
      selected?.data?.pickupKm,
      this.data?.rowRecord?.locationInKM,
      this.data?.rowRecord?.locationInKm,
      this.data?.rowRecord?.garageInKM,
      this.data?.rowRecord?.garageInKm,
      this.data?.rowRecord?.pickupKM,
      this.data?.rowRecord?.pickupKm
    );
    if (known !== null) {
      return known;
    }
    return this.firstNonNull(
      this.findValueByKeyPattern(selected, /(locationin|garagein|location|garage).*(km|odo)|(km|odo).*(locationin|garagein|location|garage)/i),
      this.findValueByKeyPattern(ctx, /(locationin|garagein|location|garage).*(km|odo)|(km|odo).*(locationin|garagein|location|garage)/i),
      this.findValueByKeyPattern(this.data?.rowRecord, /(locationin|garagein|location|garage).*(km|odo)|(km|odo).*(locationin|garagein|location|garage)/i),
      this.findValueByKeyPattern(this.data?.rowRecord, /(km|odo)/i)
    );
  }

  private applyViewModel(source: any): void {
    const selected = Array.isArray(source)
      ? (source[0] || null)
      : (source?.data?.[0] || source?.data || source);

    this.viewAddress = this.firstNonNull(
      selected?.locationInAddressString,
      selected?.garageInAddressString,
      selected?.locationIn?.locationInAddressString,
      selected?.locationIn?.garageInAddressString,
      selected?.locationIn?.locationInAddress,
      this.data?.rowRecord?.locationInAddressString,
      this.data?.rowRecord?.garageInAddressString,
      this.data?.rowRecord?.organizationalEntityName,
      'N/A'
    );

    this.viewKM = this.firstNonNull(this.resolveLocationInKM(source), 'N/A');

    this.viewDate = this.firstNonNull(
      selected?.locationInDate,
      selected?.garageInDate,
      selected?.locationIn?.locationInDate,
      selected?.locationIn?.garageInDate,
      this.data?.rowRecord?.locationInDate,
      this.data?.rowRecord?.garageInDate,
      null
    );

    this.viewTime = this.firstNonNull(
      selected?.locationInTime,
      selected?.garageInTime,
      selected?.locationIn?.locationInTime,
      selected?.locationIn?.garageInTime,
      this.data?.rowRecord?.locationInTime,
      this.data?.rowRecord?.garageInTime,
      null
    );
  }

  private loadKmFromGarageInServicesByAllotment(): void {
    const allotmentID = this.data?.rowRecord?.allotmentID;
    if (!allotmentID) {
      return;
    }
    const driverUrl = `${this._generalService.BaseURL}GarageIn/GetAllotmentDataByDriver/${allotmentID}`;
    const appUrl = `${this._generalService.BaseURL}GarageInByApp/GetAllotmentDataByApp/${allotmentID}`;

    this.httpClient.get(driverUrl).subscribe(
      (res: any) => {
        const km = this.resolveLocationInKM(res);
        if (km !== null && km !== undefined && km !== '') {
          setTimeout(() => {
            const preferredKm = this.selectPreferredKm(this.viewKM, km);
            this.viewKM = preferredKm !== null ? preferredKm : this.viewKM;
            this.cdr.detectChanges();
          }, 0);
        }
      },
      () => {
        // Driver endpoint may be empty for App/GPS entries.
      }
    );

    this.httpClient.get(appUrl).subscribe(
      (res: any) => {
        const km = this.resolveLocationInKM(res);
        if (km !== null && km !== undefined && km !== '') {
          setTimeout(() => {
            const preferredKm = this.selectPreferredKm(this.viewKM, km);
            this.viewKM = preferredKm !== null ? preferredKm : this.viewKM;
            this.cdr.detectChanges();
          }, 0);
        }
      },
      () => {
        // Keep previous value; this endpoint is a fallback.
      }
    );
  }

}


