// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin, of } from 'rxjs';
import { map, startWith, finalize, switchMap, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GeneralService } from '../../general/general.service';
import { InventoryDropDown } from '../../inventory/inventoryDropDown.model';
import {
  FuelEntryDetailDto,
  FuelEntryDocumentDto,
  FuelEntryLookupDto,
  FuelEntrySaveRequest,
  FuelEntryVehicleContextDto,
  FuelLookupItem,
  FuelDriverOption,
} from '../fuelEntry.model';
import { FuelEntryService } from '../fuelEntry.service';
import { OdometerResetService } from '../odometerReset.service';
import { OdometerResetContextDto, OdometerResetDto, OdometerResetSaveRequest } from '../fuelEntry.model';

@Component({
  standalone: false,
  selector: 'app-fuel-entry-manual',
  templateUrl: './fuelEntryManual.component.html',
  styleUrls: ['./fuelEntryManual.component.sass'],
})
export class FuelEntryManualComponent implements OnInit, OnDestroy {
  lookups: FuelEntryLookupDto = {};
  fuelEntryId: number | null = null;
  fuelEntryNumber = '';
  statusName = '';
  statusCode = '';
  isEditable = true;
  isSaving = false;
  isSearching = false;
  isLoadingEntry = false;
  showManualEntryReasonSection = false;

  carCtrl = new FormControl('');
  carOptions: InventoryDropDown[] = [];
  filteredCarOptions: Observable<InventoryDropDown[]>;

  driverCtrl = new FormControl('');
  filteredDriverOptions: Observable<FuelDriverOption[]>;

  inventoryID = 0;
  supplierName = '';
  vehicleCategory = '';
  vehicleName = '';
  locationName = '';
  supplierID: number | null = null;
  driverID: number | null = null;
  locationID: number | null = null;

  fuelDate = '';
  fuelTime = '';
  fuelSlipNo = '';
  otherThanDriver = '';
  fuelCardNo = '';
  currentMeter: number | null = null;
  fuelQuantity: number | null = null;
  amount: number | null = null;
  fuelTypeID: number | null = null;
  fuelTypeName = '';
  fuelPayModeID: number | null = null;
  fuelManualEntryReasonID: number | null = null;
  remarks = '';
  averageMileage: number | null = null;

  previousMeter: number | null = null;
  currentAverage: number | null = null;
  eligibility: number | null = null;
  fuelShortage: number | null = null;
  fuelRate: number | null = null;
  shortageAmount: number | null = null;

  private calculationPreviewTimer: any = null;

  fuelSlipDoc: FuelEntryDocumentDto | null = null;
  odometerDoc: FuelEntryDocumentDto | null = null;
  fuelSlipPreviewUrl: string | null = null;
  odometerPreviewUrl: string | null = null;
  private pendingFuelSlipFile: File | null = null;
  private pendingOdometerFile: File | null = null;

  searchSlipNo = '';
  searchFuelDate = '';
  searchCarCtrl = new FormControl('');
  filteredSearchCarOptions: Observable<InventoryDropDown[]>;
  showSearchPanel = false;
  showOdometerResetDialog = false;
  isSavingOdometerReset = false;
  isLoadingOdometerResetList = false;
  odometerResetContext: OdometerResetContextDto | null = null;
  odometerResetList: OdometerResetDto[] = [];
  editingOdometerResetId: number | null = null;
  odometerResetCreatedDisplay = '';
  odometerResetCreatedByDisplay = '';
  odometerResetByDisplay = '';
  odometerResetCanEditForm = true;
  odometerResetCanDeleteForm = false;
  odometerResetHasPostResetEntries = false;

  canResetOdometer = false;
  canDeleteFuelEntry = false;
  canFindFuelEntry = false;

  odometerCarCtrl = new FormControl('');
  odometerCarOptions: InventoryDropDown[] = [];
  filteredOdometerCarOptions: Observable<InventoryDropDown[]>;
  odometerInventoryID = 0;
  odometerResetDate = '';
  odometerResetTime = '';
  odometerNewReading: number | null = null;
  odometerResetReasonID: number | null = null;
  isFirstEntryAfterReset = false;

  validationErrors = new Set<string>();

