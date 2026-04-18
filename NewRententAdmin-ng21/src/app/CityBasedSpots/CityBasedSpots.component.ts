// @ts-nocheck
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { CityBasedSpots } from './CityBasedSpots.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { CityBasedSpotsService } from './CityBasedSpots.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { map, startWith } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-CityBasedSpots',
  templateUrl: './CityBasedSpots.component.html',
  styleUrls: ['./CityBasedSpots.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CityBasedSpotsComponent {
  action: string;
  dialogTitle: string;
  advanceTable: CityBasedSpots;
  messageReceived: string;
  MessageArray: string[] = [];
  public response: { dbPath: '' };

  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  city : FormControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<CityBasedSpotsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public _printDutySlipService: CityBasedSpotsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

  }

  formControl = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  ngOnInit() {
    this.InitCities();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  Search()
  {
    this.dialogRef.close(this.city.value);
  }

  submit() {
   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


