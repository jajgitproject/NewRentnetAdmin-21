// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DebitService } from '../../debit.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { DebitModel } from '../../debit.model';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-debit-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DebitModel;
  saveDisabled = true;
  readOnly = false;
  showIncidenceContext = false;

  debitTypeOptions: any[] = [];
  locationList: any[] = [];

  driverPicker = new FormControl('');
  supplierPicker = new FormControl('');
  inventoryPicker = new FormControl('');
  locationPicker = new FormControl('');

  driverOptions$: Observable<any[]>;
  supplierOptions$: Observable<any[]>;
  inventoryOptions$: Observable<any[]>;
  locationOptions$: Observable<any[]>;

  private locationList$ = new BehaviorSubject<any[]>([]);

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public debitService: DebitService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Debit' : 'Add Debit';
    this.advanceTable = this.action === 'edit' ? new DebitModel(data.advanceTable) : new DebitModel({});
    this.readOnly = !!this.advanceTable.readOnlyOnDebitScreen;
    this.showIncidenceContext =
      (this.advanceTable.incidenceID && this.advanceTable.incidenceID > 0) ||
      (this.advanceTable.dutySlipID && this.advanceTable.dutySlipID > 0) ||
      (this.advanceTable.reservationID && this.advanceTable.reservationID > 0);
    this.advanceTableForm = this.createForm();
    this.initPickersFromRow();
  }

  ngOnInit(): void {
    this.driverOptions$ = this.createRemoteOptions$(this.driverPicker, (term) => this.debitService.searchDrivers(term));
    this.supplierOptions$ = this.createRemoteOptions$(this.supplierPicker, (term) => this.debitService.searchSuppliers(term));
    this.inventoryOptions$ = this.createRemoteOptions$(this.inventoryPicker, (term) => this.debitService.searchInventories(term));
    this.locationOptions$ = this.createFilteredOptions$(this.locationPicker, this.locationList$, 'organizationalEntityName', 'locationID');

    this.debitService.getDebitTypesForScreen().subscribe((list) => {
      this.debitTypeOptions = list || [];
      if (this.advanceTable.debitTypeID && !this.readOnly) {
        const matched = this.debitTypeOptions.find((x) => Number(x.debitTypeID) === Number(this.advanceTable.debitTypeID));
        if (matched) {
          this.advanceTableForm.patchValue({ amount: matched.debitTypeAmount }, { emitEvent: false });
        }
      }
    });

    this._generalService.GetLocation().subscribe((data) => {
      this.locationList = this.unwrapList(data)
        .map((x) => ({
          organizationalEntityID: Number(x.organizationalEntityID ?? x.locationID ?? x.OrganizationalEntityID),
          organizationalEntityName: x.organizationalEntityName ?? x.locationName ?? x.OrganizationalEntityName
        }))
        .filter((x) => x.organizationalEntityID > 0);
      this.locationList$.next(this.locationList);
      this.syncLocationPicker();
    });

    this.driverPicker.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        if (this.readOnly) {
          return;
        }
        if (value && typeof value === 'object') {
          const driverId = Number(value.driverID);
          this.advanceTableForm.patchValue({ driverID: driverId }, { emitEvent: false });
          if (value.supplierID) {
            this.supplierPicker.setValue(
              { supplierID: value.supplierID, supplierName: value.supplierName },
              { emitEvent: false }
            );
            this.advanceTableForm.patchValue({ supplierID: Number(value.supplierID) }, { emitEvent: false });
          }
          this.refreshDriverAssociation(driverId);
        }
      });

    this.advanceTableForm.get('date')?.valueChanges.subscribe(() => {
      if (this.readOnly) {
        return;
      }
      const driverId = Number(this.advanceTableForm.get('driverID')?.value);
      if (driverId > 0) {
        this.refreshDriverAssociation(driverId);
      }
    });

    this.advanceTableForm.get('debitTypeID')?.valueChanges.subscribe((debitTypeId) => {
      if (this.readOnly) {
        return;
      }
      const match = this.debitTypeOptions.find((x) => Number(x.debitTypeID) === Number(debitTypeId));
      if (match) {
        this.advanceTableForm.patchValue({ amount: match.debitTypeAmount }, { emitEvent: false });
      }
    });
  }

  private createForm(): FormGroup {
    let dateValue = null;
    if (this.advanceTable.date) {
      dateValue = this.advanceTable.date instanceof Date ? this.advanceTable.date : new Date(this.advanceTable.date);
    } else if (this.action === 'add') {
      dateValue = new Date();
    }

    const group = this.fb.group({
      debitID: [this.advanceTable.debitID],
      incidenceID: [this.advanceTable.incidenceID],
      dutySlipID: [this.advanceTable.dutySlipID],
      reservationID: [this.advanceTable.reservationID],
      driverID: [this.advanceTable.driverID],
      supplierID: [this.advanceTable.supplierID],
      inventoryID: [this.advanceTable.inventoryID],
      date: [dateValue],
      locationID: [this.advanceTable.locationID, Validators.required],
      debitTypeID: [this.advanceTable.debitTypeID, Validators.required],
      amount: [this.advanceTable.amount, [Validators.required, Validators.min(0.01)]],
      narration: [this.advanceTable.narration, [Validators.required, Validators.maxLength(500)]],
      activationStatus: [this.advanceTable.activationStatus !== false]
    });

    if (this.readOnly) {
      group.disable({ emitEvent: false });
      this.supplierPicker.disable({ emitEvent: false });
      this.inventoryPicker.disable({ emitEvent: false });
      this.driverPicker.disable({ emitEvent: false });
      this.locationPicker.disable({ emitEvent: false });
    }

    return group;
  }

  private initPickersFromRow(): void {
    if (this.advanceTable.driverID) {
      this.driverPicker.setValue(
        {
          driverID: this.advanceTable.driverID,
          displayLabel: this.advanceTable.driverDisplay || this.advanceTable.driverName
        },
        { emitEvent: false }
      );
    }
    if (this.advanceTable.supplierID) {
      this.supplierPicker.setValue(
        { supplierID: this.advanceTable.supplierID, supplierName: this.advanceTable.supplierName },
        { emitEvent: false }
      );
    }
    if (this.advanceTable.inventoryID) {
      this.inventoryPicker.setValue(
        { inventoryID: this.advanceTable.inventoryID, registrationNumber: this.advanceTable.registrationNumber },
        { emitEvent: false }
      );
    }
    if (this.advanceTable.locationID) {
      this.locationPicker.setValue(
        {
          organizationalEntityID: this.advanceTable.locationID,
          organizationalEntityName: this.advanceTable.locationName
        },
        { emitEvent: false }
      );
    }
  }

  private syncLocationPicker(): void {
    const locationId = Number(this.advanceTableForm.get('locationID')?.value);
    if (!locationId) {
      return;
    }
    const match = this.locationList.find((x) => x.organizationalEntityID === locationId);
    if (match) {
      this.locationPicker.setValue(match, { emitEvent: false });
    }
  }

  private refreshDriverAssociation(driverId: number): void {
    const dateVal = this.advanceTableForm.get('date')?.value;
    let dateString = 'null';
    if (dateVal) {
      try {
        const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
        if (!isNaN(d.getTime())) {
          dateString = formatDate(d, 'yyyy-MM-dd', 'en-GB');
        }
      } catch (e) {
        /* ignore */
      }
    }
    this.debitService.getDriverInventory(driverId, dateString).subscribe((assoc) => {
      if (!assoc) {
        return;
      }
      if (assoc.inventoryID) {
        this.inventoryPicker.setValue(
          { inventoryID: assoc.inventoryID, registrationNumber: assoc.registrationNumber },
          { emitEvent: false }
        );
        this.advanceTableForm.patchValue({ inventoryID: Number(assoc.inventoryID) }, { emitEvent: false });
      }
      if (assoc.supplierID) {
        this.supplierPicker.setValue(
          { supplierID: assoc.supplierID, supplierName: assoc.supplierName },
          { emitEvent: false }
        );
        this.advanceTableForm.patchValue({ supplierID: Number(assoc.supplierID) }, { emitEvent: false });
      }
    });
  }

  onSupplierSelected(option: any): void {
    if (this.readOnly || !option) {
      return;
    }
    this.advanceTableForm.patchValue({ supplierID: Number(option.supplierID) }, { emitEvent: false });
  }

  onInventorySelected(option: any): void {
    if (this.readOnly || !option) {
      return;
    }
    this.advanceTableForm.patchValue({ inventoryID: Number(option.inventoryID) }, { emitEvent: false });
  }

  onLocationSelected(option: any): void {
    if (this.readOnly || !option) {
      return;
    }
    this.advanceTableForm.patchValue({ locationID: Number(option.organizationalEntityID) }, { emitEvent: false });
  }

  displayDriver(option: any): string {
    return option && typeof option === 'object' ? option.displayLabel || option.driverName || '' : option || '';
  }

  displaySupplier(option: any): string {
    return option && typeof option === 'object' ? option.supplierName || '' : option || '';
  }

  displayInventory(option: any): string {
    return option && typeof option === 'object' ? option.registrationNumber || '' : option || '';
  }

  displayLocation(option: any): string {
    return option && typeof option === 'object' ? option.organizationalEntityName || '' : option || '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmAdd(): void {
    if (this.readOnly) {
      return;
    }
    this.saveDisabled = false;
    const payload = {
      ...this.advanceTableForm.getRawValue(),
      dateString: this.getDateString()
    };
    if (this.action === 'edit') {
      this.debitService.update(payload).subscribe(
        () => {
          this.dialogRef.close();
          this._generalService.sendUpdate('DebitUpdate:DebitView:Success');
          this.saveDisabled = true;
        },
        () => {
          this._generalService.sendUpdate('DebitAll:DebitView:Failure');
          this.saveDisabled = true;
        }
      );
    } else {
      this.debitService.add(payload).subscribe(
        () => {
          this.dialogRef.close();
          this._generalService.sendUpdate('DebitCreate:DebitView:Success');
          this.saveDisabled = true;
        },
        () => {
          this._generalService.sendUpdate('DebitAll:DebitView:Failure');
          this.saveDisabled = true;
        }
      );
    }
  }

  private getDateString(): string {
    const dateVal = this.advanceTableForm.get('date')?.value;
    if (!dateVal) {
      return '';
    }
    try {
      const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return formatDate(d, 'yyyy-MM-dd', 'en-GB');
      }
    } catch (e) {
      /* ignore */
    }
    return '';
  }

  private createRemoteOptions$(picker: FormControl, fetchFn: (term: string) => Observable<any[]>): Observable<any[]> {
    return picker.valueChanges.pipe(
      startWith(picker.value ?? ''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((value) => {
        const term = (typeof value === 'string' ? value : '').trim();
        if (term.length < 2) {
          return of([]);
        }
        return fetchFn(term);
      })
    );
  }

  private createFilteredOptions$(
    picker: FormControl,
    list$: BehaviorSubject<any[]>,
    field: string,
    formIdField: string
  ): Observable<any[]> {
    return combineLatest([list$, picker.valueChanges.pipe(startWith(picker.value ?? ''))]).pipe(
      tap(([_, value]) => {
        if (typeof value === 'string') {
          const trimmed = String(value).trim();
          const existingId = Number(this.advanceTableForm.get(formIdField)?.value);
          if (trimmed === '' && existingId > 0) {
            return;
          }
          setTimeout(() => {
            this.advanceTableForm.patchValue({ [formIdField]: null }, { emitEvent: false });
          }, 0);
        }
      }),
      map(([list, value]) => this.filterList(list, value, field))
    );
  }

  private filterList(list: any[], value: any, field: string): any[] {
    const source = list || [];
    if (value && typeof value === 'object') {
      return source;
    }
    const term = (value || '').toString().trim().toLowerCase();
    if (!term) {
      return source.slice(0, 50);
    }
    return source.filter((item) => (item[field] || '').toString().toLowerCase().includes(term));
  }

  private unwrapList(data: any): any[] {
    if (!data) {
      return [];
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  }
}