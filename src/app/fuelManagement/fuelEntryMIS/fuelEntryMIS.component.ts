// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { TableExportUtil } from '@shared';

import { GeneralService } from '../../general/general.service';
import { InventoryDropDown } from '../../inventory/inventoryDropDown.model';
import { OrganizationalEntityDropDown } from '../../organizationalEntity/organizationalEntityDropDown.model';
import {
  FuelDriverOption,
  FuelEntryLookupDto,
  FuelEntryMisRow,
  FuelEntryMisSearchCriteria,
  FuelLookupItem,
} from '../fuelEntry.model';
import { FuelEntryService } from '../fuelEntry.service';

@Component({
  standalone: false,
  selector: 'app-fuel-entry-mis',
  templateUrl: './fuelEntryMIS.component.html',
  styleUrls: ['./fuelEntryMIS.component.sass'],
})
export class FuelEntryMISComponent implements OnInit {
  lookups: FuelEntryLookupDto = {};
  locations: OrganizationalEntityDropDown[] = [];

  fromDate = '';
  toDate = '';
  locationID: number | null = null;
  statusCode = '';
  fuelTypeID: number | null = null;
  fuelPetrolPumpID: number | null = null;
  driverName = '';

  carCtrl = new FormControl('');
  carOptions: InventoryDropDown[] = [];
  filteredCarOptions: Observable<InventoryDropDown[]>;

  driverCtrl = new FormControl('');
  filteredDriverOptions: Observable<FuelDriverOption[]>;

  rows: FuelEntryMisRow[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 50;
  isSearching = false;
  isExporting = false;
  hasSearched = false;

  displayedColumns = [
    'serialNo',
    'carNo',
    'carName',
    'location',
    'ownSupplied',
    'vendorName',
    'vendorID',
    'fuelType',
    'requiredAverage',
    'previousMeter',
    'slipDate',
    'slipTime',
    'fuelSlipNo',
    'currentMeter',
    'quantity',
    'amount',
    'eligibleFuelInLitre',
    'givenAverage',
    'driverType',
    'driver',
    'driverCode',
    'shortageExcessLitres',
    'perLitreRate',
    'shortageAmount',
    'driverChargeStatus',
    'fuelSlipNoStatus',
    'invalidCount',
    'petrolPump',
    'billNo',
    'remark',
    'status',
  ];

  columnTitleMap: Record<string, string> = {
    serialNo: 'Sl No',
    carNo: 'Car No',
    carName: 'Car Name',
    location: 'Location',
    ownSupplied: 'Own/Supplied',
    vendorName: 'Vendor Name',
    vendorID: 'Vendor ID',
    fuelType: 'Fuel Type',
    requiredAverage: 'Required Average',
    previousMeter: 'Previous Meter',
    slipDate: 'Slip Date',
    slipTime: 'Slip Time',
    fuelSlipNo: 'Fuel Slip No',
    currentMeter: 'Current Meter',
    quantity: 'Quantity',
    amount: 'Amount',
    eligibleFuelInLitre: 'Eligible Fuel in Litre',
    givenAverage: 'Given Average',
    driverType: 'Driver Type',
    driver: 'Driver',
    driverCode: 'Driver Code',
    shortageExcessLitres: 'Shortage / Excess (Litres)',
    perLitreRate: 'Per Litre Rate',
    shortageAmount: 'Debit / Credit Amount',
    driverChargeStatus: 'Driver Charge',
    fuelSlipNoStatus: 'Fuel Slip No Status',
    invalidCount: 'Invalid Count',
    petrolPump: 'Petrol Pump',
    billNo: 'Bill No',
    remark: 'Remark',
    status: 'Status',
  };

  constructor(
    private fuelEntryService: FuelEntryService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadLocations();
    this.loadCarOptions('');
    this.filteredCarOptions = this.carCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCars(value || ''))
    );
    this.carCtrl.valueChanges.subscribe((value) => {
      if (typeof value === 'string' && value.trim().length >= 2) {
        this.loadCarOptions(value.trim());
      }
    });
    this.filteredDriverOptions = this.driverCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      switchMap((value) => {
        if (value && typeof value !== 'string') {
          return of([value as FuelDriverOption]);
        }
        const prefix = (value || '').trim();
        if (prefix.length < 1) {
          return of([]);
        }
        return this.fuelEntryService.getDrivers(prefix).pipe(catchError(() => of([])));
      })
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  lookupItems(key: string): FuelLookupItem[] {
    const pascal = key.charAt(0).toUpperCase() + key.slice(1);
    return (this.lookups as any)?.[key] || (this.lookups as any)?.[pascal] || [];
  }

  lookupId(item: FuelLookupItem): number {
    return item?.id ?? item?.Id ?? 0;
  }

  lookupName(item: FuelLookupItem): string {
    return item?.name ?? item?.Name ?? '';
  }

  lookupCode(item: FuelLookupItem): string {
    return item?.code ?? item?.Code ?? '';
  }

