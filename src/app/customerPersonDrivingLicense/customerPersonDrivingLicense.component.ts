// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerPersonDrivingLicenseService } from './customerPersonDrivingLicense.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerPersonDrivingLicense } from './customerPersonDrivingLicense.model';
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
import { ActivatedRoute } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { AllCitiesDropDown } from './allCitiesDropDown.model';
import { FormDialogComponentHolder } from '../customerPersonDrivingLicenseVerification/dialogs/form-dialog/form-dialog.component';
@Component({
  standalone: false,
  selector: 'app-customerPersonDrivingLicense',
  templateUrl: './customerPersonDrivingLicense.component.html',
  styleUrls: ['./customerPersonDrivingLicense.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPersonDrivingLicenseComponent implements OnInit {
  displayedColumns = [
    'customerPersonName',
    'customerName',
    'drivingLicenseNo',
    'licenseVerified',
    'status',
    'actions'
  ];
  dataSource: CustomerPersonDrivingLicense[] | null;
  customerPersonDrivingLicenseID: number;
  advanceTable: CustomerPersonDrivingLicense | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerPerson_ID: any;
  customerPerson_Name: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  SearchAddressCity: string = '';
  addressCity : FormControl = new FormControl();

  SearchIssuingCity: string = '';
  issuingCity : FormControl = new FormControl();

  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;
  customerPersonID: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerPersonDrivingLicenseService: CustomerPersonDrivingLicenseService,
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
    //   this.customerPerson_ID   = paramsData.CustomerPersonID;
    //    this.customerPerson_Name=paramsData.CustomerPersonName;
    // });
    const encryptedCustomerPersonID = paramsData.CustomerPersonID;
  const encryptedCustomerPersonName = paramsData.CustomerPersonName;

  if (encryptedCustomerPersonID && encryptedCustomerPersonName) {
    // Decrypt the values and assign them to the class properties
    this.customerPerson_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonID));
    this.customerPerson_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonName));
  }

  // Log the decrypted values to the console
});
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCities();
    this.InitIssuingCity();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredOptions = this.addressCity.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitIssuingCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CitiesList=data;
        this.filteredCityOptions = this.issuingCity.valueChanges.pipe(
          startWith(""),
          map(value => this._filtering(value || ''))
        ); 
      });
  }

  private _filtering(value: string): any {
    const filteringValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CitiesList.filter(
      city => 
      {
        return city.geoPointName.toLowerCase().indexOf(filteringValue)===0;
      }
    );
  }

  refresh() {
    this.addressCity.setValue('');
    this.issuingCity.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
          CustomerPersonID:this.customerPerson_ID,
          CustomerPersonName:this.customerPerson_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerPersonDrivingLicenseID = row.customerPersonDrivingLicenseID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerPersonID:this.customerPerson_ID,
        CustomerPersonName:this.customerPerson_Name
      }
    });

  }
  deleteItem(row)
  {

    this.customerPersonDrivingLicenseID = row.id;
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
     
      case 'addressCity':
        this.addressCity.setValue(this.searchTerm);
        break;
        case 'issuingCity':
        this.issuingCity.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerPersonDrivingLicenseService.getTableData(this.customerPerson_ID,this.addressCity.value,this.issuingCity.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerPersonDrivingLicense) {
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

verificationCall(row) {
  //  alert(row.id);
this.customerPersonDrivingLicenseID = row.customerPersonDrivingLicenseID;
const dialogRef = this.dialog.open(FormDialogComponentHolder, {
  data: {
    advanceTable: row,
    CustomerPersonID:this.customerPerson_ID,
    CustomerPersonName:this.customerPerson_Name
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
          if(this.MessageArray[0]=="CustomerPersonDrivingLicenseCreate")
          {
            if(this.MessageArray[1]=="CustomerPersonDrivingLicenseView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Driving License Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonDrivingLicenseUpdate")
          {
            if(this.MessageArray[1]=="CustomerPersonDrivingLicenseView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Driving License Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonDrivingLicenseDelete")
          {
            if(this.MessageArray[1]=="CustomerPersonDrivingLicenseView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Driving License Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonDrivingLicenseAll")
          {
            if(this.MessageArray[1]=="CustomerPersonDrivingLicenseView")
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
    this.customerPersonDrivingLicenseService.getTableDataSort(this.customerPerson_ID,this.SearchAddressCity,this.SearchIssuingCity,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



