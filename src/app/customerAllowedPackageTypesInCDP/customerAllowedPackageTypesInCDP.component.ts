// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerAllowedPackageTypesInCDPService } from './customerAllowedPackageTypesInCDP.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerAllowedPackageTypesInCDP } from './customerAllowedPackageTypesInCDP.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentCustomerAllowedPackageTypesInCDP } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { PackageTypeDropDown } from '../general/packageTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerAllowedPackageTypesInCDP',
  templateUrl: './customerAllowedPackageTypesInCDP.component.html',
  styleUrls: ['./customerAllowedPackageTypesInCDP.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerAllowedPackageTypesInCDPComponent implements OnInit {
  displayedColumns = [
    'packageType',
    'status',
    'actions'
  ];
  dataSource: CustomerAllowedPackageTypesInCDP[] | null;
  customerAllowedPackageTypesInCDPID: number;
  advanceTable: CustomerAllowedPackageTypesInCDP | null;
  searchCustomerAllowedPackageTypesInCDP: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerGroupID: any;
  customerGroup: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  searchvehicle: string = '';
   public VehicleList?: VehicleDropDown[] = [];
    filteredVehicleOptions: Observable<VehicleDropDown[]>;
     vehicle : FormControl = new FormControl();
     public PackageTypeList?:PackageTypeDropDown[]=[];
       filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
       packageType : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerAllowedPackageTypesInCDPService: CustomerAllowedPackageTypesInCDPService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
ngOnInit() {
this.route.queryParams.subscribe(paramsData => {
  const encryptedCustomerGroupID = paramsData.CustomerGroupID;
  const encryptedCustomerGroup = paramsData.CustomerGroup;

  if (!encryptedCustomerGroupID) {
    console.error('CustomerGroupID missing in URL');
    return;
  }

  this.customerGroupID = Number(
    this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID))
  );

  // ✅ SAFE handling
  if (encryptedCustomerGroup) {
    this.customerGroup = this._generalService.decrypt(
      decodeURIComponent(encryptedCustomerGroup)
    );
  } else {
    // fallback (optional)
    this.customerGroup = '';
  }

  console.log('CustomerGroup:', this.customerGroup);

  this.loadData();
  this.InitPackageType();
  this.SubscribeUpdateService();
});

}

  refresh() {
    this.searchCustomerAllowedPackageTypesInCDP = '';
     this.packageType.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponentCustomerAllowedPackageTypesInCDP, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerGroupID: this.customerGroupID,
          customerGroup :this.customerGroup,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerAllowedPackageTypesInCDPID = row.customerAllowedPackageTypesInCDPID;
    const dialogRef = this.dialog.open(FormDialogComponentCustomerAllowedPackageTypesInCDP, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerGroupID: this.customerGroupID,
        customerGroup :this.customerGroup,
      }
    });

  }
  deleteItem(row)
  {

    this.customerAllowedPackageTypesInCDPID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
  public loadData() {
    switch (this.selectedFilter)
    {
     
      case 'packageType':
        this.packageType.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
  if (this.customerGroupID === null || this.customerGroupID === undefined) {
    console.warn('Blocked API call: CustomerGroupID is undefined');
    return;
  }

  this.customerAllowedPackageTypesInCDPService
    .getTableData(
      this.customerGroupID,
     this.packageType.value,
      this.SearchActivationStatus,
      this.PageNumber
    )
    .subscribe(
      data => (this.dataSource = data),
      (error: HttpErrorResponse) => (this.dataSource = null)
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
  onContextMenu(event: MouseEvent, item: CustomerAllowedPackageTypesInCDP) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    if (this.dataSource.length>0) 
    {
     
      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
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
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
  
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CustomerAllowedPackageTypesInCDPCreate")
          {
            if(this.MessageArray[1]=="CustomerAllowedPackageTypesInCDPView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Allowed Package Type Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAllowedPackageTypesInCDPUpdate")
          {
            if(this.MessageArray[1]=="CustomerAllowedPackageTypesInCDPView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Allowed Package Type Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAllowedPackageTypesInCDPDelete")
          {
            if(this.MessageArray[1]=="CustomerAllowedPackageTypesInCDPView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Allowed Package Type Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAllowedPackageTypesInCDPAll")
          {
            if(this.MessageArray[1]=="CustomerAllowedPackageTypesInCDPView")
            {
              if(this.MessageArray[2]=="Failure")
              {
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
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
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

  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.customerAllowedPackageTypesInCDPService.getTableDataSort(this.customerGroupID,this.searchvehicle,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
 //------------Package Type -----------------
   InitPackageType(){
    this._generalService.GetPackageType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
          this.filteredPackageTypeOptions = this.packageType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }

  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.PackageTypeList?.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



