// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriverService } from './driver.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Driver } from './driver.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
import { DriverGradeDropDown } from '../driverGrade/driverGradeDropDown.model';
import { QualificationDropDown } from '../general/qualificationDropDown.model';
import { OrganizationalEntityDropDown } from '../general/organizationalEntityDropDown.model';
import { ClearIMEIDialogComponent } from './dialogs/clearIMEI/clearIMEI.component';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverComponent implements OnInit {
  displayedColumns = [
    'driverName',
    'supplierName',
    'driverEmail',
    'mobile1',
    'driverOfficialIdentityNumber',
    'supplierOfficialIdentityNumber',
    'hub',
    'location',
    'driverImage',
     'isAdhoc',
    'status',
    'actions'
  ];

  dataSource: Driver[] | null;
  driverID: number;
  advanceTable: Driver | null;
  SearchdriverName: string = '';
  searchdriverFatherName: string = '';
  searchdriverGradeName: string = '';
  searchSupplier: string = '';
  searchDriverOfficialIdentityNumber: string = '';
  searchhighestQualification: string = '';
  searchMobile: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  driverFatherName: FormControl = new FormControl();
  driverGrade: FormControl = new FormControl();
  idMark: FormControl = new FormControl();
  highestQualification: FormControl = new FormControl();
  mobile: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  public DriverGradeList?: DriverGradeDropDown[] = [];
  filteredGradeOptions: Observable<DriverGradeDropDown[]>;
  public QualificationList?: QualificationDropDown[] = [];
  filteredServiceOptions: Observable<OrganizationalEntityDropDown[]>;
  public ServiceList?: OrganizationalEntityDropDown[] = [];
  location: FormControl = new FormControl();
  searchLocation: string = '';
  sear

  searchTerm: any = '';
  selectedFilter: string = 'search';

  menuItems: any[] = [
    { label: 'Driving License', tooltip: 'Driver Driving License' },
    { label: 'Document', },
    { label: 'Inventory Association', }
  ];


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public driverService: DriverService,
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
    this.InitDriverGrade();
    this.InitQualification();
    this.initLocation();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchdriverName = '';
    this.searchdriverFatherName = '';
    this.driverGrade.setValue('');
    this.searchDriverOfficialIdentityNumber = '';
    this.searchSupplier = '';
    this.searchhighestQualification = '';
    this.searchMobile = '';
    this.location.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData() {
    this.loadData();
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
  editCall(row) {
    this.driverID = row.driverID;

    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadData(); // ✅ Only reload after dialog is closed
      }
    });
  }

  deleteItem(row) {

    this.driverID = row.id;
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

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  public loadData() {
    switch (this.selectedFilter) {
      case 'driver':
        this.SearchdriverName = this.searchTerm;
        break;
      case 'driverFatherName':
        this.searchdriverFatherName = this.searchTerm;
        break;
      case 'driverGrade':
        this.driverGrade.setValue(this.searchTerm);
        break;
      case 'identityNo':
        this.searchDriverOfficialIdentityNumber = this.searchTerm;
        break;
      case 'supplier':
        this.searchSupplier = this.searchTerm;
        break;
      case 'highestQualification':
        this.searchhighestQualification = this.searchTerm;
        break;
      case 'mobile':
        this.searchMobile = this.searchTerm;
        break;
      case 'location':
        this.location.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.driverService.getTableData(this.SearchdriverName, this.searchdriverFatherName, this.driverGrade.value, this.searchDriverOfficialIdentityNumber, this.searchSupplier, this.searchhighestQualification, this.searchMobile, this.location.value, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data => {

          this.dataSource = data;
          console.log(data);
          // this.dataSource.forEach((ele)=>{
          //   if(ele.activationStatus===true){
          //     this.activeData="Active";
          //   }
          //   else{
          //     this.activeData="Deleted"
          //   }
          // })

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
  onContextMenu(event: MouseEvent, item: Driver) {
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

  InitQualification() {
    this._generalService.GetQualification().subscribe(
      data => {
        this.QualificationList = data;
      }
    );
  }
  // InitDriverGrade(){
  //   this._generalService.GetDriverGrade().subscribe(
  //     data=>{
  //       this.DriverGradeList=data;
  //     }
  //   );
  // }
  InitDriverGrade() {

    this._generalService.getDriverGrade().subscribe(
      data => {
        this.DriverGradeList = data;
        this.filteredGradeOptions = this.driverGrade.valueChanges.pipe(
          startWith(""),
          map(value => this._filterGrade(value || ''))
        );
      },
      error => {

      }
    );
  }
  private _filterGrade(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DriverGradeList?.filter(
      customer => {
        return customer.driverGradeName.toLowerCase().indexOf(filterValue) === 0;
      }
    );

  };
  PreviousCall() {

    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  // openInNewTab(menuItem: any, rowItem: any) {
  //   let baseUrl = this._generalService.FormURL;
  //   if(menuItem.label.toLowerCase() === 'driving license') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/driverDrivingLicense'], { queryParams: {
  //       DriverID: rowItem.driverID,
  //        DriverName: rowItem.driverName, 
  //     } }));

  //     window.open(baseUrl + url, '_blank'); 

  //   } else if(menuItem.label.toLowerCase() === 'document') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/driverDocument'], { queryParams: {
  //       DriverID: rowItem.driverID,
  //        DriverName: rowItem.driverName, 
  //     } }));
  //     window.open(baseUrl + url, '_blank'); 

  //   }

  //   else if(menuItem.label.toLowerCase() === 'inventory association') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/driverInventoryAssociation'], { queryParams: {
  //       DriverID: rowItem.driverID,
  //        DriverName: rowItem.driverName, 
  //        redirectingFrom:'Driver',
  //        SupplierName:rowItem.supplier,
  //        DriverPhone:rowItem.mobile1
  //     } }));
  //     window.open(baseUrl + url, '_blank'); 
  //        //console.log(CustomerGroup);
  //   }
  // }

  // driverDocument(row) {

  //   this.router.navigate([
  //     '/driverDocument',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverID: row.driverID,
  //       DriverName: row.driverName,   

  //     }
  //   }); 
  // }

  // driverInventoryAssociation(row) {

  //   this.router.navigate([
  //     '/driverInventoryAssociation',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverID: row.driverID,
  //       DriverName: row.driverName,   

  //     }
  //   }); 
  // }

  // DriverDrivingLicense(row) {
  //   this.router.navigate([
  //     '/driverDrivingLicense',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverID: row.driverID,
  //       DriverName: row.driverName,       
  //     }
  //   }); 
  // }

  /////////////////for Image Upload////////////////////////////
  openInNewTab(menuItem: any, rowItem: any) {

    let baseUrl = this._generalService.FormURL;
    const encryptedDriverID = encodeURIComponent(this._generalService.encrypt(rowItem.driverID.toString()));
    const encryptedDriverName = encodeURIComponent(this._generalService.encrypt(rowItem.driverName));
    const encryptedSupplierName = encodeURIComponent(this._generalService.encrypt(rowItem.supplier));
    const encryptedDriverPhone = encodeURIComponent(this._generalService.encrypt(rowItem.mobile1));
    const redirectingFrom = encodeURIComponent(this._generalService.encrypt('Driver'));
    if (menuItem.label.toLowerCase() === 'driving license') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/driverDrivingLicense'], {
        queryParams: {
          DriverID: encryptedDriverID,
          DriverName: encryptedDriverName,
        }
      }));

      window.open(baseUrl + url, '_blank');

    }
    else if (menuItem.label.toLowerCase() === 'document') {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/driverDocument'], {
        queryParams: {
          DriverID: encryptedDriverID,
          DriverName: encryptedDriverName,
        }
      }));

      window.open(baseUrl + url, '_blank');

    }
    else if (menuItem.label.toLowerCase() === 'inventory association') {

      const url = this.router.serializeUrl(this.router.createUrlTree(['/driverInventoryAssociation'], {
        queryParams: {
          DriverID: encryptedDriverID,
          DriverName: encryptedDriverName,
          redirectingFrom: redirectingFrom,
          supplierName: encryptedSupplierName,
          DriverPhone: encryptedDriverPhone
        }
      }));

      window.open(baseUrl + url, '_blank');
    }
  }

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
            if (this.MessageArray[0] == "DriverCreate") {
              if (this.MessageArray[1] == "DriverView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Driver Created ...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DriverUpdate") {
              if (this.MessageArray[1] == "DriverView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Driver Updated ...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DriverDelete") {
              if (this.MessageArray[1] == "DriverView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Driver Deleted ...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if(this.MessageArray[0]=="DriverClearIMEI")
          {
            if(this.MessageArray[1]=="DriverView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'IMEI Cleared ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
            else if (this.MessageArray[0] == "DriverAll") {
              if (this.MessageArray[1] == "DriverView") {
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
    if (coloumName.active === 'hub') {
      coloumName.active = "hub"
    }
    if (coloumName.active === 'location') {
      coloumName.active = "location"
    }
    this.driverService.getTableDataSort(this.SearchdriverName, this.searchdriverFatherName, this.searchdriverGradeName, this.searchDriverOfficialIdentityNumber, this.searchSupplier, this.searchhighestQualification, this.searchMobile, this.searchLocation, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }


  //-------ServiceLocation-------
  initLocation() {
    this._generalService.GetLocation().subscribe(
      data => {
        this.ServiceList = data;
        this.filteredServiceOptions = this.location.valueChanges.pipe(
          startWith(""),
          map(value => this._filterServiceLocation(value || ''))
        );
      });
  }


  private _filterServiceLocation(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    // if (!value || value.length < 3) {
    //     return [];   
    //   }
    return this.ServiceList.filter(
      data => {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  confirmClearIMEI(row)
  {

    this.driverID = row.id;
    const dialogRef = this.dialog.open(ClearIMEIDialogComponent, 
    {
      data: row
    });
  }

}



