// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { DutySlipImage } from './dutySlipImage.model';
import { DutySlipImageService } from './dutySlipImage.service';
@Component({
  standalone: false,
  selector: 'app-dutySlipImage',
  templateUrl: './dutySlipImage.component.html',
  styleUrls: ['./dutySlipImage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipImageComponent implements OnInit {
  displayedColumns = [
    'driverName',
    'bodyTemp',
    'status',
    'actions'
  ];
  dataSource: any;
  //inventoryInterStateTaxID: number;
  //InventoryInterStateTaxID: number = 0;
  allotmentID:number;
  advanceTable: DutySlipImage | null;
  SearchActivationStatus: boolean = true;
  SearchSelfDeclaration: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  inventoryID: any;
  regNo: any;
  driverID: number;

  SearchStartDate: string = '';
  startDate: FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate: FormControl = new FormControl();
  dutySlip_ID: any;
  reservation_ID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public dutySlipImageService: DutySlipImageService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      this.dutySlip_ID = paramsData.dutySlipID;
      this.reservation_ID = paramsData.reservationID;
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    
    this.SearchStartDate = '';
    //this.SearchEndDate = '';
    this.SearchActivationStatus = true;
    this.SearchSelfDeclaration = true;
    this.PageNumber = 0;
    this.loadData();
  }

  public SearchData() {
    this.loadData();
  }
  // addNew() {
  //   const dialogRef = this.dialog.open(FormDialogComponent,
  //     {
  //       data:
  //       {
  //         advanceTable: this.advanceTable,
  //         action: 'add',
  //         dutySlipID: this.dutySlip_ID,
  //         reservationID: this.reservation_ID
  //       }
        
  //     });
  // }

  addNew() {
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: this.advanceTable,
      action: 'add',
      dutySlipID: this.dutySlip_ID,
      reservationID: this.reservation_ID
    }
  });

  // Subscribe to the afterClosed observable
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
    }
  });
}

  editCall(row) {
    //  alert(row.id);
    this.allotmentID = row.allotmentID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        dutySlipID: this.dutySlip_ID,
        reservationID: this.reservation_ID
      }
    });

  }
  deleteItem(row) {

    this.allotmentID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: row
      });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }
  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }
  public loadData() {
    
    this.dutySlipImageService.getAllotmentIDForDutySlipImage(this.allotmentID).subscribe
      (
        data => {

          this.dataSource = data;
          //console.log(this.dataSource)
          

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: DutySlipImage) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() {
    //console.log(this.dataSource.length>0)
    if (this.dataSource.length > 0) {

      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall() {

    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }

  /////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");
          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "DutySlipImageCreate") {
              if (this.MessageArray[1] == "DutySlipImageView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty Slip Image Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySlipImageUpdate") {
              if (this.MessageArray[1] == "DutySlipImageView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty Slip Image Updated Successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySlipImageDelete") {
              if (this.MessageArray[1] == "DutySlipImageView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty Slip Image Deleted Successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySlipImageAll") {
              if (this.MessageArray[1] == "DutySlipImageView") {
                if (this.MessageArray[2] == "Failure") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-danger',
                    'Operation Failed.....!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DataNotFound") {
              if (this.MessageArray[1] == "DuplicacyError") {
                if (this.MessageArray[2] == "Failure") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-danger',
                    'Duplicate Value Found.....!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
          }
        }
      );
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.dutySlipImageService.getTableDataSort(this.SearchStartDate, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
}




