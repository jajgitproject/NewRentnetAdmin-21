// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from './employee.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee } from './employee.model';
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
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class EmployeeComponent implements OnInit {
  displayedColumns = [
    'firstName',
    'employeeOf',
    'desgination',
    'supplierName',
    'role',
    'oldRenNetID',
    'status',
    'actions'
  ];
  dataSource: Employee[] | null;
  employeeID: number;
  advanceTable: Employee | null;
  SearchName: string = '';
  SearchNameForFilter: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchSupplierName: string = '';
  SearchSupplierNameForFilter: string = '';
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public employeeService: EmployeeService,
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
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() 
  {
    this.SearchName = '';
    this.SearchSupplierName = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.SearchNameForFilter = '';
    this.SearchSupplierNameForFilter = '';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  OpenCustomer(item:any)
  {
    let baseUrl =  this._generalService.FormURL;
    const encryptedEmployeeID = encodeURIComponent(this._generalService.encrypt(item.employeeID.toString()));
    const encryptedEmployeeName = encodeURIComponent(this._generalService.encrypt(item.firstName+ ' ' +item.lastName));
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerForSalesManager'], { queryParams: {
      EmployeeID: encryptedEmployeeID,
      EmployeeName: encryptedEmployeeName
     } }));
    window.open(baseUrl + url, '_blank');   
  }
  
  public SearchData() {
    this.loadData();
    //this.SearchName = '';

  }
  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent,
      {

        data:
        {
          advanceTable: this.advanceTable,
          action: 'add',
          //lastid: this.last.employeeID
        }
      });

  }
  editCall(row) {
    //  alert(row.id);
    this.employeeID = row.employeeID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }

  deleteItem(row) {

    this.employeeID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: row
      });
  }

  OpenEmployeeLocation(item:any)
  {
    let baseUrl =  this._generalService.FormURL;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/employeeLocation'], { queryParams: {
      EmployeeID: item.employeeID,
     } }));
    window.open(baseUrl + url, '_blank'); 
  
  }
  OpenEmployeeSetAsCustomerKAM(item:any)
  {
    let baseUrl =  this._generalService.FormURL;
    const encryptedEmployeeID = encodeURIComponent(this._generalService.encrypt(item.employeeID.toString()));
  const encryptedEmployeeName = encodeURIComponent(this._generalService.encrypt(item.firstName+' '+item.lastName));
 
  
    const url = this.router.serializeUrl(this.router.createUrlTree(['/setAsCustomerKAM'],  { queryParams: {
      EmployeeID:encryptedEmployeeID,
      EmployeeName: encryptedEmployeeName
    } }));
    window.open(baseUrl + url, '_blank'); 
  
  }
  
  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }
  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  public loadData(source:string = 'init') 
  {
    if (source === 'popUp')
    {
      this.employeeService.getTableData(this.SearchName,this.SearchSupplierName, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
    }
    else
    {
      switch (this.selectedFilter)
      {
        case 'employee':
          this.SearchNameForFilter = this.searchTerm;
          break;
        case 'supplier':
          this.SearchSupplierNameForFilter = this.searchTerm;
          break;
        default:
          this.searchTerm = '';
          break;
      }
      this.employeeService.getTableData(this.SearchNameForFilter,this.SearchSupplierNameForFilter, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
          console.log(this.dataSource);
        //   this.dataSource.forEach((element) => {
        //     if (element.activationStatus === true) {
        //       this.ActiveStatus = "Active"
        //     }
        //     else {
        //       this.ActiveStatus = "Deleted"
        //     }
        //   })
        //   this.last = this.dataSource[this.dataSource.length - 1];
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
    }
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: Employee) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() {
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
            if (this.MessageArray[0] == "EmployeeCreate") {
              if (this.MessageArray[1] == "EmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Employee Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "EmployeeUpdate") {
              if (this.MessageArray[1] == "EmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Employee Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "EmployeeDelete") {
              if (this.MessageArray[1] == "EmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Employee Deleted...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "EmployeeAll") {
              if (this.MessageArray[1] == "EmployeeView") {
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
    this.employeeService.getTableDataSort(this.SearchName,this.SearchSupplierName, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
}



