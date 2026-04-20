// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SearchDriverByLocationService } from './searchDriverByLocation.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SearchDriverByLocation } from './searchDriverByLocation.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormBuilder, FormControl } from '@angular/forms';
import moment from 'moment';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
//import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
//import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { ActivatedRoute } from '@angular/router';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';
import { DriverInventoryAssociationService } from '../driverInventoryAssociation/driverInventoryAssociation.service';
import { DriverInventoryAssociation } from '../driverInventoryAssociation/driverInventoryAssociation.model';
import { CarAndDriverAllotmentData } from '../CarAndDriverAllotment/CarAndDriverAllotment.model';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  standalone: false,
  selector: 'app-searchDriverByLocation',
  templateUrl: './searchDriverByLocation.component.html',
  styleUrls: ['./searchDriverByLocation.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SearchDriverByLocationComponent implements OnInit {
  displayedColumns = [
    'registrationNumber',
    'driverName',
    'vehicle',
    'vehicleCategory',
    'phone',
    'ownedSupplied',
    //'driverInventoryAssociationStatus',
    //'status',
    //'actions'
  ];
  
  dataSource: SearchDriverByLocation[] | null;
  searchDriverByLocationID: number;
  advanceTable: SearchDriverByLocation | null;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();

  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];

  filteredDriverOptions:Observable<DriverDropDown[]>;
  public DriverList?:DriverDropDown[]=[];
  filteredInventoryOptions:Observable<VehicleDropDown[]>;
  public InventoryList:VehicleDropDown[]=[];
  
  searchDriverName:string='';
  driver : FormControl=new FormControl();
  showAddressError: boolean = false;

  
  searchInventoryName:string="";
  inventory : FormControl=new FormControl();
  searchVehicle:string="";
  vehicle : FormControl=new FormControl();
  searchVehicleCategory:string="";
  vehicleCategory : FormControl=new FormControl();


  searchendDate: string = '';
  endDate : FormControl = new FormControl();

  
  startDate: string = '';
  //startDate : FormControl = new FormControl();
  time : FormControl = new FormControl();
  locationString : string='';
  latitude : string='';
  longitude : string='';
  public driverInventoryAssociationDataSource:DriverInventoryAssociation[] | null;
  totalData = 0;
  isLoading = true;

  searchAssociationStatus:boolean=true;
  searchActivationStatus : boolean=true;
  activeData: string;
  inventoryID: any;
  driverID: number;
  driverName: any;

  advanceTableForm = this.fb.group({
    inventoryID: [''],
    vehicleNameID: [''],
    vehicleCategoryID: ['']
    })
  vehicleNameID: any;
  vehicleCategoryID: any;
  action: string;
  eTRAvailabilityDate: string = '';
  eTRAvailabilityTime: string='';
  pickupDate: string='';
  addressString: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  eTRAvailabilityGeoLocation: string='';

  constructor(
    public driverInventoryAssociationService: DriverInventoryAssociationService,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public searchDriverByLocationService: SearchDriverByLocationService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    private fb: FormBuilder,
    public route:ActivatedRoute,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      this.driverID   = paramsData.DriverID;
       this.driverName=paramsData.DriverName;
    });
    this.loadData();
    this.initDriver();
  }

  // openModal() {
  //   this.searchDriverByLocationService.open(SearchDriverByLocationComponent); // Pass the modal component to open
  // }
  
  refresh() {
    this.driver.setValue('');
    this.eTRAvailabilityGeoLocation='';
    this.eTRAvailabilityTime='';
    this.eTRAvailabilityDate='';
    //this.vehicleCategory.setValue('');
    this.searchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

//   AddressChange(address: Address) {
//     this.addressString = address.formatted_address;
//     this.latitude = address.geometry.location.lat().toString();
//     this.longitude = address.geometry.location.lng().toString();
//     this.locationString = this.addressString;
//     this.eTRAvailabilityGeoLocation = `POINT (${this.longitude} ${this.latitude})`;
//     //this.eTRAvailabilityGeoLocation=`POINT (77.1024909999999 28.7040592)`;
//     console.log(this.eTRAvailabilityGeoLocation);
// }
AddressChange(address: any) {

  this.addressString = address.formatted_address;
  this.latitude = address.geometry.location.lat().toString();
  this.longitude = address.geometry.location.lng().toString();

  this.locationString = this.addressString;
  this.eTRAvailabilityGeoLocation =
    `POINT (${this.longitude} ${this.latitude})`;

  this.showAddressError = false; // ✅ error remove
}



onTyping() {
  this.latitude = '';
  this.longitude = '';
  this.eTRAvailabilityGeoLocation = '';
  this.showAddressError = true;
}


  

public loadData() 
{
  if(this.driverID===undefined)
  {
    this.driverID=0;
  }
  if(this.eTRAvailabilityTime!==""){
    this.eTRAvailabilityTime=moment(this.eTRAvailabilityTime).format('HH:mm');
  }
  if(this.eTRAvailabilityDate!==""){
    this.eTRAvailabilityDate=moment(this.eTRAvailabilityDate).format('MMM DD yyyy');
  }
  this.searchDriverByLocationService.getTableData(
    this.driverID,
    this.driver.value,
    this.eTRAvailabilityDate,
    this.eTRAvailabilityTime,
    this.eTRAvailabilityGeoLocation,
    this.searchActivationStatus, 
    this.PageNumber).subscribe
   (
    (data:CarAndDriverAllotmentData) =>   
      {
        if (data != null) {
        this.driverInventoryAssociationDataSource = data.driverInventoryAssociationModel;
        console.log(this.driverInventoryAssociationDataSource)
        this.driverInventoryAssociationDataSource?.forEach(element => {
          Object.assign(element, { checked: false });
        });
        this.totalData = data.totalRecords;
        }
        else
        {
          this.driverInventoryAssociationDataSource=null;
          this.totalData=0;
        }
      },
      (error: HttpErrorResponse) => { this.driverInventoryAssociationDataSource = null;}
    );
}

//-------Driver-------
  initDriver(){
    this._generalService.GetDriver().subscribe(
      data=>
      {
        this.DriverList=data;
        this.filteredDriverOptions = this.driver.valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriver(value || ''))
        ); 
      });
  }
  private _filterDriver(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DriverList.filter(
      customer => 
      {
        return customer.driverName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  getDriverID(driverID:any) {
    this.driverID=driverID;
    this.advanceTableForm.patchValue({driverID:this.driverID});
  }


//--------------Time-------------
  locationTimeSet(event) {
    if (this.action === 'edit') {
      let time = this.advanceTableForm.value.pickupTime;
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
    else {
      let time = event.getTime();
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
  }

  // addNew()
  // {
  //   const dialogRef = this.dialog.open(FormDialogComponent, 
  //   {
  //     data: 
  //       {
  //         advanceTable: this.advanceTable,
  //         action: 'add',
  //         driverID: this.driverID,
  //         driverName :this.driverName,
  //       }
  //   });
  // }

//   editCall(row) {
//     //  alert(row.id);
//   this.searchDriverByLocationID = row.searchDriverByLocationID;
//   const dialogRef = this.dialog.open(FormDialogComponent, {
//     data: {
//       advanceTable: row,
//       action: 'edit',
//       driverID: this.driverID,
//       driverName :this.driverName,
//     }
//   });

// }
// deleteItem(row)
// {

//   this.searchDriverByLocationID = row.id;
//   const dialogRef = this.dialog.open(DeleteDialogComponent, 
//   {
//     data: row
//   });
// }

public Filter()
{
  this.PageNumber = 0;
  this.loadData();
}

// public SearchData()
// {
 
//   this.loadData();
// }


SearchData() {

  if (!this.latitude || !this.longitude) {
    this.showAddressError = true;
    return;
  }

  this.loadData();
}



  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: SearchDriverByLocation) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall()
  {
    //console.log(this.dataSource.length>0)
    if (this.driverInventoryAssociationDataSource.length>0) 
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


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}


