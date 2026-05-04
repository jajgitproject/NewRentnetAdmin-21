// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from './inventory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Inventory } from './inventory.model';
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
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategory } from '../vehicleCategory/vehicleCategory.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InventoryComponent implements OnInit {
  displayedColumns = [
    'vehicleCategory',
    'vehicle',
    'registrationNumber',
    'supplierName',
    'supplierOfficialIdentityNumber',
    'locationHub',
    'isAdhoc',
    'status',
    'actions'
  ];
  dataSource: Inventory[] | null;
  inventoryID: number;
  advanceTable: Inventory | null;
  InventoryID: number = 0;
  SearchActivationStatus : string='';
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  SearchVehcileCategory:string='';
  vehicleCategory:FormControl=new FormControl();

  SearchVehicle:string='';
  vehicle:FormControl=new FormControl();

  SearchSupplier:string='';
  supplier:FormControl=new FormControl();
  registrationNumber: FormControl = new FormControl();
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];
    filteredServiceOptions:Observable<OrganizationalEntityDropDown[]>;
     public ServiceList?:OrganizationalEntityDropDown[]=[];
      public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
        filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  // SearchRegNumber:string='';
  // regNumber:FormControl=new FormControl();
    locationHub: FormControl = new FormControl();
    searchLocationHub: string = '';

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  menuItems: any[] = [
    { label: 'Block', route: '/inventoryBlock', tooltip: 'Inventory Block' },
    { label: 'Status History', route: '/inventoryStatusHistory', tooltip: 'Inventory Status History' },
    { label: 'Target', route: '/inventoryTarget', tooltip: 'Inventory Target' },
    { label: 'Insurance', route: '/inventoryInsurance', tooltip: 'Inventory Insurance' },
    { label: 'Permit', route: '/inventoryPermit', tooltip: 'Inventory Permit' },
    { label: 'Tax', route: '/interstateTaxEntry', tooltip: 'Interstate Tax' },
    { label: 'PUC', route: '/inventoryPUC', tooltip: 'Inventory PUC' },
    { label: 'Fitness', route: '/inventoryFitness', tooltip: 'Inventory Fitness' },
    { label: 'Monthly Business Report', route: '/monthlyBusinessReport', tooltip: 'Monthly Business Report' },
    { label: 'Driver Association', route:'/driverInventoryAssociation', tooltip: 'Driver Association' },
    { label: 'Document', route:'/inventoryDocument', tooltip: 'Inventory Document' }
  ];
  
  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
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
    this.SubscribeUpdateService();
    this.InitSupplier();
    this.initVehicleCategories();
    this.initVehicle();
    this.InitRegistrationNumber();
    this.InitLocationHub();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
  }
  
  // InitVehicleCategory(){
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data=>{
  //       this.VehicleCategoryList=data;
  //     }
  //   )
  // }
  initVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.vehicleCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
  if (!value || value.length < 3) {
    return [];
  }
  const filterValue = value.toLowerCase();
  return this.VehicleCategoryList.filter(
    customer => 
    {
      return customer.vehicleCategory.toLowerCase().includes(filterValue);
    }
  );
}  initVehicle(){
    this._generalService.GetVehicle().subscribe(
      data=>
      {
        this.VehicleList=data;
        this.filteredVehicleOptions = this.vehicle.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        ); 
      });
  }
  
  private _filterVehicle(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }
  
  InitSupplier(){
    this._generalService.getSuppliersForInventory().subscribe(
      data=>
      {
        this.SupplierList=data;
        this.filteredSupplierOptions = this.supplier.valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplier(value || ''))
        ); 
      });
  }

  private _filtersearchSupplier(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.SupplierList.filter(
      customer => 
      {
        return customer.supplierName.toLowerCase().includes(filterValue);
      }
    );
  }

  InitRegistrationNumber(){
    this._generalService.GetRegistrationForDropDown().subscribe(
      data=>
      {
        this.RegistrationNumberList=data;
        this.filteredRegistrationNumberOptions = this.registrationNumber.valueChanges.pipe(
          startWith(""),
          map(value => this._filterRN(value || ''))
        ); 
      });
  }
  
  private _filterRN(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.RegistrationNumberList.filter(
      customer => 
      {
        return customer.registrationNumber.toLowerCase().includes(filterValue);
      }
    );
  }
  getSearchOptions(): Observable<any[]> {
    switch(this.selectedFilter) {
      case 'vehicleCategory':
        return this.vehicleCategory.valueChanges.pipe(
          startWith(this.searchTerm),
          map(value => this._filterSearchOptions(value || '', 'vehicleCategory'))
        );
      case 'vehicle':
        return this.vehicle.valueChanges.pipe(
          startWith(this.searchTerm),
          map(value => this._filterSearchOptions(value || '', 'vehicle'))
        );
      case 'registrationNumber':
        return this.registrationNumber.valueChanges.pipe(
          startWith(this.searchTerm),
          map(value => this._filterSearchOptions(value || '', 'registrationNumber'))
        );
      case 'supplier':
        return this.supplier.valueChanges.pipe(
          startWith(this.searchTerm),
          map(value => this._filterSearchOptions(value || '', 'supplier'))
        );
      default:
        return new Observable(observer => observer.next([]));
    }
  }

  private _filterSearchOptions(value: string, type: string): any[] {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    
    switch(type) {
      case 'vehicleCategory':
        return this.VehicleCategoryList.filter(item =>
          item.vehicleCategory.toLowerCase().includes(filterValue)
        ).map(item => ({ displayValue: item.vehicleCategory }));
      case 'vehicle':
        return this.VehicleList.filter(item =>
          item.vehicle.toLowerCase().includes(filterValue)
        ).map(item => ({ displayValue: item.vehicle }));
      case 'registrationNumber':
        return this.RegistrationNumberList.filter(item =>
          item.registrationNumber.toLowerCase().includes(filterValue)
        ).map(item => ({ displayValue: item.registrationNumber }));
      case 'supplier':
        return this.SupplierList.filter(item =>
          item.supplierName.toLowerCase().includes(filterValue)
        ).map(item => ({ displayValue: item.supplierName }));
      default:
        return [];
    }
  }

  refresh() {
    this.registrationNumber.setValue(''),
    this.vehicleCategory.setValue(''),
    this.vehicle.setValue(''),
    this.supplier.setValue(''),
     this.locationHub.setValue(''),
    this.SearchActivationStatus = '';
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
      //  alert(row.id);
    this.inventoryID = row.inventoryID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
       
      }
    });

  }
  deleteItem(row)
  {

    this.inventoryID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    // Check if item status is 'Deactive' or any other condition you want to consider
    return item.status !== 'Deactive' && !item.isDeleted; // Assuming you have an isDeleted property
  }
  public Filter()
  {
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

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'vehicleCategory':
        this.vehicleCategory.setValue(this.searchTerm);
        break;
      case 'vehicle':
        this.vehicle.setValue(this.searchTerm);
          break;
      case 'registrationNumber':
        this.registrationNumber.setValue(this.searchTerm);
        break;
      case 'supplier':
        this.supplier.setValue(this.searchTerm);
        break;
        case 'locationHub':
        this.locationHub.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.inventoryService.getTableData( this.registrationNumber.value, this.InventoryID,
        this.vehicleCategory.value,
        this.vehicle.value,
        this.supplier.value,
        this.locationHub.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
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
  onContextMenu(event: MouseEvent, item: Inventory) {
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

  // openInNewTab(menuItem: any, rowItem: any) {
  //   const formURL = this._generalService.FormURL;
  //   const queryParams = {
  //     InventoryID: rowItem.inventoryID,
  //     RegNo: rowItem.registrationNumber,
  //     Vehicle:rowItem.vehicle,
  //     VehicleCategory:rowItem.vehicleCategory,
  //     redirectingFrom:'Inventory',
  //     supplierName:rowItem.supplier
  //   };
   
  //   const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
  
  //   window.open(formURL + url, '_blank');
  // }

  openInNewTab(menuItem: any, rowItem: any) {
    const formURL = this._generalService.FormURL;
  
    const queryParams = {
      InventoryID: encodeURIComponent(this._generalService.encrypt(rowItem.inventoryID.toString())),
      RegNo: encodeURIComponent(this._generalService.encrypt(rowItem.registrationNumber)),
      Vehicle: encodeURIComponent(this._generalService.encrypt(rowItem.vehicle)),
      VehicleCategory: encodeURIComponent(this._generalService.encrypt(rowItem.vehicleCategory)),
      redirectingFrom: encodeURIComponent(this._generalService.encrypt('Inventory')),
      SupplierName: encodeURIComponent(this._generalService.encrypt(rowItem.supplier)),
      supplierID: encodeURIComponent(this._generalService.encrypt(rowItem.supplierID.toString())),
    };
  
    const url = this.router.serializeUrl(this.router.createUrlTree([menuItem.route], { queryParams }));
  
    window.open(formURL + url, '_blank');
  }
  
  // inventoryStatus(row) {
  //   this.router.navigate([
  //     '/inventoryStatusHistory',  
  //   ],
  //   {
  //     queryParams: {
  //       InventoryID: row.inventoryID,
  //       RegistrationNumber: row.registrationNumber,
  //       //vehicleID:row.vehicleID,
  //       vechicleName: row.vehicle,
  //     }
  //   }); 
  // }

  // inventoryTarget(row) {
  //   this.router.navigate([
  //     '/inventoryTarget',  
  //   ],
  //   {
  //     queryParams: {
  //       InventoryID: row.inventoryID,
  //       RegistrationNumber: row.registrationNumber,
  //       // vehicleID:row.vehicleID,
  //       // vechicleName: row.vehicle,
  //     }
  //   }); 
  // }

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
          if(this.MessageArray[0]=="InventoryCreate")
          {
            if(this.MessageArray[1]=="InventoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Inventory Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryUpdate")
          {
            if(this.MessageArray[1]=="InventoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryDelete")
          {
            if(this.MessageArray[1]=="InventoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Inventory Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InventoryAll")
          {
            if(this.MessageArray[1]=="InventoryView")
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
    this.inventoryService.getTableDataSort(this.registrationNumber.value, this.InventoryID,
        this.vehicleCategory.value,
        this.vehicle.value,
        this.supplier.value,
        this.locationHub.value,
        this.SearchActivationStatus,
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  // InventoryInsurance(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryInsurance',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }

  // InventoryPermit(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryPermit',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }
  // MonthlyBusinessReport(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/monthlyBusinessReport',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }

  // InterstateTax(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/vehicleInterStateTax',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber,
  //      redirectingFrom:'Inventory'
  //    }
  //  });
  // }

  // InventoryPUC(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryPUC',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }
  // InventoryFitness(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryFitness',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }
  // InventoryBlock(row) {
   
  //   this.inventoryID = row.inventoryID;
  //  this.router.navigate([
  //    '/inventoryBlock',       
    
  //  ],{
  //    queryParams: {
  //      InventoryID: this.inventoryID,
  //      RegNo:row.registrationNumber
  //    }
  //  });
  // }

   //-------ServiceLocation-------
  InitLocationHub(){
    this._generalService.GetLocationHub().subscribe(
      data=>
      {
        this.OrganizationalEntitiesList=data;
        this.filteredOrganizationalEntityOptions = this.locationHub.valueChanges.pipe(
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
    if (!value || value.length < 3) {
        return [];   
      }
    return this.OrganizationalEntitiesList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }
  

}



