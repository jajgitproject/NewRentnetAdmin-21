// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { CustomerCityHigherExtraKMorHRService } from '../../customerCityHigherExtraKMorHR.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomerCityHigherExtraKMorHR } from '../../customerCityHigherExtraKMorHR.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerCityHigherExtraKMorHR;
  customerName: string;
  customerID: number;
  cityID: number;
  public CityList?: CityDropDown[] = [];
  filteredCityOptions: Observable<CityDropDown[]>;
  saveDisabled = true;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerCityHigherExtraKMorHRService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Charge Higher Extra KM Or HR For';
      this.advanceTable = new CustomerCityHigherExtraKMorHR(data.advanceTable);
      this.cityID = Number(this.advanceTable.cityID);
    } else {
      this.dialogTitle = 'Charge Higher Extra KM Or HR For';
      this.advanceTable = new CustomerCityHigherExtraKMorHR({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.chargeHigherExtraKMorHR = false;
    }
    this.advanceTableForm = this.createContactForm();
    this.customerName = data.CustomerName;
    this.customerID = Number(data.CustomerID);
  }

  private buildSavePayload() {
    const raw = this.advanceTableForm.getRawValue();
    const cityId = Number(this.cityID || raw.cityID || this.advanceTable?.cityID);
    return {
      customerCityHigherExtraKMorHRID: Number(raw.customerCityHigherExtraKMorHRID),
      customerID: Number(this.customerID),
      cityID: cityId,
      chargeHigherExtraKMorHR: raw.chargeHigherExtraKMorHR === true || raw.chargeHigherExtraKMorHR === 'true',
      activationStatus: raw.activationStatus === true || raw.activationStatus === 'true'
    };
  }

  ngOnInit(): void {
    this.InitCity();
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      customerCityHigherExtraKMorHRID: [this.advanceTable.customerCityHigherExtraKMorHRID],
      customerID: [this.advanceTable.customerID],
      cityID: [this.advanceTable.cityID],
      cityName: [this.advanceTable.cityName, Validators.required],
      chargeHigherExtraKMorHR: [this.advanceTable.chargeHigherExtraKMorHR ?? false],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  InitCity() {
    this._generalService.GetCitiessAll().subscribe(
      (data) => {
        this.CityList = data;
        this.advanceTableForm.controls['cityName'].setValidators([
          Validators.required,
          this.cityNameValidator(this.CityList)
        ]);
        this.advanceTableForm.controls['cityName'].updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls['cityName'].valueChanges.pipe(
          startWith(''),
          map((value) => this._filterCity(value || ''))
        );
      },
      () => {}
    );
  }

  private _filterCity(value: string): CityDropDown[] {
    const filterValue = (value || '').toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return (this.CityList || []).filter((city) =>
      city.geoPointName.toLowerCase().includes(filterValue)
    );
  }

  cityNameValidator(cityList: CityDropDown[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value || '').toLowerCase();
      const match = cityList.some((city) => city.geoPointName.toLowerCase() === value);
      return match ? null : { cityNameInvalid: true };
    };
  }

  OnCitySelect(selectedCity: string) {
    const city = (this.CityList || []).find((c) => c.geoPointName === selectedCity);
    if (city) {
      this.getCityID(city.geoPointID);
    }
  }

  getCityID(cityID: number) {
    this.cityID = cityID;
    this.advanceTableForm.patchValue({ cityID: cityID });
  }

  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();
      this.advanceTableForm.patchValue({ activationStatus: true, chargeHigherExtraKMorHR: false });
    } else {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.advanceTableService.add(this.buildSavePayload()).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerCityHigherExtraKMorHRCreate:CustomerCityHigherExtraKMorHRView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('CustomerCityHigherExtraKMorHRAll:CustomerCityHigherExtraKMorHRView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public Put(): void {
    this.advanceTableService.update(this.buildSavePayload()).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerCityHigherExtraKMorHRUpdate:CustomerCityHigherExtraKMorHRView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('CustomerCityHigherExtraKMorHRAll:CustomerCityHigherExtraKMorHRView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action === 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }
}