  carDisplay(item: InventoryDropDown): string {
    if (!item) return '';
    return (item.registrationNumber || (item as any).RegistrationNumber || '').toString();
  }

  carId(item: InventoryDropDown): number {
    return item?.inventoryID ?? (item as any)?.InventoryID ?? 0;
  }

  driverDisplay(driver: FuelDriverOption): string {
    if (!driver) return '';
    if (typeof driver === 'string') return driver;
    const name = (driver.driverName ?? driver.DriverName ?? '').trim();
    const officialId = (driver.driverOfficialIdentityNo ?? driver.DriverOfficialIdentityNo ?? '').trim();
    const mobile = (driver.driverMobile ?? driver.DriverMobile ?? '').trim();
    const idMobile = [officialId, mobile].filter(Boolean).join(' - ');
    if (name && idMobile) return `${name} (${idMobile})`;
    return name || idMobile;
  }

  driverId(driver: FuelDriverOption): number {
    return driver?.driverID ?? driver?.DriverID ?? 0;
  }

  private loadLookups(): void {
    this.fuelEntryService.getLookups().subscribe({
      next: (data) => (this.lookups = data || {}),
      error: () => this.snackBar.open('Failed to load fuel lookups.', '', { duration: 5000 }),
    });
  }

  private loadLocations(): void {
    this.generalService.GetLocationHub().subscribe({
      next: (data) => (this.locations = data || []),
      error: () => (this.locations = []),
    });
  }

  private loadCarOptions(prefix: string): void {
    this.generalService.GetRegNoDropDownForControlPanel(prefix || ' ').subscribe({
      next: (data) => (this.carOptions = (data || []).map((x) => new InventoryDropDown(x))),
      error: () => (this.carOptions = []),
    });
  }

  private filterCars(value: any): InventoryDropDown[] {
    const text = (typeof value === 'string' ? value : this.carDisplay(value)).toLowerCase().trim();
    if (!text) return this.carOptions || [];
    return (this.carOptions || []).filter((c) => this.carDisplay(c).toLowerCase().includes(text));
  }

  private buildCriteria(exportAll = false): FuelEntryMisSearchCriteria {
    const carValue = this.carCtrl.value;
    let inventoryID: number | undefined;
    let registrationNumber: string | undefined;
    if (carValue && typeof carValue !== 'string') {
      inventoryID = this.carId(carValue) || undefined;
      registrationNumber = this.carDisplay(carValue) || undefined;
    } else if ((carValue || '').trim()) {
      registrationNumber = (carValue || '').trim();
    }

    const driverValue = this.driverCtrl.value;
    let driverID: number | undefined;
    let driverName: string | undefined;
    if (driverValue && typeof driverValue !== 'string') {
      driverID = this.driverId(driverValue) || undefined;
      driverName = this.driverDisplay(driverValue) || undefined;
    } else if ((driverValue || '').trim()) {
      driverName = (driverValue || '').trim();
    } else if ((this.driverName || '').trim()) {
      driverName = this.driverName.trim();
    }

    return {
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
      inventoryID,
      registrationNumber,
      driverID,
      driverName,
      fuelPetrolPumpID: this.fuelPetrolPumpID || undefined,
      fuelTypeID: this.fuelTypeID || undefined,
      locationID: this.locationID || undefined,
      statusCode: this.statusCode || undefined,
      pageNumber: exportAll ? 1 : this.pageNumber,
      pageSize: exportAll ? 50000 : this.pageSize,
      exportAll,
    };
  }

  private formatDate(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  private asText(value: any): string {
    if (value == null || value === '') return '';
    return String(value).trim();
  }

  private formatTime(value: any): string {
    if (value == null || value === '') return '';
    if (typeof value === 'object') {
      const hours = value.hours ?? value.Hours;
      const minutes = value.minutes ?? value.Minutes;
      if (hours != null && minutes != null) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      const ticks = value.ticks ?? value.Ticks;
      if (typeof ticks === 'number') {
        const totalMinutes = Math.floor(ticks / 600000000);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      }
      return '';
    }
    const text = String(value).trim();
    const match = text.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }
    return text.length >= 5 ? text.substring(0, 5) : text;
  }

