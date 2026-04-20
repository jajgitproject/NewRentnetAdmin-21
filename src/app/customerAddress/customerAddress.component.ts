// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerAddressService } from './customerAddress.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerAddress } from './customerAddress.model';
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
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-customerAddress',
  templateUrl: './customerAddress.component.html',
  styleUrls: ['./customerAddress.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerAddressComponent implements OnInit {
  displayedColumns = [
    'GeoPoint.GeoPointName',
    'completeAddress',
    //'landMark',
    'isItBaseAddress',
    'status',
    'actions'
  ];
  dataSource: CustomerAddress[] | null;
  customerAddressID: number;
  CustomerAddressID:number=0;
  advanceTable: CustomerAddress | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  public CityList?: CitiesDropDown[] = [];

  SearchCity: string = '';
  city : FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;

  SearchPin: string = '';
  pin : FormControl = new FormControl();

  SearchLandmark: string = '';
  landmark : FormControl = new FormControl();
  Customer_ID: any;
  Customer_Name: any;
  roleID:any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchAddress: any = '';
  completeAddress : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerAddressService: CustomerAddressService,
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
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedCustomerID = paramsData.CustomerID;
    const encryptedCustomerName = paramsData.CustomerName;
    
    if (encryptedCustomerID && encryptedCustomerName) {
      
        this.Customer_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerID));
        this.Customer_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerName));
      }
      //console.log(this.Customer_ID,this.Customer_Name)
      
    });
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCities();
     this.roleID = localStorage.getItem('roleID');
  }

  // InitCities(){
  //   this._generalService.GetCitiessAll().subscribe(
  //     data=>
  //     {
  //       this.CityList=data;
  //     });
  // }

  InitCities(){
     this._generalService.GetCitiessAll().subscribe(
       data =>
       {
         this.CityList = data;  
         this.filteredCityOptions = this.city.valueChanges.pipe(
           startWith(""),
           map(value => this._filterCity(value || ''))
         );                  
       },
       error=>
       {
    
       }
     );
    }
    private _filterCity(value: string): any {
     const filterValue = value.toLowerCase();
     return this.CityList.filter(
       customer =>
       {
         return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
       }
     );
    }

  refresh() {
    this.city.setValue('');
    this.SearchPin = '';
    this.SearchLandmark = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.SearchAddress='';
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
          CustomerID:this.Customer_ID,
          CustomerName:this.Customer_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerAddressID = row.customerAddressID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerID:this.Customer_ID,
        CustomerName:this.Customer_Name
      }
    });

  }
  deleteItem(row)
  {

    this.customerAddressID = row.id;
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

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'city':
        this.city.setValue(this.searchTerm);
        break;
      // case 'pin':
      //   this.SearchPin = this.searchTerm;
      //   break;
      // case 'landmark':
      //   this.SearchLandmark = this.searchTerm;
      //   break;
      case 'address':
        this.SearchAddress = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerAddressService.getTableData(this.CustomerAddressID,
        this.Customer_ID,
        this.city.value,
        this.SearchPin,
        this.SearchLandmark,
        this.SearchAddress,
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
  onContextMenu(event: MouseEvent, item: CustomerAddress) {
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
          if(this.MessageArray[0]=="CustomerAddressCreate")
          {
            if(this.MessageArray[1]=="CustomerAddressView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Address Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAddressUpdate")
          {
            if(this.MessageArray[1]=="CustomerAddressView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Address Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAddressDelete")
          {
            if(this.MessageArray[1]=="CustomerAddressView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Address Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAddressAll")
          {
            if(this.MessageArray[1]=="CustomerAddressView")
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
    this.customerAddressService.getTableDataSort(this.CustomerAddressID,
      this.Customer_ID,
      this.SearchCity,
      this.SearchPin,
      this.SearchLandmark,
      this.SearchAddress,
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


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



