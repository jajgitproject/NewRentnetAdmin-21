// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DropOffDetailShow } from './dropOffDetailShow.model';
import { DropOffDetailShowService } from './dropOffDetailShow.service';

@Component({
  standalone: false,
  selector: 'app-dropOffDetailShow',
  templateUrl: './dropOffDetailShow.component.html',
  styleUrls: ['./dropOffDetailShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DropOffDetailShowComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: DropOffDetailShow | null;
  viewAddress: any = 'N/A';
  viewKM: any = 'N/A';
  viewDate: any = null;
  viewTime: any = null;

  constructor(
    public dialogRef: MatDialogRef<DropOffDetailShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public dropOffDetailShowService: DropOffDetailShowService,
    private httpClient: HttpClient,
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Drop Off Details';
    this.dutySlipID = data.dutySlipID;
  }

  ngOnInit() {
    this.scheduleApplyViewModel(this.data?.rowRecord);
    this.DropOffLoadData();
    this.loadKmFromDropOffServicesByAllotment();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public DropOffLoadData() 
  {
     this.dropOffDetailShowService.getDropOffData(this.dutySlipID).subscribe
     (
      (data:DropOffDetailShow) =>   
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

  private resolveDropOffKM(source?: any): any {
    const ctx = source ?? this.dataSource;
    const selected = Array.isArray(ctx)
      ? (ctx[0] || null)
      : (ctx?.data?.[0] || ctx?.data || ctx);
    const known = this.selectPreferredKm(
      selected?.dropOffKM,
      selected?.dropoffKM,
      selected?.dropOffKm,
      selected?.dropoffKm,
      selected?.pickupKM,
      selected?.pickupKm,
      selected?.garageOutKM,
      selected?.garageOutKm,
      selected?.dropOffOdo,
      selected?.dropoffOdo,
      selected?.odometer,
      selected?.drop?.dropOffKM,
      selected?.drop?.dropoffKM,
      selected?.drop?.dropOffKm,
      selected?.drop?.dropoffKm,
      selected?.drop?.dropOffOdo,
      selected?.drop?.dropoffOdo,
      selected?.data?.pickupKM,
      selected?.data?.pickupKm,
      this.data?.rowRecord?.dropOffKM,
      this.data?.rowRecord?.dropoffKM,
      this.data?.rowRecord?.dropOffKm,
      this.data?.rowRecord?.dropoffKm,
      this.data?.rowRecord?.pickupKM,
      this.data?.rowRecord?.pickupKm,
      this.data?.rowRecord?.garageOutKM,
      this.data?.rowRecord?.garageOutKm,
      this.data?.rowRecord?.drop?.dropOffKM,
      this.data?.rowRecord?.drop?.dropOffKm
    );
    if (known !== null) {
      return known;
    }
    return this.firstNonNull(
      this.findValueByKeyPattern(selected, /(drop|dropoff).*(km|odo)|(km|odo).*(drop|dropoff)/i),
      this.findValueByKeyPattern(ctx, /(drop|dropoff).*(km|odo)|(km|odo).*(drop|dropoff)/i),
      this.findValueByKeyPattern(this.data?.rowRecord, /(drop|dropoff).*(km|odo)|(km|odo).*(drop|dropoff)/i),
      this.findValueByKeyPattern(this.data?.rowRecord, /(km|odo)/i)
    );
  }

  private applyViewModel(source: any): void {
    const selected = Array.isArray(source)
      ? (source[0] || null)
      : (source?.data?.[0] || source?.data || source);

    this.viewAddress = this.firstNonNull(
      selected?.dropOffAddressString,
      selected?.dropoffAddressString,
      selected?.garageOutAddressString,
      selected?.drop?.dropOffAddressString,
      selected?.drop?.dropoffAddressString,
      selected?.drop?.dropOffAddress,
      this.data?.rowRecord?.dropOffAddressString,
      this.data?.rowRecord?.dropoffAddressString,
      this.data?.rowRecord?.drop?.dropOffAddress,
      'N/A'
    );

    this.viewKM = this.firstNonNull(this.resolveDropOffKM(source), 'N/A');

    this.viewDate = this.firstNonNull(
      selected?.dropOffDate,
      selected?.dropoffDate,
      selected?.garageOutDate,
      selected?.drop?.dropOffDate,
      this.data?.rowRecord?.dropOffDate,
      this.data?.rowRecord?.garageOutDate,
      this.data?.rowRecord?.drop?.dropOffDate,
      null
    );

    this.viewTime = this.firstNonNull(
      selected?.dropOffTime,
      selected?.dropoffTime,
      selected?.garageOutTime,
      selected?.drop?.dropOffTime,
      this.data?.rowRecord?.dropOffTime,
      this.data?.rowRecord?.garageOutTime,
      this.data?.rowRecord?.drop?.dropOffTime,
      null
    );
  }

  private loadKmFromDropOffServicesByAllotment(): void {
    const allotmentID = this.data?.rowRecord?.allotmentID;
    if (!allotmentID) {
      return;
    }
    const driverUrl = `${this._generalService.BaseURL}dropOffByExecutive/ForDropOffDriverDetails/${allotmentID}`;
    const appUrl = `${this._generalService.BaseURL}dropOffByApp/ForDropOffAppDetails/${allotmentID}`;

    this.httpClient.get(driverUrl).subscribe(
      (res: any) => {
        const km = this.resolveDropOffKM(res);
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
        const km = this.resolveDropOffKM(res);
        if (km !== null && km !== undefined && km !== '') {
          setTimeout(() => {
            const preferredKm = this.selectPreferredKm(this.viewKM, km);
            this.viewKM = preferredKm !== null ? preferredKm : this.viewKM;
            this.cdr.detectChanges();
          }, 0);
        }
      },
      () => {
        // Keep previously resolved values; this endpoint is fallback only.
      }
    );
  }

}