  private mapRow(row: any, index: number, offset: number): FuelEntryMisRow {
    const rawBillDate = row.billDate ?? row.BillDate;
    const rawSlipDate = row.slipDate ?? row.SlipDate;
    const rawSlipTime = row.slipTime ?? row.SlipTime;
    const vendorId = row.vendorID ?? row.VendorID;

    return {
      serialNo: row.serialNo ?? row.SerialNo ?? offset + index + 1,
      fuelEntryID: row.fuelEntryID ?? row.FuelEntryID,
      carNo: row.carNo ?? row.CarNo ?? '',
      carName: row.carName ?? row.CarName ?? '',
      location: row.location ?? row.Location ?? '',
      ownSupplied: row.ownSupplied ?? row.OwnSupplied ?? '',
      vendorName: row.vendorName ?? row.VendorName ?? '',
      vendorID: this.asText(vendorId),
      fuelType: row.fuelType ?? row.FuelType ?? '',
      requiredAverage: row.requiredAverage ?? row.RequiredAverage,
      previousMeter: row.previousMeter ?? row.PreviousMeter ?? row.lastOdometer ?? row.LastOdometer,
      billDate: this.formatDate(rawBillDate),
      slipDate: this.formatDate(rawSlipDate),
      slipTime: this.formatTime(rawSlipTime),
      fuelSlipNo: row.fuelSlipNo ?? row.FuelSlipNo ?? '',
      currentMeter: row.currentMeter ?? row.CurrentMeter ?? row.meterReading ?? row.MeterReading,
      quantity: row.quantity ?? row.Quantity,
      amount: row.amount ?? row.Amount,
      eligibleFuelInLitre: row.eligibleFuelInLitre ?? row.EligibleFuelInLitre,
      givenAverage: row.givenAverage ?? row.GivenAverage,
      driverType: row.driverType ?? row.DriverType ?? row.driverEntryStatus ?? row.DriverEntryStatus ?? '',
      driver: row.driver ?? row.Driver ?? '',
      driverCode: this.asText(row.driverCode ?? row.DriverCode),
      shortageExcessLitres: row.shortageExcessLitres ?? row.ShortageExcessLitres,
      perLitreRate: row.perLitreRate ?? row.PerLitreRate,
      shortageAmount: row.shortageAmount ?? row.ShortageAmount,
      driverChargeStatus: row.driverChargeStatus ?? row.DriverChargeStatus ?? '',
      fuelSlipNoStatus: row.fuelSlipNoStatus ?? row.FuelSlipNoStatus ?? '',
      invalidCount: row.invalidCount ?? row.InvalidCount ?? 0,
      petrolPump: row.petrolPump ?? row.PetrolPump ?? '',
      billNo: row.billNo ?? row.BillNo ?? '',
      remark: row.remark ?? row.Remark ?? '',
      status: row.status ?? row.Status ?? '',
    };
  }

  search(): void {
    this.pageNumber = 1;
    this.loadRows();
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.locationID = null;
    this.statusCode = '';
    this.fuelTypeID = null;
    this.fuelPetrolPumpID = null;
    this.driverName = '';
    this.carCtrl.setValue('');
    this.driverCtrl.setValue('');
    this.rows = [];
    this.totalCount = 0;
    this.hasSearched = false;
  }

  loadRows(): void {
    this.isSearching = true;
    this.fuelEntryService
      .misSearch(this.buildCriteria(false))
      .pipe(finalize(() => (this.isSearching = false)))
      .subscribe({
        next: (result) => {
          this.hasSearched = true;
          const rawRows = result?.rows ?? result?.Rows ?? [];
          const offset = ((result?.pageNumber ?? result?.PageNumber ?? this.pageNumber) - 1) * this.pageSize;
          this.rows = rawRows.map((row, index) => this.mapRow(row, index, offset));
          this.totalCount = result?.totalCount ?? result?.TotalCount ?? 0;
          this.pageNumber = result?.pageNumber ?? result?.PageNumber ?? this.pageNumber;
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to load fuel entry MIS.', '', { duration: 6000 });
        },
      });
  }

  prevPage(): void {
    if (this.pageNumber <= 1) return;
    this.pageNumber--;
    this.loadRows();
  }

  nextPage(): void {
    if (this.pageNumber >= this.totalPages) return;
    this.pageNumber++;
    this.loadRows();
  }

  exportExcel(): void {
    if (!this.hasSearched) {
      this.snackBar.open('Run a search before exporting.', '', { duration: 4000 });
      return;
    }
    this.isExporting = true;
    this.fuelEntryService
      .misSearch(this.buildCriteria(true))
      .pipe(finalize(() => (this.isExporting = false)))
      .subscribe({
        next: (result) => {
          const rawRows = result?.rows ?? result?.Rows ?? [];
          const exportRows = rawRows.map((row, index) => {
            const mapped = this.mapRow(row, index, 0);
            const flat: Record<string, any> = {};
            this.displayedColumns.forEach((col) => {
              flat[this.columnTitleMap[col] || col] = this.displayValue(mapped, col, true);
            });
            return flat;
          });
          if (!exportRows.length) {
            this.snackBar.open('No data to export for current filters.', '', { duration: 4000 });
            return;
          }
          const label = `${this.fromDate || 'all'}_${this.toDate || 'all'}`.replace(/[^\w-]+/g, '_');
          TableExportUtil.exportToExcel(exportRows, `FuelEntryMIS_${label}`);
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Export failed.', '', { duration: 6000 });
        },
      });
  }

  displayValue(row: FuelEntryMisRow, col: string, forExport = false): any {
    const value = row?.[col];
    if (value == null || value === '') {
      return forExport ? '' : '—';
    }
    return value;
  }
}
