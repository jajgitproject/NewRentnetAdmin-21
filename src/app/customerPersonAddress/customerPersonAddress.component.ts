// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerPersonAddressService } from './customerPersonAddress.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerPersonAddress } from './customerPersonAddress.model';
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
@Component({
  standalone: false,
  selector: 'app-customerPersonAddress',
  templateUrl: './customerPersonAddress.component.html',
  styleUrls: ['./customerPersonAddress.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPersonAddressComponent implements OnInit {
  displayedColumns = [
    'GeoPoint.GeoPointName',
    'addressType',
    'isFavourite',
    'addressName',
    'address',
    'status',
    'actions'
  ];
  dataSource: CustomerPersonAddress[] | null;
  customerPersonAddressID: number;
  advanceTable: CustomerPersonAddress | null;  
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerPerson_ID: any;
  customerPerson_Name: any;
  public CityList?: CitiesDropDown[] = [];

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchCity: string = '';
  city : FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCityTerm: FormControl = new FormControl();
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerPersonAddressService: CustomerPersonAddressService,
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
      // this.customerPerson_ID   = paramsData.CustomerPersonID;
      //  this.customerPerson_Name=paramsData.CustomerPersonName;
    
        const encryptedCustomerPersonID = paramsData.CustomerPersonID;
        const encryptedCustomerPersonName = paramsData.CustomerPersonName;
      
        if (encryptedCustomerPersonID && encryptedCustomerPersonName) {
          this.customerPerson_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonID));
          this.customerPerson_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonName));
        }
      
      });
      
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCities();
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
       this.filteredCityOptions =  this.city.valueChanges.pipe(
         startWith(""),
         map(value => this._filterCity(value || ''))
       );                  
     },
     error=>
     {
  
     }
      )
    }
  private _filterCity(value: string): any {
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

  refresh() {
    this.SearchName = '';
    this.city.setValue('');
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
    this.customerPersonAddressID = row.customerPersonAddressID;
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

    this.customerPersonAddressID = row.id;
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
      case 'address':
        this.SearchName = this.searchTerm;
        break;
      case 'city':
        this.city.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerPersonAddressService.getTableData(this.customerPerson_ID,this.SearchName,this.city.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerPersonAddress) {
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
          if(this.MessageArray[0]=="CustomerPersonAddressCreate")
          {
            if(this.MessageArray[1]=="CustomerPersonAddressView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Address Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonAddressUpdate")
          {
            if(this.MessageArray[1]=="CustomerPersonAddressView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Address Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonAddressDelete")
          {
            if(this.MessageArray[1]=="CustomerPersonAddressView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Address Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonAddressAll")
          {
            if(this.MessageArray[1]=="CustomerPersonAddressView")
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
    this.customerPersonAddressService.getTableDataSort(this.customerPerson_ID,this.SearchName,this.SearchCity,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



