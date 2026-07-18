// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IncidenceService } from './incidence.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Incidence } from './incidence.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BehaviorSubject,
  fromEvent,
  merge,
  Observable,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { incidenceFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { resolutionFormDialogComponent } from '../resolution/dialogs/form-dialog/form-dialog.component';
@Component({
  standalone: false,
  selector: 'app-incidence',
  templateUrl: './incidence.component.html',
  styleUrls: ['./incidence.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class IncidenceComponent implements OnInit {
  // displayedColumns = [
  //   'Incidence',
  //   'status',
  //   'actions'
  // ];
  dataSource: Incidence[] | null;
  incidenceID: number;
  advanceTable: Incidence | null;
  SearchIncidence: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search: FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';
  reservationID: any;
  dutySlipID: any;
  reservationData: any;

  displayedColumns: string[] = [
    'IncidenceID',
    'ReservationID',
    'PassengerID',
    'IncidenceDate',
    'IncidenceCategory',
    'InternalExternalType',
    'ReportedBy',
    'IncidenceDetails',
    'Status',
    'Actions',
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public _generalService: GeneralService,
    public incidenceService: IncidenceService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe((paramsData) => {
      const encryptedReservationID = paramsData.reservationID;
      this.reservationID = Number(
        this._generalService.decrypt(
          decodeURIComponent(encryptedReservationID),
        ),
      );
    });

    this.loadData();
    this.loadReservationData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.selectedFilter = 'search';
    this.searchTerm = '';
    this.SearchIncidence = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
  }

  addNew(): void {

  const dialogRef = this.dialog.open(
    incidenceFormDialogComponent,
    {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: {
        action: 'add',
        item: this.reservationData 
       }
    }
  );

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadData();
    }
  });
}

  //-------------------------Edit Incidence----------
  editCall(item: any): void {
    // Defer so MatMenu can finish closing before MatDialog opens.
    setTimeout(() => {
      const dialogRef = this.dialog.open(incidenceFormDialogComponent, {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: {
          action: 'edit',
          item: this.reservationData,
          advanceTable: item,
          
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadData();
        }
      });
    });
  }
  //---------------------Resolution
 createResolution(row: any): void {
  // Defer so MatMenu can finish closing; otherwise MatDialog often fails to open.
  setTimeout(() => {
    const dialogRef = this.dialog.open(
      resolutionFormDialogComponent,
      {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: {
          advanceTable: row,
          // Resolution is always saved via incidenceEdit PUT.
          action: 'edit',
          item: this.reservationData,
          incidenceID: row.incidenceID,
          reservationID: row.reservationID || this.reservationID,
          dutySlipID: row.dutySlipID || this.dutySlipID,
          customerID: row.customerID,
          customerName: row.customerName,
          registrationNumber: row.registrationNumber,
          inventoryID: row.inventoryID,
          driverID: row.driverID,
          driverName: row.driverName,
          supplierID: row.supplierID || row.inventorySupplierID,
          organizationalEntityName: row.organizationalEntityName,
          customerPersonID:
            row.passengerID ||
            row.customerPersonID ||
            row.passengerDetails?.[0]?.customerPersonID,
          customerPersonName:
            row.customerPersonName ||
            row.customerpersonName ||
            row.passengerDetails?.[0]?.customerPersonName,
            
          
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  });
}
  //----------------------------

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  public loadData() {
    this.incidenceService
      .getTableData(
        this.reservationID,
        this.SearchActivationStatus,
        this.PageNumber,
      )
      .subscribe(
        (response: any) => {
          console.log('API Response:', response);

          // Case 1: API returns array directly
          if (Array.isArray(response)) {
            this.dataSource = response;
          }

          // Case 2: API returns { data: [...] }
          else if (response.data && Array.isArray(response.data)) {
            this.dataSource = response.data;
          }

          // Case 3: API returns { result: [...] }
          else if (response.result && Array.isArray(response.result)) {
            this.dataSource = response.result;
          }

          // fallback
          else {
            this.dataSource = [];
          }

          console.log('Datasource:', this.dataSource);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.dataSource = [];
        },
      );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  onContextMenu(event: MouseEvent, item: Incidence) {
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

  public SearchData() {
    this.loadData();
    //this.SearchIncidence='';
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  };
  /////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService
      .getUpdate()
      .subscribe((message) => {
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray = this.messageReceived.split(':');
        if (this.MessageArray.length == 3) {
          if (this.MessageArray[0] == 'IncidenceCreate') {
            if (this.MessageArray[1] == 'IncidenceView') {
              if (this.MessageArray[2] == 'Success') {
                this.refresh();
                this.showNotification(
                  'snackbar-success',
                  'Incidence Created...!!!',
                  'bottom',
                  'center',
                );
              }
            }
          } else if (this.MessageArray[0] == 'IncidenceUpdate') {
            if (this.MessageArray[1] == 'IncidenceView') {
              if (this.MessageArray[2] == 'Success') {
                this.refresh();
                this.showNotification(
                  'snackbar-success',
                  'Incidence Updated...!!!',
                  'bottom',
                  'center',
                );
              }
            }
          } else if (this.MessageArray[0] == 'IncidenceDelete') {
            if (this.MessageArray[1] == 'IncidenceView') {
              if (this.MessageArray[2] == 'Success') {
                this.refresh();
                this.showNotification(
                  'snackbar-success',
                  'Incidence Deleted...!!!',
                  'bottom',
                  'center',
                );
              }
            }
          } else if (this.MessageArray[0] == 'IncidenceAll') {
            if (this.MessageArray[1] == 'IncidenceView') {
              if (this.MessageArray[2] == 'Failure') {
                this.refresh();
                this.showNotification(
                  'snackbar-danger',
                  'Operation Failed.....!!!',
                  'bottom',
                  'center',
                );
              }
            }
          } else if (this.MessageArray[0] == 'DataNotFound') {
            if (this.MessageArray[1] == 'DuplicacyError') {
              if (this.MessageArray[2] == 'Failure') {
                this.refresh();
                this.showNotification(
                  'snackbar-danger',
                  'Duplicate Value Found.....!!!',
                  'bottom',
                  'center',
                );
              }
            }
          }
        }
      });
  }

  //--------------------------
  // createResolution(row: any) {
  //   const dialogRef = this.dialog.open(ResolutionDialogComponent, {
  //     data: {
  //       incidenceID: row.IncidenceID,
  //     },
  //   });
  // }
  //--------------------------------
  SortingData(coloumName: any) {
    if (this.sortingData == 1) {
      this.sortingData = 0;
      this.sortType = 'Ascending';
    } else {
      this.sortingData = 1;
      this.sortType = 'Descending';
    }
    this.incidenceService
      .getTableDataSort(
        this.SearchIncidence,
        this.SearchActivationStatus,
        this.PageNumber,
        coloumName.active,
        this.sortType,
      )
      .subscribe(
        (data) => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => {
          this.dataSource = null;
        },
      );
  }

  public loadReservationData() {
    
    this.incidenceService
      .getReservationDetails(
        this.reservationID
      )
      .subscribe(
        (response: any) => {
         
          console.log('API Response:', response);

          // Case 1: API returns array directly
          
            this.reservationData = response;

          console.log('Datasource:', this.reservationData);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.reservationData = [];
        },
      );
  }
}
