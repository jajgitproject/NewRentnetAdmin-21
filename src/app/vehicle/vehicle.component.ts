// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehicleService } from './vehicle.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Vehicle } from './vehicle.model';
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
import { VehicleCategoryDropDown } from '../general/vehicleCategoryDropDown.model';
import { VehicleManufacturerDropDown } from '../vehicleManufacturer/vehicleManufacturerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VehicleComponent implements OnInit {
  displayedColumns = [
    'vehicle',
    'oldRentNetCar_Type',
    'vehicleCategory',
    'vehicleManufacturer',
    'image',
    'vehicleSittingCapacity',
    'vehicleBaggageCapacity',
    'vehicleAcrissCode',
    'status',
    'actions'
  ];
  dataSource: Vehicle[] | null;
  vehicleID: number;
  advanceTable: Vehicle | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  public VehicleManufacturerList?: VehicleManufacturerDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleCategoryDropDown[]>;
  filteredVehicleManufacturerOptions: Observable<VehicleManufacturerDropDown[]>;
  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchCategory: string = '';
  category : FormControl = new FormControl();

  SearchManufacturer: string = '';
  manufacturer : FormControl = new FormControl();

  SearchAcrissCode: string = '';
  acrissCode : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public vehicleService: VehicleService,
    private snackBar: MatSnackBar,
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
    this.initVehicleCategories();
    this.initVehicleManufacturer();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  refresh() {
    this.SearchName = '';
    this.category.setValue(''),
    this.manufacturer.setValue(''),
    this.SearchAcrissCode = '', 
 this.searchTerm='';
 this.selectedFilter ='search'; 
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  initVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleOptions = this.category.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after 3 characters
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
  
  initVehicleManufacturer(){
    this._generalService.GetVehicleManufacturer().subscribe(
      data=>
      {
        this.VehicleManufacturerList=data;
        
        this.filteredVehicleManufacturerOptions = this.manufacturer.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleManufacturer(value || ''))
        ); 
      });
  }
  
  private _filterVehicleManufacturer(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleManufacturerList.filter(
      customer => 
      {
        return customer.vehicleManufacturer.toLowerCase().indexOf(filterValue)===0;
      }
    );
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
    this.vehicleID = row.vehicleID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
   
  }
  deleteItem(row)
  {

    this.vehicleID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
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
      case 'vehicle':
        this.SearchName = this.searchTerm;
        break;
      case 'category':
        this.category.setValue(this.searchTerm);
        break;
      case 'manufacturer':
        this.manufacturer.setValue(this.searchTerm);
        break;
      case 'acrissCode':
        this.SearchAcrissCode = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }

      this.vehicleService.getTableData(this.SearchName,
      this.category.value,
      this.manufacturer.value,
      this.SearchAcrissCode,  
      this.SearchActivationStatus, 
      this.PageNumber).subscribe
      (
      data =>   
      {

        this.dataSource = data;
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        //   if(ele.activationStatus===false){
        //     this.activeData="Deleted";
        //   }
        //})
       
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
  onContextMenu(event: MouseEvent, item: Vehicle) {
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
          if(this.MessageArray[0]=="VehicleCreate")
          {
            if(this.MessageArray[1]=="VehicleView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vehicle Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleUpdate")
          {
            if(this.MessageArray[1]=="VehicleView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleDelete")
          {
            if(this.MessageArray[1]=="VehicleView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vehicle Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VehicleAll")
          {
            if(this.MessageArray[1]=="VehicleView")
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
    this.vehicleService.getTableDataSort(this.SearchName,
      this.SearchCategory,
      this.SearchManufacturer,
      this.SearchAcrissCode,  
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

    onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/Flag_of_Not.png';
  }
}