  constructor(
    private fuelEntryService: FuelEntryService,
    private odometerResetService: OdometerResetService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.canResetOdometer = this.generalService.canResetOdometer();
    this.canDeleteFuelEntry = this.generalService.canDeleteFuelEntry();
    this.canFindFuelEntry = this.generalService.canFindFuelEntry();
    this.loadLookups();
    this.loadCarOptions('');
    this.filteredCarOptions = this.carCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCars(value || ''))
    );
    this.filteredSearchCarOptions = this.searchCarCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCars(value || ''))
    );
    this.filteredDriverOptions = this.driverCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged((a, b) => this.driverSearchText(a) === this.driverSearchText(b)),
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
    this.carCtrl.valueChanges.subscribe((value) => {
      if (typeof value === 'string' && value.trim().length >= 2) {
        this.loadCarOptions(value.trim());
      }
    });
    this.searchCarCtrl.valueChanges.subscribe((value) => {
      if (typeof value === 'string' && value.trim().length >= 2) {
        this.loadCarOptions(value.trim());
      }
    });
    this.driverCtrl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.driverID = null;
      } else if (value && typeof value === 'object') {
        this.driverID = this.driverId(value) || null;
      } else {
        this.driverID = null;
      }
    });
    this.loadOdometerCarOptions('');
    this.filteredOdometerCarOptions = this.odometerCarCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOdometerCars(value || ''))
    );
    this.odometerCarCtrl.valueChanges.subscribe((value) => {
      if (typeof value === 'string' && value.trim().length >= 2) {
        this.loadOdometerCarOptions(value.trim());
      }
      if (value && typeof value === 'object') {
        this.applyOdometerCarSelection(value);
      } else if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) {
          this.clearOdometerCarSelection();
          return;
        }
        const match = this.findOdometerCarByRegistration(trimmed);
        if (match) {
          this.applyOdometerCarSelection(match);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.revokePreviewUrls();
  }

  get performedBy(): number {
    return this.generalService.getUserID();
  }

  get remarksLength(): number {
    return (this.remarks || '').length;
  }

  get canEdit(): boolean {
    return this.isEditable && this.statusCode !== 'Verified' && this.statusCode !== 'Rejected';
  }

  get statusBadgeClass(): string {
    switch (this.statusCode) {
      case 'Verified':
        return 'status-verified';
      case 'PendingVerification':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      case 'Hold':
        return 'status-hold';
      case 'Draft':
      default:
        return 'status-draft';
    }
  }

  get vehicleSelected(): boolean {
    return this.inventoryID > 0;
  }

  toggleSearchPanel(): void {
    if (!this.canFindFuelEntry) {
      this.snackBar.open('You do not have permission to search fuel entries.', '', { duration: 4000 });
      return;
    }
    this.showSearchPanel = !this.showSearchPanel;
  }

  openOdometerResetDialog(): void {
    if (!this.canResetOdometer) {
      this.snackBar.open(
        'You do not have permission to reset odometer. Enable "Can Reset Odometer" on your role (Admin → Role), then log out and log in again.',
        '',
        { duration: 8000 }
      );
      return;
    }
    this.editingOdometerResetId = null;
    this.odometerResetList = [];
    this.odometerResetContext = null;
    this.odometerResetCreatedDisplay = '';
    this.odometerResetCreatedByDisplay = '';
    this.odometerResetByDisplay = '';
    this.odometerResetCanEditForm = true;
    this.odometerResetCanDeleteForm = false;
    this.odometerResetHasPostResetEntries = false;
    this.applyDefaultOdometerResetDateTime();
    this.odometerNewReading = null;
    this.odometerResetReasonID = null;
    if (this.inventoryID > 0 && this.carCtrl.value) {
      this.odometerInventoryID = this.inventoryID;
      this.odometerCarCtrl.setValue(this.carCtrl.value, { emitEvent: false });
      this.loadOdometerResetContext();
      this.loadOdometerResetList();
    } else {
      this.odometerInventoryID = 0;
      this.odometerCarCtrl.setValue('');
    }
    this.showOdometerResetDialog = true;
  }

  closeOdometerResetDialog(): void {
    this.showOdometerResetDialog = false;
    this.editingOdometerResetId = null;
  }

  get isEditingOdometerReset(): boolean {
    return !!this.editingOdometerResetId;
  }

  get odometerResetDialogTitle(): string {
    return this.isEditingOdometerReset ? 'Edit Odometer Reset' : 'New Odometer Reset';
  }

  get odometerResetMinDate(): string {
    const latest =
      this.odometerResetContext?.latestFuelEntryDate ?? this.odometerResetContext?.LatestFuelEntryDate;
    return latest ? String(latest).substring(0, 10) : '';
  }

  get odometerResetDateRangeInvalid(): boolean {
    const min = this.odometerResetMinDate;
    return !!(min && min > this.todayIso());
  }

  initOdometerResetForm(): void {
    this.editingOdometerResetId = null;
    this.odometerNewReading = null;
    this.odometerResetReasonID = null;
    this.odometerResetCreatedDisplay = '';
    this.odometerResetCreatedByDisplay = '';
    this.odometerResetByDisplay = '';
    this.odometerResetCanEditForm = true;
    this.odometerResetCanDeleteForm = false;
    this.odometerResetHasPostResetEntries = false;
    this.applyDefaultOdometerResetDateTime();
  }

  private applyDefaultOdometerResetDateTime(): void {
    const latest =
      this.odometerResetContext?.latestFuelEntryDate ?? this.odometerResetContext?.LatestFuelEntryDate;
    const latestTime =
      this.odometerResetContext?.latestFuelEntryTime ?? this.odometerResetContext?.LatestFuelEntryTime;
    const latestIso = latest ? String(latest).substring(0, 10) : '';

    this.odometerResetDate = this.todayIso();
    this.odometerResetTime = this.resolveDefaultOdometerResetTime(latestIso, latestTime);
  }

  onOdometerResetDateChange(): void {
    const today = this.todayIso();
    const latestIso = this.odometerResetMinDate;
    const latestTime =
      this.odometerResetContext?.latestFuelEntryTime ?? this.odometerResetContext?.LatestFuelEntryTime;
    if (!this.odometerResetDate) {
      return;
    }
    if (this.odometerResetDate > today) {
      this.odometerResetDate = today;
    }
    if (latestIso && this.odometerResetDate < latestIso) {
      this.odometerResetDate = latestIso;
    }
    this.odometerResetTime = this.resolveDefaultOdometerResetTime(latestIso, latestTime);
  }

  private resolveDefaultOdometerResetTime(latestIso: string, latestTime: string | null | undefined): string {
    const today = this.todayIso();
    if (this.odometerResetDate === today) {
      return this.nowTimeInput();
    }
    if (latestIso && this.odometerResetDate === latestIso && latestTime) {
      return this.addMinutesToTimeInput(String(latestTime), 1);
    }
    return '00:01';
  }

  /** @deprecated use initOdometerResetForm */
  newOdometerReset(): void {
    this.initOdometerResetForm();
  }

  editOdometerReset(row: OdometerResetDto): void {
    const resetId = this.resetRowId(row);
    if (!resetId || !this.performedBy) {
      return;
    }
    this.isSavingOdometerReset = true;
    this.odometerResetService
      .getById(resetId, this.performedBy)
      .pipe(finalize(() => (this.isSavingOdometerReset = false)))
      .subscribe({
        next: (detail) => this.applyOdometerResetDetail(detail),
        error: (err) => {
          this.snackBar.open(this.extractHttpErrorMessage(err, 'Failed to load odometer reset.'), '', { duration: 5000 });
        },
      });
  }

  deleteOdometerReset(row?: OdometerResetDto): void {
    const resetId = row ? this.resetRowId(row) : this.editingOdometerResetId;
    if (!resetId || !this.performedBy) {
      return;
    }
    if (!confirm('Delete this odometer reset?')) {
      return;
    }
    this.isSavingOdometerReset = true;
    this.odometerResetService
      .delete(resetId, this.performedBy)
      .pipe(finalize(() => (this.isSavingOdometerReset = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Odometer reset deleted.', '', { duration: 4000 });
          this.initOdometerResetForm();
          this.loadOdometerResetList();
          this.loadOdometerResetContext();
        },
        error: (err) => {
          this.snackBar.open(this.extractHttpErrorMessage(err, 'Failed to delete odometer reset.'), '', { duration: 6000 });
        },
      });
  }

  resetRowId(row: OdometerResetDto): number {
    return row?.resetID ?? row?.ResetID ?? 0;
  }

  resetRowDate(row: OdometerResetDto): string {
    const value = row?.resetDate ?? row?.ResetDate;
    return value ? String(value).substring(0, 10) : '';
  }

  resetRowTime(row: OdometerResetDto): string {
    const value = row?.resetTime ?? row?.ResetTime;
    return value ? String(value).substring(0, 5) : '';
  }

  resetRowReading(row: OdometerResetDto): number | null {
    const value = row?.newOdometerReading ?? row?.NewOdometerReading;
    return value == null ? null : Number(value);
  }

  resetRowReason(row: OdometerResetDto): string {
    return (row?.reason ?? row?.Reason ?? '').trim();
  }

  resetRowByName(row: OdometerResetDto): string {
    return (row?.resetByName ?? row?.ResetByName ?? '').trim();
  }

  resetRowCanEdit(row: OdometerResetDto): boolean {
    return row?.canEdit ?? row?.CanEdit ?? true;
  }

  resetRowCanDelete(row: OdometerResetDto): boolean {
    return row?.canDelete ?? row?.CanDelete ?? false;
  }

  isSelectedOdometerReset(row: OdometerResetDto): boolean {
    return this.resetRowId(row) > 0 && this.resetRowId(row) === this.editingOdometerResetId;
  }

  private applyOdometerResetDetail(detail: OdometerResetDto): void {
    if (!detail) {
      return;
    }
    this.editingOdometerResetId = detail.resetID ?? detail.ResetID ?? null;
    this.odometerInventoryID = detail.inventoryID ?? detail.InventoryID ?? this.odometerInventoryID;
    this.odometerResetDate = this.resetRowDate(detail);
    this.odometerResetTime = this.resetRowTime(detail) || this.nowTimeInput();
    this.odometerNewReading = this.resetRowReading(detail);
    this.odometerResetReasonID =
      detail.odometerResetReasonID ?? detail.OdometerResetReasonID ?? null;
    this.odometerResetCanEditForm = detail.canEdit ?? detail.CanEdit ?? true;
    this.odometerResetCanDeleteForm = detail.canDelete ?? detail.CanDelete ?? false;
    this.odometerResetHasPostResetEntries =
      detail.hasPostResetFuelEntries ?? detail.HasPostResetFuelEntries ?? false;
    const created = detail.createdDate ?? detail.CreatedDate;
    this.odometerResetCreatedDisplay = created ? this.formatDateTimeDisplay(created) : '';
    this.odometerResetCreatedByDisplay =
      (detail.createdByName ?? detail.CreatedByName ?? '').trim() || '—';
    this.odometerResetByDisplay =
      (detail.resetByName ?? detail.ResetByName ?? this.resetByDisplayName).trim() || this.resetByDisplayName;
  }

  private loadOdometerResetList(): void {
    if (!this.odometerInventoryID || !this.performedBy) {
      this.odometerResetList = [];
      return;
    }
    this.isLoadingOdometerResetList = true;
    this.odometerResetService
      .getByVehicle(this.odometerInventoryID, this.performedBy)
      .pipe(finalize(() => (this.isLoadingOdometerResetList = false)))
      .subscribe({
        next: (rows) => {
          this.odometerResetList = rows || [];
        },
        error: (err) => {
          this.odometerResetList = [];
          this.snackBar.open(this.extractHttpErrorMessage(err, 'Failed to load odometer resets.'), '', { duration: 5000 });
        },
      });
  }

  get resetByDisplayName(): string {
    return this.generalService.getUserName() || 'Current user';
  }

  get latestCurrentMeterDisplay(): string {
    const value =
      this.odometerResetContext?.latestCurrentMeter ?? this.odometerResetContext?.LatestCurrentMeter;
    return value == null ? '—' : String(value);
  }

  private loadOdometerCarOptions(prefix: string): void {
    this.generalService.GetRegNoDropDownForControlPanel(prefix || ' ').subscribe({
      next: (data) => {
        this.odometerCarOptions = (data || []).map((x) => new InventoryDropDown(x));
      },
      error: () => {
        this.odometerCarOptions = [];
      },
    });
  }

  private filterOdometerCars(value: any): InventoryDropDown[] {
    const text = (typeof value === 'string' ? value : this.carDisplay(value)).toLowerCase().trim();
    if (!text) return this.odometerCarOptions || [];
    return (this.odometerCarOptions || []).filter((c) =>
      this.carDisplay(c).toLowerCase().includes(text)
    );
  }

  private loadOdometerResetContext(skipFormInit = false): void {
    if (!this.odometerInventoryID || !this.performedBy) {
      return;
    }
    this.odometerResetService.getContext(this.odometerInventoryID, this.performedBy).subscribe({
      next: (ctx) => {
        this.odometerResetContext = ctx || null;
        if (!skipFormInit && !this.editingOdometerResetId && this.showOdometerResetDialog) {
          this.initOdometerResetForm();
        }
      },
      error: (err) => {
        this.snackBar.open(this.extractHttpErrorMessage(err, 'Failed to load vehicle reset context.'), '', { duration: 5000 });
      },
    });
  }

  saveOdometerReset(): void {
    if (!this.canResetOdometer) {
      this.snackBar.open('You do not have permission to reset odometer.', '', { duration: 5000 });
      return;
    }
    if (!this.performedBy) {
      this.snackBar.open('Unable to identify the current user. Please log in again.', '', { duration: 5000 });
      return;
    }
    if (!this.odometerResetCanEditForm) {
      this.snackBar.open('This odometer reset cannot be edited.', '', { duration: 4000 });
      return;
    }
    if (!this.odometerInventoryID) {
      this.snackBar.open('Car is required.', '', { duration: 4000 });
      return;
    }
    if (!this.odometerResetDate) {
      this.snackBar.open('Reset date is required.', '', { duration: 4000 });
      return;
    }
    if (!this.odometerResetTime) {
      this.snackBar.open('Reset time is required.', '', { duration: 4000 });
      return;
    }
    const dateTimeError = this.validateOdometerResetDateTime();
    if (dateTimeError) {
      this.snackBar.open(dateTimeError, '', { duration: 6000 });
      return;
    }
    if (this.odometerNewReading == null || this.odometerNewReading < 0) {
      this.snackBar.open('New odometer reading must be zero or greater.', '', { duration: 4000 });
      return;
    }
    if (!this.odometerResetReasonID) {
      this.snackBar.open('Reason for reset is required.', '', { duration: 4000 });
      return;
    }

    const isUpdate = this.isEditingOdometerReset;
    const confirmMessage = isUpdate
      ? 'Save changes to this odometer reset?\n\nFuel calculations for entries after the reset date may be recalculated.'
      : 'You are about to reset the odometer for this vehicle.\n\n' +
        'All future fuel calculations will begin from the new odometer reading.\n\n' +
        'This action cannot be undone after subsequent fuel entries have been recorded.\n\n' +
        'Do you wish to continue?';
    if (!confirm(confirmMessage)) {
      return;
    }

    const request: OdometerResetSaveRequest = {
      inventoryID: this.odometerInventoryID,
      resetDate: this.odometerResetDate,
      resetTime: this.normalizeResetTime(this.odometerResetTime),
      newOdometerReading: Number(this.odometerNewReading),
      odometerResetReasonID: Number(this.odometerResetReasonID),
    };

    this.isSavingOdometerReset = true;
    const save$ = isUpdate
      ? this.odometerResetService.update(this.editingOdometerResetId, this.performedBy, request)
      : this.odometerResetService.create(this.performedBy, request);

    save$
      .pipe(finalize(() => (this.isSavingOdometerReset = false)))
      .subscribe({
        next: (saved) => {
          this.snackBar.open(isUpdate ? 'Odometer reset updated.' : 'Odometer reset saved.', '', { duration: 4000 });
          if (saved) {
            this.applyOdometerResetDetail(saved);
          }
          this.loadOdometerResetList();
          this.loadOdometerResetContext(true);
        },
        error: (err) => {
          this.snackBar.open(this.extractHttpErrorMessage(err, 'Failed to save odometer reset.'), '', { duration: 6000 });
        },
      });
  }

  private formatDateTimeDisplay(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleString();
  }

  calcValueClass(value: number | null): string {
    if (value == null) return '';
    if (value < 0) return 'calc-negative';
    if (value > 0) return 'calc-positive';
    return '';
  }

  loadLookups(): void {
    this.fuelEntryService.getLookups().subscribe({
      next: (data) => {
        this.lookups = data || {};
      },
      error: () => {
        this.snackBar.open('Failed to load fuel entry lookups. Run FuelManagement SQL scripts.', '', { duration: 8000 });
      },
    });
  }

  private loadCarOptions(prefix: string): void {
    this.generalService.GetRegNoDropDownForControlPanel(prefix || ' ').subscribe({
      next: (data) => {
        this.carOptions = (data || []).map((x) => new InventoryDropDown(x));
      },
      error: () => {
        this.carOptions = [];
      },
    });
  }

  private filterCars(value: any): InventoryDropDown[] {
    const text = (typeof value === 'string' ? value : this.carDisplay(value))
      .toLowerCase()
      .trim();
    if (!text) return this.carOptions || [];
    return (this.carOptions || []).filter((c) =>
      this.carDisplay(c).toLowerCase().includes(text)
    );
  }

  private driverSearchText(value: any): string {
    return (typeof value === 'string' ? value : this.driverDisplay(value)).trim().toLowerCase();
  }

  driverDisplay(driver: FuelDriverOption): string {
    if (!driver) return '';
    if (typeof driver === 'string') return driver;
    const name = (driver.driverName ?? driver.DriverName ?? '').trim();
    const officialId = (driver.driverOfficialIdentityNo ?? driver.DriverOfficialIdentityNo ?? '').trim();
    const mobile = (driver.driverMobile ?? driver.DriverMobile ?? '').trim();
    const idMobile = [officialId, mobile].filter(Boolean).join(' - ');
    if (name && idMobile) return `${name} (${idMobile})`;
    if (name) return name;
    return idMobile;
  }

  driverId(driver: FuelDriverOption): number {
    return driver?.driverID ?? driver?.DriverID ?? 0;
  }

  private getSelectedDriverId(): number {
    const value = this.driverCtrl.value;
    if (value && typeof value !== 'string') {
      return this.driverId(value);
    }
    return 0;
  }

  get hasDriverSelected(): boolean {
    return this.getSelectedDriverId() > 0;
  }

  onDriverSelected(driver: FuelDriverOption): void {
    if (!driver) return;
    this.driverID = this.driverId(driver) || null;
    this.otherThanDriver = '';
    this.scheduleCalculationPreview();
  }

  onOtherThanDriverInput(): void {
    if ((this.otherThanDriver || '').trim()) {
      this.driverID = null;
      this.driverCtrl.setValue('');
    }
  }

  onCalculationInputChange(): void {
    this.refreshClientCalculations();
    this.scheduleCalculationPreview();
  }

  private setDriverSelection(
    driverId: number | null,
    driverName: string,
    driverMobile: string,
    driverOfficialIdentityNo?: string
  ): void {
    if (driverId && (driverName || driverMobile || driverOfficialIdentityNo)) {
      this.driverID = driverId;
      const option: FuelDriverOption = {
        driverID: driverId,
        driverName,
        driverMobile,
        driverOfficialIdentityNo,
      };
      this.driverCtrl.setValue(option, { emitEvent: false });
    } else {
      this.driverID = null;
      this.driverCtrl.setValue('', { emitEvent: false });
    }
  }

  carDisplay(item: InventoryDropDown): string {
    if (!item) return '';
    return (item.registrationNumber || (item as any).RegistrationNumber || '').toString();
  }

  carId(item: InventoryDropDown): number {
    return item?.inventoryID ?? (item as any)?.InventoryID ?? 0;
  }

  onOdometerCarSelected(item: InventoryDropDown): void {
    if (!item) return;
    this.applyOdometerCarSelection(item);
  }

  onOdometerCarBlur(): void {
    if (this.odometerInventoryID > 0) {
      return;
    }
    const value = this.odometerCarCtrl.value;
    if (typeof value === 'string' && value.trim()) {
      const match = this.findOdometerCarByRegistration(value);
      if (match) {
        this.applyOdometerCarSelection(match);
      } else {
        this.resolveOdometerCarByRegistration(value);
      }
    }
  }

  private applyOdometerCarSelection(item: InventoryDropDown): void {
    this.odometerInventoryID = this.carId(item) || 0;
    if (!this.odometerInventoryID) {
      return;
    }
    this.odometerResetContext = null;
    this.editingOdometerResetId = null;
    this.loadOdometerResetContext();
    this.loadOdometerResetList();
  }

  private clearOdometerCarSelection(): void {
    this.odometerInventoryID = 0;
    this.odometerResetContext = null;
    this.odometerResetList = [];
    this.editingOdometerResetId = null;
  }

  private findOdometerCarByRegistration(text: string): InventoryDropDown | null {
    const needle = text.trim().toLowerCase();
    if (!needle) {
      return null;
    }
    return (
      (this.odometerCarOptions || []).find((c) => this.carDisplay(c).toLowerCase() === needle) || null
    );
  }

  private resolveOdometerCarByRegistration(registration: string): void {
    const reg = registration.trim();
    if (!reg) {
      return;
    }
    this.fuelEntryService.getVehicleContext(reg).subscribe({
      next: (ctx) => {
        const id = ctx?.inventoryID ?? ctx?.InventoryID ?? 0;
        if (!id) {
          return;
        }
        this.odometerInventoryID = id;
        this.editingOdometerResetId = null;
        this.odometerCarCtrl.setValue(reg, { emitEvent: false });
        this.loadOdometerResetContext();
        this.loadOdometerResetList();
      },
      error: () => {
        this.snackBar.open('Vehicle not found for registration number.', '', { duration: 4000 });
      },
    });
  }

  onCarSelected(item: InventoryDropDown): void {
    if (!item) return;
    this.clearFieldValidation('carNo');
    const regNo = this.carDisplay(item);
    if (!regNo) return;
    this.fuelEntryService.getVehicleContext(regNo).subscribe({
      next: (ctx) => this.applyVehicleContext(ctx),
      error: () => {
        this.snackBar.open('Vehicle not found for registration number.', '', { duration: 4000 });
      },
    });
  }

  private applyVehicleContext(ctx: FuelEntryVehicleContextDto): void {
    if (!ctx) return;
    this.inventoryID = ctx.inventoryID ?? ctx.InventoryID ?? 0;
    this.supplierID = ctx.supplierID ?? ctx.SupplierID ?? null;
    this.supplierName = ctx.supplierName ?? ctx.SupplierName ?? '';
    this.vehicleName = ctx.vehicleName ?? ctx.VehicleName ?? '';
    this.vehicleCategory = ctx.vehicleCategory ?? ctx.VehicleCategory ?? '';
    this.driverID = ctx.driverID ?? ctx.DriverID ?? null;
    this.setDriverSelection(
      this.driverID,
      ctx.driverName ?? ctx.DriverName ?? '',
      ctx.driverMobile ?? ctx.DriverMobile ?? '',
      ctx.driverOfficialIdentityNo ?? ctx.DriverOfficialIdentityNo ?? ''
    );
    this.locationID = ctx.locationID ?? ctx.LocationID ?? null;
    this.locationName = ctx.locationName ?? ctx.LocationName ?? '';
    this.fuelTypeID = ctx.fuelTypeID ?? ctx.FuelTypeID ?? null;
    this.fuelTypeName = ctx.fuelTypeName ?? ctx.FuelTypeName ?? '';
    this.averageMileage = ctx.averageMileage ?? ctx.AverageMileage ?? null;
    this.fuelCardNo = ctx.fuelCardNo ?? ctx.FuelCardNo ?? '';
    this.otherThanDriver = '';
    this.scheduleCalculationPreview();
  }

  newEntry(): void {
    this.validationErrors.clear();
    this.fuelEntryId = null;
    this.fuelEntryNumber = '';
    this.statusName = 'Draft';
    this.statusCode = 'Draft';
    this.isEditable = true;
    this.carCtrl.setValue('');
    this.driverCtrl.setValue('');
    this.inventoryID = 0;
    this.supplierID = null;
    this.driverID = null;
    this.locationID = null;
    this.supplierName = '';
    this.vehicleCategory = '';
    this.vehicleName = '';
    this.locationName = '';
    this.fuelDate = '';
    this.fuelTime = '';
    this.fuelSlipNo = '';
    this.otherThanDriver = '';
    this.fuelCardNo = '';
    this.currentMeter = null;
    this.fuelQuantity = null;
    this.amount = null;
    this.fuelTypeID = null;
    this.fuelTypeName = '';
    this.averageMileage = null;
    this.fuelPayModeID = null;
    this.fuelManualEntryReasonID = null;
    this.remarks = '';
    this.clearCalculated();
    this.clearDocuments();
    this.pendingFuelSlipFile = null;
    this.pendingOdometerFile = null;
  }

  saveAndSubmit(): void {
    this.submitEntry();
  }

  private submitEntry(): void {
    if (!this.performedBy) {
      this.snackBar.open('Unable to determine current user.', '', { duration: 4000 });
      return;
    }

    const submitRequest = this.buildSaveRequest(true);
    if (!submitRequest) return;

    this.isSaving = true;
    const persist$ = this.fuelEntryId
      ? this.fuelEntryService.update(this.fuelEntryId, this.performedBy, submitRequest)
      : this.createAndSubmitNewEntry(submitRequest);

    persist$
      .pipe(
        switchMap((detail) => {
          this.applyDetail(detail);
          if (this.fuelEntryId) {
            return this.uploadPendingFiles().pipe(map(() => detail));
          }
          return of(detail);
        }),
        finalize(() => (this.isSaving = false))
      )
      .subscribe({
        next: () => {
          const entryNo = (this.fuelEntryNumber || '').trim();
          this.newEntry();
          const message = entryNo
            ? `Fuel entry ${entryNo} submitted for verification.`
            : 'Fuel entry submitted for verification.';
          this.snackBar.open(message, '', { duration: 4000 });
        },
        error: (err) => {
          const msg = err?.error?.message || 'Failed to submit fuel entry.';
          this.snackBar.open(msg, '', { duration: 8000 });
        },
      });
  }

  private createAndSubmitNewEntry(submitRequest: FuelEntrySaveRequest): Observable<FuelEntryDetailDto> {
    const createRequest = { ...submitRequest, submitForVerification: false };
    return this.fuelEntryService.create(this.performedBy, createRequest).pipe(
      switchMap((detail) => {
        this.applyDetail(detail);
        return this.uploadPendingFiles().pipe(
          switchMap(() => this.fuelEntryService.update(this.fuelEntryId!, this.performedBy, submitRequest))
        );
      })
    );
  }

  onFuelTimeChanged(): void {
    this.clearFieldValidation('fuelTime');
    if (this.isFutureFuelDateTime(this.fuelDate, this.fuelTime)) {
      this.validationErrors.add('fuelTime');
    }
    this.onCalculationInputChange();
  }

  onFuelDateChanged(): void {
    this.clearFieldValidation('fuelDate');
    if (this.fuelTime && this.isFutureFuelDateTime(this.fuelDate, this.fuelTime)) {
      this.validationErrors.add('fuelTime');
    } else {
      this.clearFieldValidation('fuelTime');
    }
    this.onCalculationInputChange();
  }

  get maxFuelDate(): string {
    return this.todayIso();
  }

  get maxFuelTime(): string | null {
    return this.isTodayFuelDate(this.fuelDate) ? this.nowTimeInput() : null;
  }

  fuelTimeError(): string {
    if (!this.fieldInvalid('fuelTime')) return '';
    if (!(this.fuelTime || '').trim()) return 'Time of fueling is required.';
    if (this.isFutureFuelDateTime(this.fuelDate, this.fuelTime)) {
      return 'Future time is not allowed for today\'s date.';
    }
    return 'Invalid time of fueling.';
  }

  fuelDateError(): string {
    if (!this.fieldInvalid('fuelDate')) return '';
    if (!(this.fuelDate || '').trim()) return 'Date of fueling is required.';
    if (this.isFutureFuelDate(this.fuelDate)) return 'Future date is not allowed.';
    return 'Invalid date of fueling.';
  }

  fieldInvalid(field: string): boolean {
    return this.validationErrors.has(field);
  }

  clearFieldValidation(field: string): void {
    this.validationErrors.delete(field);
  }

  private validateAllFields(): boolean {
    this.validationErrors.clear();
    const errors: { field: string; message: string }[] = [];

    if (!this.inventoryID || this.inventoryID <= 0) {
      errors.push({ field: 'carNo', message: 'Car No. is required.' });
    }
    if (!(this.fuelDate || '').trim()) {
      errors.push({ field: 'fuelDate', message: 'Date of fueling is required.' });
    } else if (this.isFutureFuelDate(this.fuelDate)) {
      errors.push({ field: 'fuelDate', message: 'Future date is not allowed.' });
    }
    if (!(this.fuelTime || '').trim()) {
      errors.push({ field: 'fuelTime', message: 'Time of fueling is required.' });
    } else if (this.isFutureFuelDateTime(this.fuelDate, this.fuelTime)) {
      errors.push({ field: 'fuelTime', message: 'Future time is not allowed for today\'s date.' });
    }
    if (!(this.fuelSlipNo || '').trim()) {
      errors.push({ field: 'fuelSlipNo', message: 'Petrol slip number is required.' });
    }
    if (this.currentMeter == null) {
      errors.push({ field: 'currentMeter', message: 'Current meter (KM) is required.' });
    }
    if (this.fuelQuantity == null || this.fuelQuantity <= 0) {
      errors.push({ field: 'fuelQuantity', message: 'Fuel quantity must be greater than zero.' });
    }
    if (this.amount == null || this.amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than zero.' });
    }

    const otherDriver = (this.otherThanDriver || '').trim();
    const selectedDriverId = this.getSelectedDriverId();
    if (!selectedDriverId && !otherDriver) {
      errors.push({ field: 'driver', message: 'Either driver or other than driver name is required.' });
      errors.push({ field: 'otherThanDriver', message: 'Either driver or other than driver name is required.' });
    }

    if (this.previousMeter != null && this.currentMeter != null && this.currentMeter < this.previousMeter) {
      errors.push({ field: 'currentMeter', message: 'Current meter cannot be less than previous meter.' });
    }

    errors.forEach((e) => this.validationErrors.add(e.field));
    if (errors.length) {
      this.snackBar.open(errors[0].message, '', { duration: 5000 });
      return false;
    }
    return true;
  }

  private buildSaveRequest(submitForVerification: boolean): FuelEntrySaveRequest | null {
    if (!this.validateAllFields()) {
      return null;
    }

    const otherDriver = (this.otherThanDriver || '').trim();
    const selectedDriverId = otherDriver ? 0 : this.getSelectedDriverId();
    const fueledByName = otherDriver || this.resolveFueledByName();

    return {
      inventoryID: this.inventoryID,
      supplierID: this.supplierID || undefined,
      driverID: selectedDriverId > 0 ? selectedDriverId : null,
      locationID: this.locationID || undefined,
      fuelTypeID: this.fuelTypeID || undefined,
      fuelPayModeID: this.fuelPayModeID || undefined,
      fuelDate: this.fuelDate,
      fuelTime: this.fuelTime,
      fuelSlipNo: (this.fuelSlipNo || '').trim(),
      fueledByName,
      fuelCardNo: (this.fuelCardNo || '').trim() || undefined,
      currentMeter: this.currentMeter,
      fuelQuantity: this.fuelQuantity,
      amount: this.amount,
      fuelManualEntryReasonID: this.fuelManualEntryReasonID || undefined,
      remarks: (this.remarks || '').trim() || undefined,
      submitForVerification,
    };
  }

  private resolveFueledByName(): string {
    const value = this.driverCtrl.value;
    if (value && typeof value !== 'string') {
      const name = (value.driverName ?? value.DriverName ?? '').trim();
      const mobile = (value.driverMobile ?? value.DriverMobile ?? '').trim();
      if (name && mobile) return `${name} - ${mobile}`;
      return name || mobile;
    }
    return (this.otherThanDriver || '').trim();
  }

  private parseFueledByDisplay(fueledByName: string): { name: string; mobile: string } {
    const separator = ' - ';
    const idx = fueledByName.lastIndexOf(separator);
    if (idx > 0) {
      return {
        name: fueledByName.substring(0, idx).trim(),
        mobile: fueledByName.substring(idx + separator.length).trim(),
      };
    }
    return { name: fueledByName, mobile: '' };
  }

  deleteEntry(): void {
    if (!this.canDeleteFuelEntry) {
      this.snackBar.open('You do not have permission to delete fuel entries.', '', { duration: 4000 });
      return;
    }
    if (!this.fuelEntryId || !this.performedBy) {
      this.snackBar.open('Nothing to delete.', '', { duration: 3000 });
      return;
    }
    if (!confirm('Delete this fuel entry?')) return;

    this.isSaving = true;
    this.fuelEntryService
      .delete(this.fuelEntryId, this.performedBy)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Fuel entry deleted.', '', { duration: 3000 });
          this.newEntry();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Delete failed.', '', { duration: 6000 });
        },
      });
  }

  searchSlip(): void {
    if (!this.canFindFuelEntry) {
      this.snackBar.open('You do not have permission to search fuel entries.', '', { duration: 4000 });
      return;
    }
    const searchCarValue = this.searchCarCtrl.value;
    const searchCarNo =
      typeof searchCarValue === 'string'
        ? (searchCarValue || '').trim()
        : this.carDisplay(searchCarValue).trim();
    const hasSlip = !!(this.searchSlipNo || '').trim();
    const hasCar = !!searchCarNo;
    const hasDate = !!(this.searchFuelDate || '').trim();
    if (!hasSlip && !hasCar && !hasDate) {
      this.snackBar.open('Enter slip no, car no, or fuel date to search.', '', { duration: 4000 });
      return;
    }

    this.isSearching = true;
    this.fuelEntryService
      .search({
        fuelSlipNo: (this.searchSlipNo || '').trim(),
        registrationNumber: searchCarNo,
        fuelDate: hasDate ? this.searchFuelDate : undefined,
        performedBy: this.performedBy,
        pageNumber: 1,
        pageSize: 20,
      })
      .pipe(finalize(() => (this.isSearching = false)))
      .subscribe({
        next: (rows) => {
          const list = rows || [];
          if (!list.length) {
            this.snackBar.open('No matching fuel entries found.', '', { duration: 4000 });
            return;
          }
          const id = list[0].fuelEntryID ?? list[0].FuelEntryID;
          this.reloadEntry(id);
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Search failed.', '', { duration: 6000 });
        },
      });
  }

  reloadEntry(id: number): void {
    this.isLoadingEntry = true;
    this.fuelEntryService
      .getById(id)
      .pipe(finalize(() => (this.isLoadingEntry = false)))
      .subscribe({
        next: (detail) => {
          this.applyDetail(detail);
          this.snackBar.open('Entry loaded.', '', { duration: 2500 });
        },
        error: () => {
          this.snackBar.open('Failed to load fuel entry.', '', { duration: 5000 });
        },
      });
  }

  private applyDetail(detail: FuelEntryDetailDto): void {
    if (!detail) return;
    this.fuelEntryId = detail.fuelEntryID ?? detail.FuelEntryID ?? null;
    this.fuelEntryNumber = detail.fuelEntryNumber ?? detail.FuelEntryNumber ?? '';
    this.statusCode = detail.statusCode ?? detail.StatusCode ?? '';
    this.statusName = detail.statusName ?? detail.StatusName ?? '';
    this.isEditable = detail.isEditable ?? detail.IsEditable ?? true;

    this.inventoryID = detail.inventoryID ?? detail.InventoryID ?? 0;
    this.carCtrl.setValue(detail.registrationNumber ?? detail.RegistrationNumber ?? '');
    this.supplierID = detail.supplierID ?? detail.SupplierID ?? null;
    this.supplierName = detail.supplierName ?? detail.SupplierName ?? '';
    this.vehicleName = '';
    this.vehicleCategory = '';
    this.driverID = detail.driverID ?? detail.DriverID ?? null;
    const fueledByName = (detail.fueledByName ?? detail.FueledByName ?? '').trim();
    if (this.driverID) {
      let driverName = detail.driverName ?? detail.DriverName ?? '';
      let driverMobile = detail.driverMobile ?? detail.DriverMobile ?? '';
      if (!driverName && !driverMobile && fueledByName) {
        const parsed = this.parseFueledByDisplay(fueledByName);
        driverName = parsed.name;
        driverMobile = parsed.mobile;
      }
      this.setDriverSelection(this.driverID, driverName, driverMobile);
      this.otherThanDriver = '';
    } else {
      this.driverCtrl.setValue('', { emitEvent: false });
      this.otherThanDriver = fueledByName;
    }
    this.locationID = detail.locationID ?? detail.LocationID ?? null;
    this.locationName = detail.locationName ?? detail.LocationName ?? '';

    this.fuelDate = this.toDateInput(detail.fuelDate ?? detail.FuelDate);
    this.fuelTime = this.toTimeInput(detail.fuelTime ?? detail.FuelTime);
    this.fuelSlipNo = detail.fuelSlipNo ?? detail.FuelSlipNo ?? '';
    this.fuelCardNo = detail.fuelCardNo ?? detail.FuelCardNo ?? '';
    this.currentMeter = detail.currentMeter ?? detail.CurrentMeter ?? null;
    this.fuelQuantity = detail.fuelQuantity ?? detail.FuelQuantity ?? null;
    this.amount = detail.amount ?? detail.Amount ?? null;
    this.fuelTypeID = detail.fuelTypeID ?? detail.FuelTypeID ?? null;
    this.fuelTypeName = detail.fuelTypeName ?? detail.FuelTypeName ?? '';
    this.fuelPayModeID = detail.fuelPayModeID ?? detail.FuelPayModeID ?? null;
    this.fuelManualEntryReasonID = detail.fuelManualEntryReasonID ?? detail.FuelManualEntryReasonID ?? null;
    this.remarks = detail.remarks ?? detail.Remarks ?? '';

    this.previousMeter = detail.previousMeter ?? detail.PreviousMeter ?? null;
    this.averageMileage = detail.averageKMPerLitre ?? detail.AverageKMPerLitre ?? null;
    this.currentAverage = detail.currentAverage ?? detail.CurrentAverage ?? null;
    this.eligibility = detail.eligibility ?? detail.Eligibility ?? null;
    this.fuelShortage = detail.fuelShortage ?? detail.FuelShortage ?? null;
    this.fuelRate = detail.fuelRate ?? detail.FuelRate ?? null;
    this.shortageAmount = detail.shortageAmount ?? detail.ShortageAmount ?? null;
    this.isFirstEntryAfterReset =
      detail.isFirstEntryAfterReset ?? detail.IsFirstEntryAfterReset ?? false;

    const docs = detail.documents ?? detail.Documents ?? [];
    this.fuelSlipDoc = docs.find((d) => (d.documentType || d.DocumentType) === 'FuelSlip') || null;
    this.odometerDoc = docs.find((d) => (d.documentType || d.DocumentType) === 'Odometer') || null;
    this.refreshDocPreviewUrls();
  }

  onFileSelected(documentType: 'FuelSlip' | 'Odometer', event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    input.value = '';

    if (!this.fuelEntryId) {
      if (documentType === 'FuelSlip') {
        this.pendingFuelSlipFile = file;
        this.setLocalPreview('FuelSlip', file);
      } else {
        this.pendingOdometerFile = file;
        this.setLocalPreview('Odometer', file);
      }
      this.snackBar.open('File queued — submit the entry to upload.', '', { duration: 4000 });
      return;
    }

    this.uploadFile(this.fuelEntryId, documentType, file);
  }

  private uploadFile(fuelEntryId: number, documentType: string, file: File): void {
    if (!this.performedBy) return;
    this.isSaving = true;
    this.fuelEntryService
      .uploadDocument(fuelEntryId, documentType, this.performedBy, file)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.snackBar.open(`${documentType} uploaded.`, '', { duration: 3000 });
          this.reloadEntry(fuelEntryId);
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Upload failed.', '', { duration: 6000 });
        },
      });
  }

  private uploadPendingFiles(): Observable<any> {
    if (!this.fuelEntryId) return of(null);
    const tasks = [];
    if (this.pendingFuelSlipFile) {
      tasks.push(
        this.fuelEntryService.uploadDocument(
          this.fuelEntryId,
          'FuelSlip',
          this.performedBy,
          this.pendingFuelSlipFile
        )
      );
    }
    if (this.pendingOdometerFile) {
      tasks.push(
        this.fuelEntryService.uploadDocument(
          this.fuelEntryId,
          'Odometer',
          this.performedBy,
          this.pendingOdometerFile
        )
      );
    }
    if (!tasks.length) return of(null);
    return forkJoin(tasks).pipe(
      catchError(() => of(null)),
      map(() => {
        this.pendingFuelSlipFile = null;
        this.pendingOdometerFile = null;
        return null;
      })
    );
  }

  removeDocument(documentType: 'FuelSlip' | 'Odometer'): void {
    const doc = documentType === 'FuelSlip' ? this.fuelSlipDoc : this.odometerDoc;
    const docId = doc?.fuelEntryDocumentID ?? doc?.FuelEntryDocumentID;
    if (!this.fuelEntryId || !docId) {
      if (documentType === 'FuelSlip') {
        this.pendingFuelSlipFile = null;
        this.fuelSlipDoc = null;
        this.fuelSlipPreviewUrl = null;
      } else {
        this.pendingOdometerFile = null;
        this.odometerDoc = null;
        this.odometerPreviewUrl = null;
      }
      return;
    }

    this.fuelEntryService.deleteDocument(this.fuelEntryId, docId, this.performedBy).subscribe({
      next: () => {
        this.snackBar.open('Document removed.', '', { duration: 3000 });
        this.reloadEntry(this.fuelEntryId);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Failed to remove document.', '', { duration: 5000 });
      },
    });
  }

  lookupItems(key: string): FuelLookupItem[] {
    const pascal = key.charAt(0).toUpperCase() + key.slice(1);
    return (this.lookups as any)?.[key] || (this.lookups as any)?.[pascal] || [];
  }

  payModeOptions(): FuelLookupItem[] {
    const allowed = new Set(['cash', 'fuel card']);
    return this.lookupItems('payModes').filter((item) =>
      allowed.has((this.lookupName(item) || '').trim().toLowerCase())
    );
  }

  lookupId(item: FuelLookupItem): number {
    return item?.id ?? item?.Id ?? 0;
  }

  lookupName(item: FuelLookupItem): string {
    return item?.name ?? item?.Name ?? '';
  }

  formatFileSize(bytes: number | null | undefined): string {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  docFileName(doc: FuelEntryDocumentDto): string {
    return doc?.originalFileName ?? doc?.OriginalFileName ?? '';
  }

  docFileSize(doc: FuelEntryDocumentDto): number {
    return doc?.fileSize ?? doc?.FileSize ?? 0;
  }

  isImageDoc(doc: FuelEntryDocumentDto): boolean {
    const ct = (doc?.contentType ?? doc?.ContentType ?? '').toLowerCase();
    const name = this.docFileName(doc).toLowerCase();
    return ct.startsWith('image/') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
  }

  private setLocalPreview(documentType: string, file: File): void {
    const url = URL.createObjectURL(file);
    if (documentType === 'FuelSlip') {
      this.revokeUrl(this.fuelSlipPreviewUrl);
      this.fuelSlipPreviewUrl = url;
      this.fuelSlipDoc = { originalFileName: file.name, fileSize: file.size, contentType: file.type };
    } else {
      this.revokeUrl(this.odometerPreviewUrl);
      this.odometerPreviewUrl = url;
      this.odometerDoc = { originalFileName: file.name, fileSize: file.size, contentType: file.type };
    }
  }

  private refreshDocPreviewUrls(): void {
    this.revokePreviewUrls();
    if (this.fuelSlipDoc && this.fuelEntryId) {
      const id = this.fuelSlipDoc.fuelEntryDocumentID ?? this.fuelSlipDoc.FuelEntryDocumentID;
      if (id && this.isImageDoc(this.fuelSlipDoc)) {
        this.fuelEntryService.downloadDocument(this.fuelEntryId, id).subscribe({
          next: (blob) => {
            this.fuelSlipPreviewUrl = URL.createObjectURL(blob);
          },
        });
      }
    }
    if (this.odometerDoc && this.fuelEntryId) {
      const id = this.odometerDoc.fuelEntryDocumentID ?? this.odometerDoc.FuelEntryDocumentID;
      if (id) {
        this.fuelEntryService.downloadDocument(this.fuelEntryId, id).subscribe({
          next: (blob) => {
            this.odometerPreviewUrl = URL.createObjectURL(blob);
          },
        });
      }
    }
  }

  private clearDocuments(): void {
    this.fuelSlipDoc = null;
    this.odometerDoc = null;
    this.revokePreviewUrls();
  }

  private clearCalculated(): void {
    this.previousMeter = null;
    this.currentAverage = null;
    this.eligibility = null;
    this.fuelShortage = null;
    this.fuelRate = null;
    this.shortageAmount = null;
    this.isFirstEntryAfterReset = false;
  }

  private scheduleCalculationPreview(): void {
    if (this.calculationPreviewTimer) {
      clearTimeout(this.calculationPreviewTimer);
    }
    this.calculationPreviewTimer = setTimeout(() => this.loadCalculationPreview(), 300);
  }

  private loadCalculationPreview(): void {
    if (!this.inventoryID || this.inventoryID <= 0 || !this.fuelDate || !this.fuelTime) {
      return;
    }

    this.fuelEntryService
      .getCalculationPreview({
        inventoryID: this.inventoryID,
        fuelDate: this.fuelDate,
        fuelTime: this.fuelTime,
        fuelEntryID: this.fuelEntryId || undefined,
        currentMeter: this.currentMeter ?? undefined,
        fuelQuantity: this.fuelQuantity ?? undefined,
        amount: this.amount ?? undefined,
      })
      .subscribe({
        next: (preview) => {
          this.previousMeter = preview?.previousMeter ?? preview?.PreviousMeter ?? null;
          this.averageMileage = preview?.averageMileage ?? preview?.AverageMileage ?? this.averageMileage;
          this.currentAverage = preview?.currentAverage ?? preview?.CurrentAverage ?? null;
          this.eligibility = preview?.eligibility ?? preview?.Eligibility ?? null;
          this.fuelShortage = preview?.fuelShortage ?? preview?.FuelShortage ?? null;
          this.fuelRate = preview?.fuelRate ?? preview?.FuelRate ?? null;
          this.shortageAmount = preview?.shortageAmount ?? preview?.ShortageAmount ?? null;
          this.isFirstEntryAfterReset =
            preview?.isFirstEntryAfterReset ?? preview?.IsFirstEntryAfterReset ?? false;
        },
        error: () => {
          this.refreshClientCalculations();
        },
      });
  }

  private refreshClientCalculations(): void {
    const prev = this.previousMeter;
    const cur = this.currentMeter;
    const qty = this.fuelQuantity;
    const amt = this.amount;
    const mileage = this.averageMileage;

    if (prev == null || cur == null || qty == null || qty <= 0 || cur < prev) {
      this.currentAverage = null;
      this.eligibility = null;
      this.fuelShortage = null;
      this.fuelRate = null;
      this.shortageAmount = null;
      return;
    }

    const distance = cur - prev;
    this.currentAverage = this.round2(distance / qty);

    if (mileage != null && mileage > 0) {
      this.eligibility = this.round2(distance / mileage);
      this.fuelShortage = this.round2(this.eligibility - qty);
    } else {
      this.eligibility = null;
      this.fuelShortage = null;
    }

    if (amt != null && amt > 0) {
      this.fuelRate = this.round2(amt / qty);
      if (this.fuelShortage != null && this.fuelRate != null) {
        this.shortageAmount = this.round2(this.fuelShortage * this.fuelRate);
      } else {
        this.shortageAmount = null;
      }
    } else {
      this.fuelRate = null;
      this.shortageAmount = null;
    }
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private nowTimeInput(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  private toTimeInput(value: string | null | undefined | Record<string, unknown>): string {
    if (value == null) {
      return '';
    }
    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const hours = Number(record['hours'] ?? record['Hours']);
      const minutes = Number(record['minutes'] ?? record['Minutes']);
      if (Number.isFinite(hours) && Number.isFinite(minutes)) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      const ticks = Number(record['ticks'] ?? record['Ticks']);
      if (Number.isFinite(ticks)) {
        const totalMinutes = Math.floor(ticks / 600000000);
        const h = Math.floor(totalMinutes / 60) % 24;
        const m = totalMinutes % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      }
      return '';
    }
    const text = String(value);
    if (/^\d{2}:\d{2}/.test(text)) {
      return text.substring(0, 5);
    }
    const d = new Date(`1970-01-01T${text}`);
    if (!isFinite(d.getTime())) {
      return '';
    }
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  private revokePreviewUrls(): void {
    this.revokeUrl(this.fuelSlipPreviewUrl);
    this.revokeUrl(this.odometerPreviewUrl);
    this.fuelSlipPreviewUrl = null;
    this.odometerPreviewUrl = null;
  }

  private revokeUrl(url: string | null): void {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  todayIso(): string {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  private normalizeResetTime(value: string): string {
    const text = (value || '').trim();
    if (!text) {
      return '';
    }
    return text.length === 5 ? `${text}:00` : text.substring(0, 8);
  }

  private isFutureFuelDate(dateStr: string): boolean {
    return !!(dateStr || '').trim() && dateStr > this.todayIso();
  }

  private isTodayFuelDate(dateStr: string): boolean {
    return !!(dateStr || '').trim() && dateStr === this.todayIso();
  }

  private isFutureFuelDateTime(dateStr: string, timeStr: string): boolean {
    if (!(dateStr || '').trim() || !(timeStr || '').trim()) return false;
    if (this.isFutureFuelDate(dateStr)) return false;
    if (!this.isTodayFuelDate(dateStr)) return false;
    return timeStr.substring(0, 5) > this.nowTimeInput();
  }

  private toDateInput(value: string | Date | null | undefined): string {
    if (!value) return this.todayIso();
    const d = typeof value === 'string' ? new Date(value) : value;
    if (!isFinite(d.getTime())) return this.todayIso();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  private validateOdometerResetDateTime(): string | null {
    const date = (this.odometerResetDate || '').trim();
    const time = this.normalizeResetTime(this.odometerResetTime);
    if (!date) {
      return 'Reset date is required.';
    }
    const today = this.todayIso();
    if (date > today) {
      return 'Reset date cannot be later than today.';
    }
    const latest =
      this.odometerResetContext?.latestFuelEntryDate ?? this.odometerResetContext?.LatestFuelEntryDate;
    const latestTime =
      this.odometerResetContext?.latestFuelEntryTime ?? this.odometerResetContext?.LatestFuelEntryTime;
    const latestIso = latest ? String(latest).substring(0, 10) : '';
    if (latestIso && date < latestIso) {
      return 'Reset date cannot be earlier than the latest fuel entry date.';
    }
    if (latestIso && date === latestIso && latestTime) {
      const resetHm = time.substring(0, 5);
      const latestHm = String(latestTime).substring(0, 5);
      if (resetHm <= latestHm) {
        return 'When reset date equals the latest fuel entry date, reset time must be later than the latest fuel entry time.';
      }
    }
    if (this.isFutureFuelDateTime(date, time.substring(0, 5))) {
      return "Future time is not allowed for today's date.";
    }
    return null;
  }

  private addMinutesToTimeInput(value: string, minutes: number): string {
    const parts = String(value || '00:00').substring(0, 5).split(':');
    const hours = Number(parts[0]) || 0;
    const mins = Number(parts[1]) || 0;
    const total = hours * 60 + mins + minutes;
    if (total >= 24 * 60) {
      return '23:59';
    }
    const nh = Math.floor(total / 60);
    const nm = total % 60;
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
  }

  private extractHttpErrorMessage(err: unknown, fallback: string): string {
    if (typeof err === 'string' && err.trim()) {
      return err;
    }
    const message = (err as { error?: { message?: string } })?.error?.message;
    return message?.trim() ? message : fallback;
  }

  displayCalc(value: number | null): string {
    if (value == null || value === ('' as any)) return '—';
    return Number(value).toFixed(2);
  }
}
