// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocationCityMappingService } from './locationCityMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LocationCityMappingModel } from './locationCityMapping.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-locationCityMapping',
  templateUrl: './locationCityMapping.component.html',
  styleUrls: ['./locationCityMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LocationCityMappingComponent implements OnInit {
  displayedColumns = [
    'locationName',
    'mappedCities',
    'actions'
  ];
  dataSource: LocationCityMappingModel[] | null;
  SearchLocationName: string = '';
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  menuItems: any[] = [
    { label: 'Location City Mapping Details', tooltip: 'Location City Mapping Details' }
  ];

  constructor(
    public httpClient: HttpClient,
    public locationCityMappingService: LocationCityMappingService,
    private snackBar: MatSnackBar,
    public router: Router,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.selectedFilter = 'search';
    this.searchTerm = '';
    this.SearchLocationName = '';
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  public SearchData() {
    this.PageNumber = 0;
    this.loadData();
  }

  public loadData() {
    switch (this.selectedFilter) {
      case 'locationName':
        this.SearchLocationName = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        this.SearchLocationName = '';
        break;
    }
    this.locationCityMappingService.getLocations(this.SearchLocationName, this.PageNumber).subscribe(
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

  getMappedCitiesPreview(mappedCities: string): string {
    if (!mappedCities) {
      return 'No cities mapped';
    }
    const cities = mappedCities.split(',').map(city => city.trim()).filter(city => city);
    if (cities.length <= 3) {
      return cities.join(', ');
    }
    return cities.slice(0, 3).join(', ') + '...';
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: LocationCityMappingModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall() {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl = this._generalService.FormURL;
    if (menuItem.label.toLowerCase() === 'location city mapping details') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/locationCityMappingDetails'], {
        queryParams: {
          locationID: rowItem.locationID,
          locationName: rowItem.locationName
        }
      }));
      window.open(baseUrl + url, '_blank');
    }
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.locationCityMappingService.getLocationsSort(this.SearchLocationName, this.PageNumber, coloumName.active, this.sortType).subscribe(
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
}
