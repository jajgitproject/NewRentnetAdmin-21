// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute } from '@angular/router';
import { LocationCityMappingModel } from '../locationCityMapping/locationCityMapping.model';
import { LocationCityMappingService } from '../locationCityMapping/locationCityMapping.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { UnmapDialogComponent } from './dialogs/unmap/unmap.component';

@Component({
  standalone: false,
  selector: 'app-locationCityMappingDetails',
  templateUrl: './locationCityMappingDetails.component.html',
  styleUrls: ['./locationCityMappingDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LocationCityMappingDetailsComponent implements OnInit {
  displayedColumns = [
    'select',
    'city',
    'status'
  ];
  dataSource: LocationCityMappingModel[] | null;
  selection = new SelectionModel<LocationCityMappingModel>(true, []);
  SearchCity: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  locationID: any;
  locationName: any;
  private subscriptionName: Subscription;
  messageReceived: string;
  MessageArray: string[] = [];

  constructor(
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public locationCityMappingService: LocationCityMappingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      this.locationID = paramsData.locationID;
      this.locationName = paramsData.locationName;
    });
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.SearchCity = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.selection.clear();
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
      case 'city':
        this.SearchCity = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.locationCityMappingService.getMappedCities(this.locationID, this.SearchCity, this.SearchActivationStatus, this.PageNumber).subscribe(
      data => {
        this.dataSource = data;
        this.selection.clear();
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.length : 0;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        action: 'add',
        locationID: this.locationID,
        locationName: this.locationName
      },
      width: '600px'
    });
  }

  unmapSelected() {
    if (this.selection.selected.length === 0) {
      this.showNotification('snackbar-danger', 'Please select at least one city to unmap...!!!', 'bottom', 'center');
      return;
    }
    this.dialog.open(UnmapDialogComponent, {
      data: {
        locationID: this.locationID,
        locationName: this.locationName,
        selectedRows: this.selection.selected
      }
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
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

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe(
      message => {
        this.messageReceived = message.text;
        this.MessageArray = this.messageReceived.split(':');
        if (this.MessageArray.length == 3) {
          if (this.MessageArray[0] == 'LocationCityMappingCreate' && this.MessageArray[1] == 'LocationCityMappingView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Cities mapped successfully...!!!', 'bottom', 'center');
          } else if (this.MessageArray[0] == 'LocationCityMappingUnmap' && this.MessageArray[1] == 'LocationCityMappingView' && this.MessageArray[2] == 'Success') {
            this.refresh();
            this.showNotification('snackbar-success', 'Cities unmapped successfully...!!!', 'bottom', 'center');
          } else if (this.MessageArray[0] == 'LocationCityMappingAll' && this.MessageArray[1] == 'LocationCityMappingView' && this.MessageArray[2] == 'Failure') {
            this.refresh();
            this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
          } else if (this.MessageArray[0] == 'DataNotFound' && this.MessageArray[1] == 'DuplicacyError' && this.MessageArray[2] == 'Failure') {
            this.showNotification('snackbar-danger', 'Duplicate Value Found.....!!!', 'bottom', 'center');
          }
        }
      }
    );
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.locationCityMappingService.getMappedCitiesSort(this.locationID, this.SearchCity, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe(
      data => {
        this.dataSource = data;
        this.selection.clear();
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
}
