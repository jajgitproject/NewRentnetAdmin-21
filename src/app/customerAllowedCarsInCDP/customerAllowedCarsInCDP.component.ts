// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerAllowedCarsInCDPService } from './customerAllowedCarsInCDP.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerAllowedCarsInCDP } from './customerAllowedCarsInCDP.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentCustomerAllowedCarsInCDP } from './dialogs/form-dialog/form-dialog.component';
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
@Component({
  standalone: false,
  selector: 'app-customerAllowedCarsInCDP',
  templateUrl: './customerAllowedCarsInCDP.component.html',
  styleUrls: ['./customerAllowedCarsInCDP.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerAllowedCarsInCDPComponent implements OnInit {
  displayedColumns = [
    'vehicle',
    'status',
    'actions'
  ];
  dataSource: CustomerAllowedCarsInCDP[] | null;
  customerAllowedCarsInCDPID: number;
  advanceTable: CustomerAllowedCarsInCDP | null;
  searchCustomerAllowedCarsInCDP: string = '';
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

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerAllowedCarsInCDPService: CustomerAllowedCarsInCDPService,
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
  this.initVehicle();
  this.SubscribeUpdateService();
});

}

  refresh() {
    this.searchCustomerAllowedCarsInCDP = '';
    this.vehicle.setValue('');
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
    const dialogRef = this.dialog.open(FormDialogComponentCustomerAllowedCarsInCDP, 
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
    this.customerAllowedCarsInCDPID = row.customerAllowedCarsInCDPID;
    const dialogRef = this.dialog.open(FormDialogComponentCustomerAllowedCarsInCDP, {
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

    this.customerAllowedCarsInCDPID = row.id;
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
     
      case 'vehicle':
        this.vehicle.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
  if (this.customerGroupID === null || this.customerGroupID === undefined) {
    console.warn('Blocked API call: CustomerGroupID is undefined');
    return;
  }

  this.customerAllowedCarsInCDPService
    .getTableData(
      this.customerGroupID,
     this.vehicle.value,
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
  onContextMenu(event: MouseEvent, item: CustomerAllowedCarsInCDP) {
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
          if(this.MessageArray[0]=="CustomerAllowedCarsInCDPCreate")
          {
            if(this.MessageArray[1]=="CustomerAllowedCarsInCDPView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Allowed Car Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAllowedCarsInCDPUpdate")
          {
            if(this.MessageArray[1]=="CustomerAllowedCarsInCDPView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Allowed Car Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAllowedCarsInCDPDelete")
          {
            if(this.MessageArray[1]=="CustomerAllowedCarsInCDPView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Allowed Car Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAllowedCarsInCDPAll")
          {
            if(this.MessageArray[1]=="CustomerAllowedCarsInCDPView")
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
    this.customerAllowedCarsInCDPService.getTableDataSort(this.customerGroupID,this.searchvehicle,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
  initVehicle(){
      this._generalService.GetVehicle().subscribe(
        data=>{
          this.VehicleList=data;
          this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
            startWith(""),
            map(value => this._filterVehicle(value || ''))
          ); 
  
        }
      )
    
    }
    private _filterVehicle(value: string): any {
      const filterValue = value.toLowerCase();
      return this.VehicleList.filter(
        customer => 
        {
          return customer.vehicle.toLowerCase().indexOf(filterValue)===0;
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



