// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CarAndDriverAllotmentTempService } from './CarAndDriverAllotmentTemp.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CarAndDriverAllotmentTemp, TripDetails } from './CarAndDriverAllotmentTemp.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PackageTypeDropDown } from '../general/packageTypeDropDown.model';
import { OtherFilterFormDialogComponent } from '../otherFilter/dialogs/form-dialog/form-dialog.component';
import { TripFilterFormDialogComponent } from '../tripFilter/dialogs/form-dialog/form-dialog.component';
import { throwIfAlreadyLoaded } from '../core/guard/module-import.guard';
import { VendorAssignmentComponent } from '../VendorAssignment/VendorAssignment.component';
import { BookerInfo } from '../BookerInfo/BookerInfo.model';
import { BookerInfoComponent } from '../BookerInfo/BookerInfo.component';
import { PassengerInfoComponent } from '../PassengerInfo/PassengerInfo.component';
import { VehicleCategoryInfo } from '../VehicleCategoryInfo/VehicleCategoryInfo.model';
import { VehicleCategoryInfoComponent } from '../VehicleCategoryInfo/VehicleCategoryInfo.component';
import { VehicleInfoComponent } from '../VehicleInfo/VehicleInfo.component';
import { PackageInfoComponent } from '../PackageInfo/PackageInfo.component';
import { SpecialInstructionInfoComponent } from '../SpecialInstructionInfo/SpecialInstructionInfo.component';
import { TimeAndAddressInfoComponent } from '../TimeAndAddressInfo/TimeAndAddressInfo.component';
import { StopDetailsInfoComponent } from '../StopDetailsInfo/StopDetailsInfo.component';
import { StopOnMapInfoComponent } from '../StopOnMapInfo/StopOnMapInfo.component';
import { VendorInfoComponent } from '../VendorInfo/VendorInfo.component';
import { VehicleAssignmentComponent } from '../VehicleAssignment/VehicleAssignment.component';
import { CarAndDriverSearchFormDialogComponent } from '../CarAndDriverSearch/dialogs/form-dialog/form-dialog.component';
import { CarAndDriverActionsFormDialogComponent } from '../CarAndDriverActions/dialogs/form-dialog/form-dialog.component';
import { PassengerHistoryComponent } from '../PassengerHistory/PassengerHistory.component';
import Swal from 'sweetalert2';
import { ExistingBidsComponent } from '../ExistingBids/ExistingBids.component';
import { AddCarAndDriverComponent } from '../AddCarAndDriver/AddCarAndDriver.component';
import { AddCarAndDriverFormDialogComponent } from '../AddCarAndDriver/dialogs/form-dialog/form-dialog.component';
import { AttachAnotherCarFormDialogComponent } from '../AttachAnotherCar/dialogs/form-dialog/form-dialog.component';
import { AttachAnotherDriverFormDialogComponent } from '../AttachAnotherDriver/dialogs/form-dialog/form-dialog.component';
import { DriverFeedbackInfoComponent } from '../DriverFeedbackInfo/DriverFeedbackInfo.component';


