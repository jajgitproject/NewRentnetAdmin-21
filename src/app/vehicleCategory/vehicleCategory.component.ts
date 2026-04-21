// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehicleCategoryService } from './vehicleCategory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VehicleCategory } from './vehicleCategory.model';
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
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { VehicleCategoryDropDown } from './vehicleCategoryDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-vehicleCategory',
  templateUrl: './vehicleCategory.component.html',
  styleUrls: ['./vehicleCategory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VehicleCategoryComponent implements OnInit {
  displayedColumns = [
    'vehicleCategory',
    'image',
    'previousCategory',
    'nextCategory',
    'activationStatus',
    'actions'
  ];
  dataSource: VehicleCategory[] | null;
  vehicleCategoryID: number;
  advanceTable: VehicleCategory | null;
  SearchVehicleCategory: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  activeData: string;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleCategoryLists?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptionss: Observable<VehicleCategoryDropDown[]>;

  SearchName: string = '';
  Search : FormControl = new FormControl();

  SearchLevel: string = '';
  level : FormControl = new FormControl();

  SearchPreviousCategory: string = '';
  previous : FormControl = new FormControl();

  SearchNextCategory: string = '';
  next : FormControl = new FormControl();
  vehicle_CategoryID: any;
  vehicle_Category: any;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;

  menuItems: any[] = [
    { label: 'Vehicle Category Target', tooltip: 'Vehicle Category Target' }
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public vehicleCategoryService: VehicleCategoryService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public router:Router,
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
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  InitVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.previous.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering when user types at least 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleCategoryList.filter(customer =>
    customer.vehicleCategory.toLowerCase().indexOf(filterValue) === 0
  );
}

  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  
  InitVehicleCategoriess(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptionss = this.next.valueChanges.pipe(
          startWith(""),
          map(value => this._filterNext(value || ''))
        ); 
      });
  }
  private _filterNext(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleCategoryList.filter(customer =>
    customer.vehicleCategory.toLowerCase().indexOf(filterValue) === 0
  );
}

  
  // private _filterNext(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.vehicleCategory.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  
  // openInNewTab(menuItem: any, rowItem: any) {
  //   let baseUrl = this._generalService.FormURL;
  //   if(menuItem.label.toLowerCase() === 'vehicle category target') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/vehicleCategoryTarget'], { queryParams: {
  //       VehicleCategoryID: rowItem.vehicleCategoryID,
  //       VehicleCategory: rowItem.vehicleCategory
  //     } }));
  //     //  console.log(rowItem.driverName);
  //     window.open(baseUrl + url, '_blank'); 
     
  //   }
  // }

  openInNewTab(menuItem: any, rowItem: any) {
    
    let baseUrl = this._generalService.FormURL;
    
    if (menuItem.label.toLowerCase() === 'vehicle category target') {
      // Encrypt the required values
      const encryptedVehicleCategoryID = this._generalService.encrypt(encodeURIComponent(rowItem.vehicleCategoryID));
      const encryptedVehicleCategory = this._generalService.encrypt(encodeURIComponent(rowItem.vehicleCategory));
  
      // Create the URL with the encrypted values
      const url = this.router.serializeUrl(this.router.createUrlTree(['/vehicleCategoryTarget'], { queryParams: {
        VehicleCategoryID: encryptedVehicleCategoryID,
        VehicleCategory: encryptedVehicleCategory
      }}));
  
      // Open the new tab with the encrypted URL
      window.open(baseUrl + url, '_blank');
    }
  }
  
  refresh() {
    this.SearchVehicleCategory = '';
    
    this.SearchLevel = '',
    this.next.setValue(''),
    this.previous.setValue(''),
    this.searchTerm='';
    this.selectedFilter ='search';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
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
    this.vehicleCategoryID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.vehicleCategoryID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }
  public SearchData()
  {
    this.loadData();    
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'vehicleCategory':
        this.SearchVehicleCategory = this.searchTerm;
        break;
      case 'previousCategory':
        this.previous.setValue (this.searchTerm);
        break;
      case 'nextCategory':   
        this.next.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.vehicleCategoryService.getTableData(
        this.SearchVehicleCategory,
        this.SearchLevel,
        this.previous.value,
        this.next.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {      
        this.dataSource = data;
        if(this.dataSource)
        {
          this.InitVehicleCategories();
          this.InitVehicleCategoriess();
        }
       
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
  onContextMenu(event: MouseEvent, item: VehicleCategory) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  // vehicleCategory(row) {
  //   this.router.navigate([
  //     '/vehicleCategoryTarget',  
  //   ],
  //   {
  //     queryParams: {
  //       VehicleCategoryID: row.vehicleCategoryID,
  //       VehicleCategory: row.vehicleCategory
  //     }
  //   }); 
  // }

  NextCall()
  {
    if (this.dataSource.length>0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  // SupplierID: this.supplier_ID ,
  // SupplierName:this.supplier_Name

/////////////////for Image Upload////////////////////////////
  // public response: { dbPath: '' };
  // public ImagePath: string;
  // public uploadFinished = (event) => {
  // this.response = event;
  // this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  // }
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
          if(this.MessageArray[0]=="VehicleCategoryCreate")
          {
            if(this.MessageArray[1]=="VehicleCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vehicle Category Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleCategoryUpdate")
          {
            if(this.MessageArray[1]=="VehicleCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Category Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleCategoryDelete")
          {
            if(this.MessageArray[1]=="VehicleCategoryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Category Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleCategoryAll")
          {
            if(this.MessageArray[1]=="VehicleCategoryView")
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
    this.vehicleCategoryService.getTableDataSort(this.SearchVehicleCategory,
      this.SearchLevel,
      this.previous.value,
      this.next.value,
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
}



