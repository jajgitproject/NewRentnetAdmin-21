// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import moment from 'moment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { QcMisCST, QcMisCSTSearchCriteria } from './qcMisCst.model';
import { QcMisCSTService } from './qcMisCst.service';

@Component({
  standalone: false,
  selector: 'app-qcMisCst',
  templateUrl: './qcMisCst.component.html',
  styleUrls: ['./qcMisCst.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class QcMisCSTComponent implements OnInit {
  displayedColumns = [
    'reservationID',
    'pickupDate',
    'serviceLocation',
    'qcVerificationResult',
    'qcVerificationRemarks',
    'qcVerifiedByAgent'
  ];

  columnTitleMap = {
    reservationID: 'Booking No',
    pickupDate: 'Pick up Date',
    serviceLocation: 'Service Location',
    qcVerificationResult: 'QC Verification Result',
    qcVerificationRemarks: 'QC Verification Remarks',
    qcVerifiedByAgent: 'QC Verified By Agent'
  };

  dataSource: QcMisCST[] = [];
  PageNumber = 0;
  hasManualSearch = false;

  searchPickupDateFrom: any = '';
  searchPickupDateTo: any = '';
  searchLocationID = 0;
  searchCity = new FormControl('');

  locations: OrganizationalEntityDropDown[] = [];
  cityOptions: CityDropDown[] = [];

  constructor(
    private qcMisCSTService: QcMisCSTService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generalService.GetLocation().subscribe((data) => (this.locations = data || []));
    this.searchCity.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        if (value && typeof value === 'object') {
          return of(this.cityOptions);
        }
        const term = (value || '').toString().trim();
        if (term.length < (this.generalService.lengthToCheck || 3)) {
          this.cityOptions = [];
          return of([]);
        }
        return this.generalService.GetCityDropDownForControlPanel(term);
      })
    ).subscribe((list) => (this.cityOptions = list || []));
  }

  displayCity(option: any): string {
    return option && typeof option === 'object' ? option.geoPointName : option || '';
  }

  SearchData(): void {
    this.PageNumber = 0;
    this.hasManualSearch = true;
    this.loadData();
  }

  refresh(): void {
    this.searchPickupDateFrom = '';
    this.searchPickupDateTo = '';
    this.searchLocationID = 0;
    this.searchCity.setValue('');
    this.cityOptions = [];
    this.PageNumber = 0;
    this.hasManualSearch = false;
    this.dataSource = [];
  }

  loadData(): void {
    const criteria = this.buildSearchCriteria();
    this.qcMisCSTService.getTableData(criteria, this.PageNumber).subscribe(
      (data) => {
        this.dataSource = Array.isArray(data) ? data : [];
      },
      (error: HttpErrorResponse) => {
        this.dataSource = [];
        this.showNotification('snackbar-danger', error?.message || 'QC MIS (CST) search failed', 'bottom', 'center');
      }
    );
  }

  NextCall(): void {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall(): void {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  private buildSearchCriteria(): QcMisCSTSearchCriteria {
    const cityValue = this.searchCity.value;
    let cityID = 0;
    if (cityValue && typeof cityValue === 'object') {
      cityID = cityValue.geoPointID || 0;
    }

    return {
      pickupDateFrom: this.searchPickupDateFrom ? moment(this.searchPickupDateFrom).format('MMM DD yyyy') : '',
      pickupDateTo: this.searchPickupDateTo ? moment(this.searchPickupDateTo).format('MMM DD yyyy') : '',
      locationID: this.searchLocationID || 0,
      cityID
    };
  }

  private showNotification(colorName: string, text: string, placementFrom: any, placementAlign: any): void {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