@Component({
  standalone: false,
  selector: 'app-CarAndDriverAllotmentTemp',
  templateUrl: './CarAndDriverAllotmentTemp.component.html',
  styleUrls: ['./CarAndDriverAllotmentTemp.component.scss']
})
export class CarAndDriverAllotmentTempComponent implements OnInit 
{
  @Input() suggestiveData;
  displayedColumns = [ 
    'tripDetails',
    'carDetails',
    'route',
    'passenger',
    'tripTracker',
    'BillingDetails',
    'paymentStatus'
  ];
  sortType: string = '';
  sortingData: number = 1;
  dataSource: CarAndDriverAllotmentTemp[];
  CarAndDriverAllotmentTempID: number;
  advanceTable: Array<TripDetails>=[];
  SearchCarAndDriverAllotmentTemp: string = '';
  SearchTripDate: string = '';
  SearchStatus: string = '';
  SearchVehicle: string = '';
  SearchCity: string = '';
  SearchPackageTypeID: number = 0;
  SearchPackage: string = '';
  SearchBooker: string = '';
  SearchActivationStatus : string='Active';
  PageNumber: number = 0;
  user_ID:number;
  Rid:number;
  name:string;
  bUserID:number;
  TripDetails: any;
  CarDetails: string;
  Route: string;
  Passenger: string;
  TripTracker: string;
  BillingDetails: string;
  PaymentStatus: string;
  Booker: string;
  BookedVehicle: string;
  Route1: string;
  Passenger1: string;
  Amount: number;
  paymentMode: string;
  vendorStatus: string;
  packageBooked: string;
  Passenger2: string;
  AmountPaid: number;
  Vendor: string;
  VehicleStatus: string;
  VendorBookingNo: string;
  VehSupplied: string;
  Map: string;
  ConnectDriver: string;
  Disputes: string;
  VehNo: string;
  Drop: string;
  Driver: string;
  SpecialInstruction: string;
  Route6: string;
  TripTracker1: string;
  SearchPassenger :string;
  constructor(
    public route:Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public CarAndDriverAllotmentTempService: CarAndDriverAllotmentTempService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:ActivatedRoute
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() 
  {
    this.router.queryParams.subscribe(paramsData =>
      {
        this.user_ID = paramsData.userID;
      });
    
    this.TripDetails=123;
    this.CarDetails='muv';
    this.Route="2-Nov-2022 17:30";
    this.Passenger='Pickup to Drop off';
    this.TripTracker='Started';
    this.BillingDetails='Invoiced';
    this.PaymentStatus='Disputed';

    this.TripTracker1='Yet to start';

    this.Booker="Shruti Sharma";
    this.BookedVehicle="Crysta";
    this.Route1="Delhi, India, B-183, Trilok Puri";
    this.Passenger1='Stop1 to Drop off';
    this.Amount=12000;
    this.paymentMode="CC";

    this.vendorStatus="Assigned";
    this.packageBooked="Local(4/40)";
    this.Passenger2='Stop1 to Drop off';
    this.AmountPaid=10000;

    this.Vendor='Eco Rent a car';
    this.VehSupplied='Crysta';
    this.ConnectDriver='Call/Whatsapp';
    this.Disputes='Disputes';

    this.VehicleStatus='Assigned';
    this.VehNo='DL 2CA 2345a';
    this.Drop='2 Nov 2022 19:30 ';
  
    this.VendorBookingNo='38374';
    this.Driver='Ram Nivas Yadav';
    this.Route6='Noida, India, M-10,A-38, Sector 12';
    this.SpecialInstruction='1. Please bring a water bottle2.Please bring newspaper3.Do not ring bell at home,call on mobile';
 }

//  public CityList?: CityDropDown[] = [];
//  public VehicleList?: VehicleDropDown[] = [];
//  public PackageList?: PackageDropDown[] = [];
 public PackageTypeList?: PackageTypeDropDown[] = [];
//  public StatusList?: ReservationPassengerDropDown[] = [];
 search: FormControl = new FormControl();
 searchPac: FormControl = new FormControl();
 searchCities: FormControl = new FormControl();
 searchStatus: FormControl = new FormControl();
 searchPackageTypes: FormControl = new FormControl();

  refresh() 
  {
    this.SearchTripDate ='';
    this.SearchStatus = '';
    this.SearchVehicle = '';
    this.SearchCity = '';
    this.SearchPackageTypeID = 0,
    this.SearchPackage = '';
    this.SearchBooker = '';
    this.SearchActivationStatus = 'Active';
    this.PageNumber=0;
  }

  public SearchData()
  {
    this.SearchTripDate ='';
    this.SearchStatus = '';
    this.SearchVehicle='';
    this.SearchCity='';
    this.SearchPackageTypeID = 0,
    this.SearchPackage = '';
    this.SearchBooker = '';
  }

  otherFilter()
  { 
    this.dialog.open(OtherFilterFormDialogComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add',     
      }
    });
  }

 tripFilter()
  { 
    this.dialog.open(CarAndDriverSearchFormDialogComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }
Search()
{
  this.dialog.open(CarAndDriverSearchFormDialogComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
}

ExistingBids()
{
  this.dialog.open(ExistingBidsComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
}
AddCarAndDriver()
{
  this.dialog.open(AddCarAndDriverFormDialogComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
}
AttachAnotherCar()
{
  this.dialog.open(AttachAnotherCarFormDialogComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
}

AttachAnotherDriver()
{
  this.dialog.open(AttachAnotherDriverFormDialogComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
}

AddNewBid() {
  Swal.fire({
    title: 'Are you sure, You want to send bid notification to searched drivers?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, send it!'
  }).then((result) => {
    if (result.value) {
      Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
    }
  });
}

CancelAllotment() {
  Swal.fire({
    title: 'Reason of Cancellation',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`//api.github.com/users/${login}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: `${result.value.login}'s avatar`,
        imageUrl: result.value.avatar_url
      });
    }
  });
}

DetachFromDuty() {
  Swal.fire({
    title: 'Reason of Detachment',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`//api.github.com/users/${login}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: `${result.value.login}'s avatar`,
        imageUrl: result.value.avatar_url
      });
    }
  });
}

