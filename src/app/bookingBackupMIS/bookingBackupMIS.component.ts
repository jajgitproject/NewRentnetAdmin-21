// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { BookingBackupMISService } from './bookingBackupMIS.service';
import { BookingBackupMIS, SalesPersonModel } from './bookingBackupMIS.model';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';

@Component({
  standalone: false,
  selector: 'app-bookingBackupMIS',
  templateUrl: './bookingBackupMIS.component.html',
  styleUrls: ['./bookingBackupMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookingBackupMISComponent implements OnInit {
  displayedColumns = [
    'ReservationID',
    'DutySlipID',
    'CustomerName', 
    'CustomerGroup',
    'BookerName',
    'BookerMobile',    
    'GstNumber',
    'GuestName',
    'Gender',
    'Importance',
    'PrimaryMobile',
    'PrimaryEmail',
    'CustomerDepartment',
    'CustomerDesignation',
    'SupplierName',
    'ModeOfPayment',
    'PackageType',
    'Package',
    'City',    
    'PickupAddress',
    'GeoPointType',
    'GeoPointName',
    'PickupDate', 
    'ReservationInternalNote',
    'SalesPerson',
    'ServiceLocation',
    'TransferLocation',
    'SpecialInstruction',    
    'Vehicle',
    'RegistrationNumber',
    'DriverName',
    'DriverMobile',
    'BookingDate',
    'CancellationDateTime',
    'ManualDutySlipNumber',
    'LoggedInUser',
    'TripStatus',
    'ReservationStatus',
    'BookingType',
    'CustomerSpecificFields',
  

  ];

  dataSource: BookingBackupMIS[] | null;
  employeeID: number;
  row: BookingBackupMIS | null;
  SearchName: string = '';
  IsLockedOut:boolean=true;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  userType:string='Employee';
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;
public PaymentModeList?:ModeOfPaymentDropDown[]=[];
 filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]>;
   filteredCustomerOptions:Observable<CustomerDropDown[]>;
   public CustomerList?:CustomerDropDown[]=[];
   filteredServiceOptions:Observable<OrganizationalEntityDropDown[]>;
   public ServiceList?:OrganizationalEntityDropDown[]=[];
   filteredCityOptions:Observable<CityDropDown[]>;
   public CityList?:CityDropDown[]=[];
   salesPerson: FormControl = new FormControl();
public SalesPersonList?: SalesPersonModel[] = [];
filteredSalesPersonOptions: Observable<SalesPersonModel[]>;

filteredCustomerLocationOptions:Observable<OrganizationalEntityDropDown[]>;
public CustomerLocationList?:OrganizationalEntityDropDown[]=[];
filteredCustomerPersonOptions:Observable<CustomerPersonDetailsDropDown[]>;
public CustomerPersonList?:CustomerPersonDetailsDropDown[]=[];

filteredBookerOptions:Observable<CustomerPersonDetailsDropDown[]>;
public BookerList?:CustomerPersonDetailsDropDown[]=[];

filteredGeoPointTypeOptions:Observable<GeoPointTypeDropDown[]>;
public GeoPointTypeList?:GeoPointTypeDropDown[]=[];

filteredPickupSpotOptions:Observable<StatesDropDown[]>;
public PickupSpotList?:StatesDropDown[]=[];

filteredOptions: Observable<CustomerGroupDropDown[]>;
public customerGroupList?: CustomerGroupDropDown[] = [];
searchCustomerGroup:string='';
customerGroup : FormControl=new FormControl();
bookerName: FormControl = new FormControl();
searchBookerName:string='';

  searchTerm: any = '';
  selectedFilter: string = 'search';
  searchModeOfPayment:string='';
  modeOfPayment : FormControl=new FormControl();
  searchCustomerName:string='';
  customer : FormControl=new FormControl();
  searchServiceLocation:string='';
  serviceLocation : FormControl=new FormControl();
  searchCity:string='';
  city : FormControl=new FormControl();
  searchCustomerLocation:string='';
  customerLocation : FormControl=new FormControl();
  searchGuestName:string='';
  guestName : FormControl=new FormControl();
  searchPickupDetail:string='';
  pickupDetail : FormControl=new FormControl();
  searchPickupSubDetail:string='';
  pickupSubDetail : FormControl=new FormControl();
  searchDutySlip:any='';
  searchManualDS:any='';
  searchBooking:any='';
  searchFromDate:string='';
  searchToDate:string='';
  searchBookingStatus:string='';
  searchDispatchStatus:string='';
  searchCancellationFrom:string='';
  searchCancellationTo:string='';
  searchSalesPerson:string='';
  geoPointTypeID: any;


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public bookingBackupMISService: BookingBackupMISService,
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
    this.InitPaymentMode();
    this.initCustomerGroup();
    this.initCustomer();
    this.InitBooker();
    this.initCity();
    this.InitSalesPerson();
    this.InitGuestDetails();
    this.initCustomerLocation();
    this.initServiceLocation();
    this.InitPickupDetails();
    this.SubscribeUpdateService();

  }

  //-------------Mode of Payment ------------------
  InitPaymentMode(){
    this._generalService.GetModeOfPayment().subscribe(
      data=>
      {                
        this.PaymentModeList=data;
        this.filteredPaymentModeOptions = this.modeOfPayment.valueChanges.pipe(
         startWith(""),
         map(value => this._filterPaymentMode(value || ''))
          );
      });
  }
  
  private _filterPaymentMode(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    // if (!value || value.length < 3) {
    //     return [];   
    //   }
    return this.PaymentModeList?.filter(
      data => 
      {
        return data.modeOfPayment.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
//------CustomerGroup ---------
initCustomerGroup(){
  this._generalService.getCustomerGroup().subscribe(
    data=>{
      this.customerGroupList=data;
      this.filteredOptions = this.customerGroup.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || ''))
      );

    }
  )
}
private _filter(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3) {
  //       return [];   
  //     }
  // if(filterValue.length === 0) {
  //     return [];
  //   }
  return this.customerGroupList.filter(
    customer => 
    {
      return customer.customerGroup.toLowerCase().includes(filterValue);
    }
  );
  
};



  //-------Customer-------
  initCustomer(){
    this._generalService.getCustomers().subscribe(
      data=>
      {
        this.CustomerList=data;
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        ); 
      });
  }

  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //     return [];   
    //   }
    // if(filterValue.length === 0) {
    //   return [];
    // }
    return this.CustomerList.filter(
      data => 
      {
        return data.customerName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  //-------ServiceLocation-------
  initServiceLocation(){
    this._generalService.GetLocation().subscribe(
      data=>
      {
        this.ServiceList=data;
        this.filteredServiceOptions = this.serviceLocation.valueChanges.pipe(
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
      data => 
      {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  //-------CustomerLocation-------
  initCustomerLocation(){
    this._generalService.GetLocation().subscribe(
      data=>
      {
        this.CustomerLocationList=data;
        this.filteredCustomerLocationOptions = this.customerLocation.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerLocation(value || ''))
        ); 
      });
  }
  private _filterCustomerLocation(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    // if (!value || value.length < 3) {
    //     return [];   
    //   }
    return this.CustomerLocationList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  //-------City-------
  initCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
  }

  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    // if(filterValue.length === 0) {
    //   return [];
    // }
    // if (!value || value.length < 3) {
    //     return [];   
    //   }
    return this.CityList.filter(
      data => 
      {
        return data.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }


//---------Sales Person-----------
InitSalesPerson()
  {
    this._generalService.GetSalesPersonForBookingMIS().subscribe(
    data=>
    {
      this.SalesPersonList=data;
      this.filteredSalesPersonOptions = this.salesPerson.valueChanges.pipe(
      startWith(""),
      map(value => this._filterSalesPerson(value || ''))
      ) 
    });;
  }

  private _filterSalesPerson(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3) {
  //       return [];   
  //     }
  //  if(filterValue.length === 0) {
  //     return [];
  //   }
    return this.SalesPersonList?.filter(
    data => 
    {
      return data.salesPerson.toLowerCase().indexOf(filterValue)===0;
    });
  }


    //---------Booker Name-----------
InitBooker()
{
  this._generalService.getCustomerPersonDetails().subscribe(
  data=>
  {
    this.BookerList=data;
    this.filteredBookerOptions = this.bookerName.valueChanges.pipe(
    startWith(""),
    map(value => this._filterBookerDetails(value || ''))
    ) 
  });;
}

private _filterBookerDetails(value: string): any {
const filterValue = value.toLowerCase();
// if (!value || value.length < 3) {
//         return [];   
//       }
//  if(filterValue.length === 0) {
//     return [];
//   }
  return this.BookerList?.filter(
  data => 
  {
    return data.customerPersonName.toLowerCase().indexOf(filterValue)===0;
  });
}

  //---------Guest Name-----------
InitGuestDetails()
{
  this._generalService.getCustomerPersonDetails().subscribe(
  data=>
  {
    this.CustomerPersonList=data;
    this.filteredCustomerPersonOptions = this.guestName.valueChanges.pipe(
    startWith(""),
    map(value => this._filterGuestDetails(value || ''))
    ) 
  });;
}

private _filterGuestDetails(value: string): any {
const filterValue = value.toLowerCase();
// if (!value || value.length < 3) {
//         return [];   
//       }
//  if(filterValue.length === 0) {
//     return [];
//   }
  return this.CustomerPersonList?.filter(
  data => 
  {
    return data.customerPersonName.toLowerCase().indexOf(filterValue)===0;
  });
}

  //---------Pickup Detail-----------
  InitPickupDetails()
  {
    this._generalService.GetGeoPointTypeForReservation().subscribe(
    data=>
    {
      this.GeoPointTypeList=data;
      this.filteredGeoPointTypeOptions = this.pickupDetail.valueChanges.pipe(
      startWith(""),
      map(value => this._filterPickupDetails(value || ''))
      ) 
    });;
  }
  
  private _filterPickupDetails(value: string): any 
  {
  const filterValue = value.toLowerCase();
  //  if(filterValue.length === 0) {
  //     return [];
  //   }
  // if (!value || value.length < 3) {
  //       return [];   
  //     }
    return this.GeoPointTypeList?.filter(
    data => 
    {
      return data.geoPointType.toLowerCase().indexOf(filterValue)===0;
    });
  }

  getPSTID(geoPointTypeID: any) {
    this.geoPointTypeID=geoPointTypeID;
    console.log(this.geoPointTypeID);
    this.InitPickupSubDetails();
  }

  //---------Pickup Sub Detail-----------
  InitPickupSubDetails()
  {
    this._generalService.GetPickupSpotForReservation(this.geoPointTypeID).subscribe(
    data=>
    {
      this.PickupSpotList=data;
      this.filteredPickupSpotOptions = this.pickupSubDetail.valueChanges.pipe(
      startWith(""),
      map(value => this._filterPickupSubDetails(value || ''))
      ) 
    });;
  }
  
  private _filterPickupSubDetails(value: string): any {
  const filterValue = value.toLowerCase();
  //  if(filterValue.length === 0) {
  //     return [];
  //   }
  // if (!value || value.length < 3) {
  //       return [];   
  //     }
    return this.PickupSpotList?.filter(
    data => 
    {
      return data.geoPointName.toLowerCase().indexOf(filterValue)===0;
    });
  }

  refresh() {
    this.modeOfPayment.setValue('');
    this.customer.setValue('');
    this.customerGroup.setValue('');
    this.salesPerson.setValue('');
    this.bookerName.setValue('');
    this.city.setValue('');
    this.guestName.setValue('');
    this.pickupSubDetail.setValue('');
    this.pickupDetail.setValue('');
    this.customerLocation.setValue('');
    this.serviceLocation.setValue('');
    this.searchDutySlip = '';
    this.searchManualDS ='';
    this.searchBooking='';
    this.searchDispatchStatus = '';
    this.searchBookingStatus='';
    this.searchFromDate='';
    this.searchToDate='';
    this.searchCancellationFrom='';
    this.searchCancellationTo='';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData() {
    this.loadData();

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

  public loadData() 
  {
    if(this.searchFromDate!=="")
      {
        this.searchFromDate=moment(this.searchFromDate).format('MMM DD yyyy');
      }
      if(this.searchToDate!=="")
      {
        this.searchToDate=moment(this.searchToDate).format('MMM DD yyyy');
      }
      if(this.searchCancellationFrom!=="")
        {
          this.searchCancellationFrom=moment(this.searchCancellationFrom).format('MMM DD yyyy');
        }
        if(this.searchCancellationTo!=="")
        {
          this.searchCancellationTo=moment(this.searchCancellationTo).format('MMM DD yyyy');
        }
    
    this.bookingBackupMISService.getTableData(
      this.modeOfPayment.value,this.serviceLocation.value,
      this.customer.value,this.searchDutySlip,
      this.searchManualDS,this.searchBooking,
      this.city.value,this.searchFromDate,
      this.searchToDate,this.salesPerson.value,
      this.searchCancellationFrom,this.searchCancellationTo,
      this.searchDispatchStatus,this.searchBookingStatus,
      this.customerLocation.value,this.guestName.value,
      this.pickupDetail.value,this.pickupSubDetail.value,this.customerGroup.value,this.bookerName.value,
      this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
       
          console.log(this.dataSource)
          
       
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
  onContextMenu(event: MouseEvent, item: BookingBackupMIS) {
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
            if (this.MessageArray[0] == "UnlockEmployeeCreate") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployeeUpdate") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployee") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Account successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployeeAll") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
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
    this.bookingBackupMISService.getTableDataSort(
      this.searchModeOfPayment,this.searchServiceLocation,
      this.searchCustomerName,this.searchDutySlip,
      this.searchManualDS,this.searchBooking,
      this.searchCity,this.searchFromDate,
      this.searchToDate,this.searchSalesPerson,
      this.searchCancellationFrom,this.searchCancellationTo,
      this.searchDispatchStatus,this.searchBookingStatus,
      this.searchCustomerLocation,this.searchGuestName,
      this.searchPickupDetail,this.searchPickupSubDetail,this.searchCustomerGroup,this.searchBookerName,
      this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
}




