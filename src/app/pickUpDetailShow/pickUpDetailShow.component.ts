// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { PickUpDetailShow } from './pickUpDetailShow.model';
import { PickUpDetailShowService } from './pickUpDetailShow.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-pickUpDetailShow',
  templateUrl: './pickUpDetailShow.component.html',
  styleUrls: ['./pickUpDetailShow.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PickUpDetailShowComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: PickUpDetailShow | null;
  viewAddress: any = 'N/A';
  viewKM: any = 'N/A';
  viewDate: any = null;
  viewTime: any = null;

  constructor(
    public dialogRef: MatDialogRef<PickUpDetailShowComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    //public advanceTable:PickUpDetailShow,
    public pickUpDetailShowService: PickUpDetailShowService,
    private httpClient: HttpClient,
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Pick Up Details';
    this.dutySlipID = data.dutySlipID;
  }

  ngOnInit() {
    // Seed UI from row data on next tick to avoid NG0100 during dialog init.
    this.scheduleApplyViewModel(this.data?.rowRecord);
    this.PickUpLoadData();
    this.loadKmFromPickupServiceByAllotment();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public PickUpLoadData() 
  {
     this.pickUpDetailShowService.getPickUpData(this.dutySlipID).subscribe
     (
      (data:PickUpDetailShow) =>   
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

  resolvePickupKM(source?: any): any {
    const ctx = source ?? this.dataSource;
    const selected = Array.isArray(ctx)
      ? (ctx[0] || null)
      : (ctx?.data?.[0] || ctx?.data || ctx);
    const known = this.firstNonNull(
      selected?.pickUpKM,
      selected?.pickupKM,
      selected?.pickUpKm,
      selected?.pickupKm,
      selected?.pickUpKms,
      selected?.pickupKms,
      selected?.pickUpOdo,
      selected?.pickupOdo,
      selected?.pickUpODO,
      selected?.pickupODO,
      selected?.odometer,
      selected?.pickup?.pickupKM,
      selected?.pickup?.pickupKm,
      selected?.pickUp?.pickUpKM,
      selected?.pickUp?.pickUpKm,
      this.data?.rowRecord?.pickUpKM,
      this.data?.rowRecord?.pickupKM,
      this.data?.rowRecord?.pickUpKm,
      this.data?.rowRecord?.pickupKm,
      this.data?.rowRecord?.pickup?.pickupKM,
      this.data?.rowRecord?.pickup?.pickupKm,
      this.data?.rowRecord?.locationOutKM
    );
    if (known !== null) {
      return known;
    }
    return this.firstNonNull(
      this.findValueByKeyPattern(selected, /(pickup|pick).*(km|odo)|(km|odo).*(pickup|pick)/i),
      this.findValueByKeyPattern(ctx, /(pickup|pick).*(km|odo)|(km|odo).*(pickup|pick)/i),
      this.findValueByKeyPattern(source, /(pickup|pick).*(km|odo)|(km|odo).*(pickup|pick)/i),
      this.findValueByKeyPattern(this.data?.rowRecord, /(pickup|pick).*(km|odo)|(km|odo).*(pickup|pick)/i),
      this.findValueByKeyPattern(this.data?.rowRecord, /(km|odo)/i)
    );
  }

  private applyViewModel(source: any): void {
    const selected = Array.isArray(source)
      ? (source[0] || null)
      : (source?.data?.[0] || source?.data || source);

    this.viewAddress = this.firstNonNull(
      selected?.pickUpAddressString,
      selected?.pickupAddressString,
      selected?.pickUpAddress,
      selected?.pickupAddress,
      selected?.pickup?.pickupAddress,
      selected?.pickUp?.pickUpAddress,
      this.data?.rowRecord?.pickUpAddressString,
      this.data?.rowRecord?.pickupAddressString,
      this.data?.rowRecord?.pickup?.pickupAddress,
      'N/A'
    );

    this.viewKM = this.firstNonNull(this.resolvePickupKM(source), 'N/A');

    this.viewDate = this.firstNonNull(
      selected?.pickUpDate,
      selected?.pickupDate,
      selected?.pickDate,
      this.data?.rowRecord?.pickDate,
      this.data?.rowRecord?.pickup?.pickupDate,
      null
    );

    this.viewTime = this.firstNonNull(
      selected?.pickUpTime,
      selected?.pickupTime,
      selected?.pickTime,
      this.data?.rowRecord?.pickTime,
      this.data?.rowRecord?.pickup?.pickupTime,
      null
    );
  }

  /**
   * Fallback source for KM: same API family used by Pickup-by-Executive forms.
   */
  private loadKmFromPickupServiceByAllotment(): void {
    const allotmentID = this.data?.rowRecord?.allotmentID;
    if (!allotmentID) {
      return;
    }
    const url = `${this._generalService.BaseURL}pickUpByExecutive/getDutySlipDetails/${allotmentID}`;
    this.httpClient.get(url).subscribe(
      (res: any) => {
        const km = this.resolvePickupKM(res);
        if (km !== null && km !== undefined && km !== '') {
          setTimeout(() => {
            this.viewKM = km;
            this.cdr.detectChanges();
          }, 0);
        }
      },
      () => {
        // Keep previously resolved values; this is only a fallback path.
      }
    );
  }

}


