// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { LocationCityMappingService } from '../../../locationCityMapping/locationCityMapping.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { LocationCityMappingModel } from '../../../locationCityMapping/locationCityMapping.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent implements OnInit {
  dialogTitle: string;
  locationID: number;
  locationName: string;
  cityList: any[] = [];
  filteredCityList: any[] = [];
  searchCity: string = '';
  selection = new SelectionModel<any>(true, []);
  saveDisabled: boolean = true;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: LocationCityMappingService,
    public _generalService: GeneralService
  ) {
    this.dialogTitle = 'Map Cities';
    this.locationID = data.locationID;
    this.locationName = data.locationName;
  }

  ngOnInit(): void {
    this.loadUnmappedCities();
  }

  loadUnmappedCities() {
    this.advanceTableService.getUnmappedCities(this.locationID).subscribe(
      data => {
        this.cityList = data || [];
        this.filteredCityList = this.cityList;
      },
      error => {
        this.cityList = [];
        this.filteredCityList = [];
      }
    );
  }

  filterCities() {
    const filterValue = (this.searchCity || '').toLowerCase();
    this.filteredCityList = this.cityList.filter(city =>
      city.city.toLowerCase().includes(filterValue)
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredCityList ? this.filteredCityList.length : 0;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.filteredCityList.forEach(row => this.selection.select(row));
  }

  onNoClick() {
    this.dialogRef.close();
  }

  confirmAdd() {
    if (this.selection.selected.length === 0) {
      return;
    }
    this.saveDisabled = false;
    this.isLoading = true;
    const payload = new LocationCityMappingModel({
      locationID: this.locationID,
      cityIDs: this.selection.selected.map(item => item.cityID)
    });
    this.advanceTableService.mapCities(payload).subscribe(
      response => {
        this.isLoading = false;
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes('Duplicate')) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        } else {
          this.dialogRef.close();
          this._generalService.sendUpdate('LocationCityMappingCreate:LocationCityMappingView:Success');
        }
      },
      error => {
        this.isLoading = false;
        this.saveDisabled = true;
        this._generalService.sendUpdate('LocationCityMappingAll:LocationCityMappingView:Failure');
      }
    );
  }
}
