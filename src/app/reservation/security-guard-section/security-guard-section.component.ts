// @ts-nocheck
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../general/general.service';
import { SecurityGuardQuickAddComponent } from '../dialogs/security-guard-quick-add/security-guard-quick-add.component';

@Component({
  standalone: true,
  selector: 'app-security-guard-section',
  templateUrl: './security-guard-section.component.html',
  styleUrls: ['./security-guard-section.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class SecurityGuardSectionComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() customerGroupID: number;
  @Input() customerID: number;
  @Input() reservationID: number;
  @Input() cityList: any[] = [];
  @Input() dropOffCityList: any[] = [];

  guardList: any[] = [];
  filteredGuardOptions: Observable<any[]>;
  filteredSgPickupCityOptions: Observable<any[]>;
  filteredSgDropOffCityOptions: Observable<any[]>;
  filteredSgPickupAddressOptions: Observable<any[]>;
  filteredSgDropOffAddressOptions: Observable<any[]>;
  sgPickupAddressList: any[] = [];
  sgDropOffAddressList: any[] = [];
  selectedGuard: any;

  private destroy$ = new Subject<void>();

  constructor(
    private generalService: GeneralService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.form) {
      return;
    }
  const controlNames = [
      'securityGuard', 'securityGuardPickupCity', 'securityGuardDropOffCity',
      'securityGuardPickupAddress', 'securityGuardDropOffAddress',
      'doesThisReservationContainSecurityGuard',
    ];
    for (const name of controlNames) {
      if (!this.form.get(name)) {
        return;
      }
    }
    this.initGuardDropdown();
    this.initCityFilters();
    this.initAddressSearch();
    this.watchContainsGuard();
    this.watchPassengerTimesForDefaults();
    this.watchGuardSelectionInput();
    this.watchPickupAddressMirrorToDropOff();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get visible(): boolean {
    const v = this.form?.get('doesThisReservationContainSecurityGuard')?.value;
    return v === true || v === 1 || v === '1' || v === 'true';
  }

  private watchContainsGuard(): void {
    this.form.get('doesThisReservationContainSecurityGuard')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((yes) => {
        if (yes === true) {
          const hasExisting = this.hasExistingSecurityGuardData();
          if (!hasExisting) {
            this.applyDefaultGuardTimes();
          }
          this.initGuardDropdown();
          return;
        }

        this.clearGuardFields();
      });
  }

  private hasExistingSecurityGuardData(): boolean {
    const id = this.form.get('securityGuardID')?.value;
  if (!this.isEmptyId(id)) {
      return true;
    }
    const pickupAddr = String(this.form.get('securityGuardPickupAddress')?.value ?? '').trim();
    const dropAddr = String(this.form.get('securityGuardDropOffAddress')?.value ?? '').trim();
    return pickupAddr.length > 0 || dropAddr.length > 0;
  }

  private isEmptyId(value: unknown): boolean {
    return value === null || value === undefined || value === '' || Number(value) <= 0;
  }

  private watchPassengerTimesForDefaults(): void {
    ['pickupDate', 'pickupTime', 'dropOffDate', 'dropOffTime'].forEach((key) => {
      this.form.get(key)?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (this.visible && !this.form.get('securityGuardPickupDate')?.value) {
          this.applyDefaultGuardTimes();
        }
      });
    });
  }

  applyDefaultGuardTimes(): void {
    const pickupDate = this.form.get('pickupDate')?.value;
    const pickupTime = this.form.get('pickupTime')?.value;
    const dropDate = this.form.get('dropOffDate')?.value;
    const dropTime = this.form.get('dropOffTime')?.value;

    if (pickupDate) {
      const sgPickupDate = new Date(pickupDate);
      const sgPickupTime = pickupTime ? new Date(pickupTime) : new Date(pickupDate);
      if (pickupTime) {
        sgPickupTime.setHours(sgPickupTime.getHours() - 2);
      }
      this.form.patchValue({
        securityGuardPickupDate: sgPickupDate,
        securityGuardPickupTime: sgPickupTime,
      }, { emitEvent: false });
    }

    if (dropDate) {
      const sgDropDate = new Date(dropDate);
      const sgDropTime = dropTime ? new Date(dropTime) : new Date(dropDate);
      if (dropTime) {
        sgDropTime.setHours(sgDropTime.getHours() + 2);
      }
      this.form.patchValue({
        securityGuardDropOffDate: sgDropDate,
        securityGuardDropOffTime: sgDropTime,
      }, { emitEvent: false });
    }

    const pickupPriority = Number(this.form.get('pickupPriorityOrder')?.value || 0);
    const dropPriority = Number(this.form.get('dropOffPriorityOrder')?.value || 0);
    if (pickupPriority > 0) {
      this.form.patchValue({ securityGuardPickupStopOrderPriority: pickupPriority - 1 }, { emitEvent: false });
    }
    if (dropPriority > 0) {
      this.form.patchValue({ securityGuardDropOffStopOrderPriority: dropPriority + 1 }, { emitEvent: false });
    }

    this.applyDefaultGuardDropOffFromPickup();
  }

  showGuardContactFields(): boolean {
    if (this.form?.get('securityGuardInfoNotReceived')?.value === true) {
      return false;
    }
    return !this.isEmptyId(this.form?.get('securityGuardID')?.value);
  }

  private watchGuardSelectionInput(): void {
    this.form.get('securityGuard')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const text = String(value ?? '').trim();
        if (!text) {
          this.selectedGuard = null;
          this.form.patchValue({
            securityGuardID: null,
            securityGuardEmail: '',
            securityGuardMobile: '',
          }, { emitEvent: false });
          return;
        }

        const match = this.guardList.find((g) => this.buildGuardDisplay(g) === text);
        if (match) {
          return;
        }

        if (!this.isEmptyId(this.form.get('securityGuardID')?.value)) {
          this.selectedGuard = null;
          this.form.patchValue({
            securityGuardID: null,
            securityGuardEmail: '',
            securityGuardMobile: '',
          }, { emitEvent: false });
        }
      });
  }

  private watchPickupAddressMirrorToDropOff(): void {
    const mirrorIfDropOffEmpty = () => {
      if (!this.visible || this.form.get('securityGuardDropOffInfoNotReceived')?.value === true) {
        return;
      }
      this.applyDefaultGuardDropOffFromPickup();
    };

    ['securityGuardPickupAddress', 'securityGuardPickupAddressDetails', 'securityGuardPickupAddressLatLong']
      .forEach((key) => {
        this.form.get(key)?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => mirrorIfDropOffEmpty());
      });
  }

  private applyDefaultGuardDropOffFromPickup(): void {
    if (this.form.get('securityGuardDropOffInfoNotReceived')?.value === true) {
      return;
    }

    const dropAddr = String(this.form.get('securityGuardDropOffAddress')?.value ?? '').trim();
    const dropDetails = String(this.form.get('securityGuardDropOffAddressDetails')?.value ?? '').trim();
    if (dropAddr.length > 0 || dropDetails.length > 0) {
      return;
    }

    const pickupAddr = this.form.get('securityGuardPickupAddress')?.value;
    const pickupDetails = this.form.get('securityGuardPickupAddressDetails')?.value;
    const pickupGeo = this.form.get('securityGuardPickupAddressLatLong')?.value;
    const pickupCity = this.form.get('securityGuardPickupCity')?.value;
    const pickupCityId = this.form.get('securityGuardPickupCityID')?.value;

    const patch: Record<string, unknown> = {};
    if (pickupAddr != null && String(pickupAddr).trim() !== '') {
      patch.securityGuardDropOffAddress = pickupAddr;
    }
    if (pickupDetails != null && String(pickupDetails).trim() !== '') {
      patch.securityGuardDropOffAddressDetails = pickupDetails;
    }
    if (pickupGeo != null && String(pickupGeo).trim() !== '') {
      patch.securityGuardDropOffAddressLatLong = pickupGeo;
    }
    if (!this.isEmptyId(pickupCityId) && pickupCity) {
      patch.securityGuardDropOffCityID = pickupCityId;
      patch.securityGuardDropOffCity = pickupCity;
    }

    if (Object.keys(patch).length > 0) {
      this.form.patchValue(patch, { emitEvent: false });
    }
  }

  private clearGuardFields(): void {
    const keys = [
      'securityGuardID', 'securityGuard', 'securityGuardEmail', 'securityGuardMobile',
      'securityGuardInfoNotReceived',
      'securityGuardPickupCityID', 'securityGuardPickupCity', 'securityGuardPickupDate', 'securityGuardPickupTime',
      'securityGuardPickupAddress', 'securityGuardPickupAddressDetails', 'securityGuardPickupAddressLatLong',
      'securityGuardPickupInfoNotReceived', 'securityGuardPickupIsTimeNotConfirmed',
      'securityGuardDropOffCityID', 'securityGuardDropOffCity', 'securityGuardDropOffDate', 'securityGuardDropOffTime',
      'securityGuardDropOffAddress', 'securityGuardDropOffAddressDetails', 'securityGuardDropOffAddressLatLong',
      'securityGuardDropOffInfoNotReceived', 'securityGuardDropOffIsTimeNotConfirmed',
    ];
    const patch: Record<string, unknown> = {};
    keys.forEach((k) => { patch[k] = k.includes('NotReceived') || k.includes('IsTimeNotConfirmed') ? false : ''; });
    patch.securityGuardID = null;
    this.selectedGuard = null;
    this.form.patchValue(patch, { emitEvent: false });
  }

  initGuardDropdown(): void {
    const groupId = Number(this.customerGroupID);
    if (!groupId || Number.isNaN(groupId)) {
      return;
    }
    this.generalService.GetCPForSecurityGuard(groupId).subscribe({
      next: (data) => {
      this.guardList = data || [];
      const existingId = this.form.get('securityGuardID')?.value;
      if (this.isEmptyId(existingId)) {
        this.selectedGuard = null;
      } else {
        this.selectedGuard = this.guardList.find((g) => g.customerPersonID === existingId) || null;
      }

      this.filteredGuardOptions = this.form.get('securityGuard')!.valueChanges.pipe(
        startWith(this.form.get('securityGuard')?.value || ''),
        map((value) => this.filterGuardList(String(value || '')))
      );
      },
      error: () => {
        this.guardList = [];
        this.filteredGuardOptions = this.form.get('securityGuard')!.valueChanges.pipe(
          startWith(this.form.get('securityGuard')?.value || ''),
          map((value) => this.filterGuardList(String(value || '')))
        );
      },
    });
  }

  private filterGuardList(value: string): any[] {
    const term = value.toLowerCase();
    if (!term || term.length < 2) {
      return this.guardList.slice(0, 20);
    }
    return this.guardList.filter((g) =>
      `${g.customerPersonName} ${g.phone} ${g.primaryEmail} ${g.gender}`.toLowerCase().includes(term)
    );
  }

  buildGuardDisplay(g: any): string {
    return `${g.customerPersonName} - ${g.gender || 'Male'} - ${g.importance || 'General'} - ${g.phone || g.primaryMobile} - ${g.customerName || ''}`;
  }

  onGuardSelected(display: string): void {
    const guard = this.guardList.find((g) => this.buildGuardDisplay(g) === display);
    if (!guard) {
      return;
    }
    this.selectedGuard = guard;
    this.form.patchValue({
      securityGuardID: guard.customerPersonID,
      securityGuardEmail: guard.primaryEmail,
      securityGuardMobile: guard.phone || guard.primaryMobile,
      securityGuardInfoNotReceived: false,
    });
  }

  openNewSecurityGuard(): void {
    const ref = this.dialog.open(SecurityGuardQuickAddComponent, {
      width: '480px',
      data: {
        customerGroupID: this.customerGroupID,
        customerID: this.customerID,
        reservationID: this.reservationID,
      },
    });
    ref.afterClosed().subscribe((created) => {
      if (!created?.customerPersonID) {
        return;
      }
      this.initGuardDropdown();
      const display = `${created.customerPersonName} - Male - General - ${created.primaryMobile} -`;
      this.form.patchValue({
        securityGuardID: created.customerPersonID,
        securityGuard: display,
        securityGuardEmail: created.primaryEmail,
        securityGuardMobile: created.primaryMobile,
        securityGuardInfoNotReceived: false,
      });
      this.selectedGuard = created;
    });
  }

  onGuardInfoNotReceived(checked: boolean): void {
    if (checked) {
      this.selectedGuard = null;
      this.form.patchValue({
        securityGuardID: null,
        securityGuard: '',
        securityGuardEmail: '',
        securityGuardMobile: '',
      });
    }
  }

  onSgPickupTnc(checked: boolean): void {
    if (checked) {
      this.form.get('securityGuardPickupTime')?.setValue(null);
      this.form.get('securityGuardPickupTime')?.disable({ emitEvent: false });
    } else {
      this.form.get('securityGuardPickupTime')?.enable({ emitEvent: false });
    }
  }

  onSgDropOffTnc(checked: boolean): void {
    if (checked) {
      this.form.get('securityGuardDropOffTime')?.setValue(null);
      this.form.get('securityGuardDropOffTime')?.disable({ emitEvent: false });
    } else {
      this.form.get('securityGuardDropOffTime')?.enable({ emitEvent: false });
    }
  }

  private initCityFilters(): void {
    this.filteredSgPickupCityOptions = this.form.get('securityGuardPickupCity')!.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCities(this.cityList, String(value || '')))
    );
    this.filteredSgDropOffCityOptions = this.form.get('securityGuardDropOffCity')!.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCities(this.dropOffCityList?.length ? this.dropOffCityList : this.cityList, String(value || '')))
    );
  }

  private filterCities(list: any[], value: string): any[] {
    const term = value.toLowerCase();
    return (list || []).filter((c) => !term || c.geoPointName?.toLowerCase().includes(term));
  }

  getSgPickupCityID(id: number): void {
    this.form.patchValue({ securityGuardPickupCityID: id });
  }

  getSgDropOffCityID(id: number): void {
    this.form.patchValue({ securityGuardDropOffCityID: id });
  }

  private initAddressSearch(): void {
    this.filteredSgPickupAddressOptions = this.form.get('securityGuardPickupAddress')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (typeof value === 'string' ? value : '').trim();
        if (!term) {
          return of([]);
        }
        return this.generalService.searchGoogleAddress(term).pipe(
          catchError(() => of([])),
          map((data) => {
            this.sgPickupAddressList = data ?? [];
            return this.sgPickupAddressList;
          })
        );
      })
    );

    this.filteredSgDropOffAddressOptions = this.form.get('securityGuardDropOffAddress')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (typeof value === 'string' ? value : '').trim();
        if (!term) {
          return of([]);
        }
        return this.generalService.searchGoogleAddress(term).pipe(
          catchError(() => of([])),
          map((data) => {
            this.sgDropOffAddressList = data ?? [];
            return this.sgDropOffAddressList;
          })
        );
      })
    );
  }

  onSgPickupAddressSelected(geoSearchString: string): void {
    const row = this.sgPickupAddressList.find((d) => d.geoSearchString === geoSearchString);
    if (row) {
      this.patchGeo('securityGuardPickupAddressLatLong', row.geoLocation);
      this.applyDefaultGuardDropOffFromPickup();
    }
  }

  onSgDropOffAddressSelected(geoSearchString: string): void {
    const row = this.sgDropOffAddressList.find((d) => d.geoSearchString === geoSearchString);
    if (row) {
      this.patchGeo('securityGuardDropOffAddressLatLong', row.geoLocation);
    }
  }

  private patchGeo(controlName: string, geoLocation: string): void {
    if (!geoLocation) {
      return;
    }
    let value = geoLocation.replace('(', '').replace(')', '');
    const parts = value.split(' ').filter(Boolean);
    if (parts.length >= 3) {
      const lng = parts[1];
      const lat = parts[2];
      this.form.patchValue({ [controlName]: `${lat},${lng}` });
    }
  }

  toArray(maybe: any): any[] {
    return maybe || [];
  }
}