PassengerHistory()
{
  this.dialog.open(PassengerHistoryComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
}
DriverFeedbackInfo()
{
  this.dialog.open(DriverFeedbackInfoComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
}
  Actions()
  { 
    this.dialog.open(CarAndDriverActionsFormDialogComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }

  VendorAssignment()
  { 
    this.dialog.open(VendorAssignmentComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }

  BookerInfo()
  { 
    this.dialog.open(BookerInfoComponent, 
    {
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }
  PassengerInfo()
  { 
    this.dialog.open(PassengerInfoComponent, 
    { 
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }
  VehicleCategoryInfo()
  { 
    this.dialog.open(VehicleCategoryInfoComponent, 
    { 
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }

  VehicleInfo()
  { 
    this.dialog.open(VehicleInfoComponent, 
    { 
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }


  PackageInfo()
  { 
    this.dialog.open(PackageInfoComponent, 
    { 
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }

  SpecialInstructionInfo()
  { 
    this.dialog.open(SpecialInstructionInfoComponent, 
    { 
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });  
  }
  TimeAndAddressInfo()
  { 
    this.dialog.open(TimeAndAddressInfoComponent, 
    { 
      width: '920px',
      maxWidth: '96vw',
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }
  VendorInfo()
  { 
    this.dialog.open(VendorInfoComponent, 
    { 
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }
  VehicleAssignment()
  { 
    this.dialog.open(VehicleAssignmentComponent, 
    { 
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }
  
  VehicleAssignment1()
  { 
   
  }

  StopDetailsInfo()
  { 
    this.dialog.open(StopDetailsInfoComponent, 
    { 
      width: 'min(1200px, 98vw)',
      maxWidth: '98vw',
      panelClass: 'stop-details-wide-dialog',
      data: 
      {
        advanceTable: this.advanceTable,
        action: 'add'
      }, 
    });
  }

  StopsOnMapInfo()
  { 
    this.dialog.open(StopOnMapInfoComponent, {
      width: 'min(1200px, 98vw)',
      maxWidth: '98vw',
      panelClass: 'stops-on-map-wide-dialog',
      data: {
        advanceTable: this.advanceTable,
        action: 'add'
      }
    });
  }

  
  public Filter()
  {
    this.PageNumber = 0;
  }

  showNotification(colorName, text, placementFrom, placementAlign) 
  {
    this.snackBar.open(text, '', 
    {
      duration: 5000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  
  onContextMenu(event: MouseEvent, item: CarAndDriverAllotmentTemp) {
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
      //this.loadData();
    }
  }

  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
    }
  }

panelOpenState = false;

step = 0;

setStep(index: number) 
{
  this.step = index;
}

nextStep() 
{
  this.step++;
}

prevStep() 
{
  this.step--;
}
}


