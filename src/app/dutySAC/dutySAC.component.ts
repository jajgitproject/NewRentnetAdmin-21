// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DutySACService } from './dutySAC.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DutySACModel } from './dutySAC.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../dutySAC/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-dutySAC',
  templateUrl: './dutySAC.component.html',
  styleUrls: ['./dutySAC.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySACComponent implements OnInit {
  @Input() advanceTableSAC;
  @Input() dutySlipID;
  @Input() AllotmentID!: number;
  @Input() verifyDutyStatusAndCacellationStatus;
  panelExpanded = false;
  displayedColumns = [
    'reasonOfChange',
    'sacNumber',
    'changeDateTime',
    'name',
    'actions'
  ];
  dataSource: DutySACModel[] | null;
  dutySACID: number;
  advanceTable: DutySACModel | null;
  SearchDutySAC: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search: FormControl = new FormControl();

    DutySlipID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutySACService: DutySACService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
     public route: ActivatedRoute,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  // ngOnInit() {
  //      this.route.queryParams.subscribe(paramsData =>{
  //     const encryptedAllotmentID = paramsData.allotmentID;
  //     this.allotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)); 
  //   });       
  //   this.loadCustomerInformation();
  //   this.loadDataForclosing();
  //   this.loadData();

  //   this.SubscribeUpdateService();
  // }

   ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      const encryptedDutySlipID = paramsData.dutySlipID;
      this.AllotmentID = Number(this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)));
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));            
    });
     this.loadDataForclosing();
    this.loadData();

  }
  refresh() {
    this.SearchDutySAC = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
    this.loadDataForclosing();
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent,
      {
        data:
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
      });
  }

  //   editCall(row) {
  //   this.dutySACID = row.dutySACID;
  //   const dialogRef = this.dialog.open(FormDialogComponent, {
  //     data: {
  //       advanceTable: row,
  //       action: 'edit'
  //     }
  //   });
  // }

  SACEdit(i: any) {
    const dialogRef = this.dialog.open(FormDialogComponent,
      {
        data:
        {
          advanceTable: this.advanceTableSAC[i],
          //data:data,
          action: 'edit',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData();
      this.loadDataForclosing();
    });
  }

  deleteItem(row) {
    this.dutySACID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: row
      });
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  public loadData() {
    this.dutySACService.getTableData(this.dutySlipID).subscribe
      (
        data => {
          this.advanceTableSAC = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableSAC = null; }
      );
  }

  public loadDataForclosing() {
    const allotmentID = this.AllotmentID;
    this.dutySACService.getTableDataforClosing(allotmentID).subscribe
      (
        data => {
          this.advanceTableSAC = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableSAC = null; }
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

  onContextMenu(event: MouseEvent, item: DutySACModel) {
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
    //this.SearchDutySAC='';
  }

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
            if (this.MessageArray[0] == "DutySACCreate") {
              if (this.MessageArray[1] == "DutySACView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty SAC Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySACUpdate") {
              if (this.MessageArray[1] == "DutySACView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty SAC Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySACDelete") {
              if (this.MessageArray[1] == "DutySACView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Duty SAC Deleted...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DutySACAll") {
              if (this.MessageArray[1] == "DutySACView") {
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
    this.dutySACService.getTableDataSort(this.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openDutySAC() {
    if (!this.advanceTableSAC) {
      const dialogRef = this.dialog.open(FormDialogComponent,
        {
          data:
          {
            dutySlipID: this.DutySlipID,

            record: this.advanceTableSAC,
          }
        });

      dialogRef.afterClosed().subscribe((res: any) => {
        this.loadData();
      });
    }
    else {
      Swal.fire({
        title:
          'Already added.',
        icon: 'warning',
      }).then((result) => {
        if (result.value) {

        }
      });
    }
  }

  togglePanel(): void {
    this.panelExpanded = !this.panelExpanded;

    // Optional: scroll into view only on expand
    if (this.panelExpanded) {
      setTimeout(() => this.scrollToLinkButton(), 300); // wait for animation
    }
  }

  onPanelOpen(): void {
    // Optional logic on open
  }

  onPanelClose(): void {
    // Optional logic on close
  }

}



