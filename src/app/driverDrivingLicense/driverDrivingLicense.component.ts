// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriverDrivingLicenseService } from './driverDrivingLicense.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DriverDrivingLicense } from './driverDrivingLicense.model';
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
import { ActivatedRoute, Router } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { AllCitiesDropDown } from '../customerPersonDrivingLicense/allCitiesDropDown.model';
import { FormDialogComponentHolder } from '../customerConfigurationInvoicing/dialogs/form-dialog/form-dialog.component';
import { FormDialogVerificationComponent } from '../driverDrivingLicenseVerification/dialogs/form-dialog/form-dialog-verification.component';

@Component({
  standalone: false,
  selector: 'app-driverDrivingLicense',
  templateUrl: './driverDrivingLicense.component.html',
  styleUrls: ['./driverDrivingLicense.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverDrivingLicenseComponent implements OnInit {
  displayedColumns = [
    'driverName',
    'supplierName',
    'drivingLicenseNo',
    'licenseVerified',
    'status',
    'actions'
  ];
  dataSource: DriverDrivingLicense[] | null;
  driverDrivingLicenseID: number;
  advanceTable: DriverDrivingLicense | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  SearchIssueCity: string = '';
  issueCity : FormControl = new FormControl();

  SearchAddressCity: string = '';
  addressCity : FormControl = new FormControl();

  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;
  driver_ID: any;
  driver_Name: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  driverID: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public driverDrivingLicenseService: DriverDrivingLicenseService,
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
    this.route.queryParams.subscribe(paramsData =>{
      // this.driver_ID   = paramsData.DriverID;
      //  this.driver_Name=paramsData.DriverName;
      const encryptedDriverID = paramsData.DriverID;
const encryptedDriverName = paramsData.DriverName;

if (encryptedDriverID && encryptedDriverName) {
  this.driver_ID = this._generalService.decrypt(decodeURIComponent(encryptedDriverID));
  this.driver_Name = this._generalService.decrypt(decodeURIComponent(encryptedDriverName));
}

console.log(this.driver_ID, this.driver_Name); // Log the decrypted values

    });
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCities();
    this.InitAdressCity();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredOptions = this.issueCity.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.CityList.filter(customer =>
    customer.geoPointName.toLowerCase().indexOf(filterValue) === 0
  );
}


  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.CityList.filter(
  //     customer => 
  //     {
  //       return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }

  InitAdressCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CitiesList=data;
        this.filteredCityOptions = this.addressCity.valueChanges.pipe(
          startWith(""),
          map(value => this._filtering(value || ''))
        ); 
      });
  }
  private _filtering(value: string): any {
  const filteringValue = value.toLowerCase();

  // Only filter when 3 or more characters are typed
  if (filteringValue.length < 3) {
    return [];
  }

  return this.CitiesList.filter(city =>
    city.geoPointName.toLowerCase().indexOf(filteringValue) === 0
  );
}


  // private _filtering(value: string): any {
  //   const filteringValue = value.toLowerCase();
  //   return this.CitiesList.filter(
  //     city => 
  //     {
  //       return city.geoPointName.toLowerCase().indexOf(filteringValue)===0;
  //     }
  //   );
  // }

  refresh() {
    this.addressCity.setValue('');
    this.issueCity.setValue('');
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
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          DriverID:this.driver_ID,
          DriverName:this.driver_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.driverDrivingLicenseID = row.driverDrivingLicenseID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        DriverID:this.driver_ID,
        DriverName:this.driver_Name
      }
    });

  }
  deleteItem(row)
  {

    this.driverDrivingLicenseID = row.id;
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
      case 'addressCity':
        this.addressCity.setValue(this.searchTerm);
        break;
      case 'issuingCity':
        this.issueCity.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.driverDrivingLicenseService.getTableData(this.driver_ID,this.addressCity.value,this.issueCity.value,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        //console.log(this.dataSource)
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        //   else{
        //     this.activeData="Deleted"
        //   }
        // })
       
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
  onContextMenu(event: MouseEvent, item: DriverDrivingLicense) {
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

  driverDrivingLicenseVerification(row)
  {
    console.log(row.verified);
    const dialogRef = this.dialog.open(FormDialogVerificationComponent, 
    {
      data: 
        {
          advanceTable: row, 
        }
    });
    
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
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
          if(this.MessageArray[0]=="DriverDrivingLicenseCreate")
          {
            if(this.MessageArray[1]=="DriverDrivingLicenseView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Driver Driving License Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverDrivingLicenseUpdate")
          {
            if(this.MessageArray[1]=="DriverDrivingLicenseView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Driving License Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverDrivingLicenseDelete")
          {
            if(this.MessageArray[1]=="DriverDrivingLicenseView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Driving License Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverDrivingLicenseAll")
          {
            if(this.MessageArray[1]=="DriverDrivingLicenseView")
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
    this.driverDrivingLicenseService.getTableDataSort(this.driverID,this.SearchAddressCity,this.SearchIssueCity,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



