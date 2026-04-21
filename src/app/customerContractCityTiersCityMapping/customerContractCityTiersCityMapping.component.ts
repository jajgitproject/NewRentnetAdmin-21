// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContractCityTiersCityMappingService } from './customerContractCityTiersCityMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContractCityTiersCityMapping } from './customerContractCityTiersCityMapping.model';
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
  selector: 'app-customerContractCityTiersCityMapping',
  templateUrl: './customerContractCityTiersCityMapping.component.html',
  styleUrls: ['./customerContractCityTiersCityMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractCityTiersCityMappingComponent implements OnInit {
  displayedColumns = [
    'GeoPoint.GeoPointName',
    'status',
    'actions'
  ];
  dataSource: CustomerContractCityTiersCityMapping[] | null;
  customerContractCityTiersCityMappingID: number;
  advanceTable: CustomerContractCityTiersCityMapping | null;
  SearchName: string = '';
  SearchCustomerContractCityTiersCityMappingID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  CustomerContractID!: any;
  CustomerContractCityTier: any;
  //public CityList?: CitiesDropDown[] = [];
  customerContractCityTiersID: any;
  customerContractCityTier: any;
  customerContractName:any;
  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerContractCityTiersCityMappingService: CustomerContractCityTiersCityMappingService,
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
      // this.customerContractCityTiersID   = paramsData.CustomerContractCityTiersID;
      // this.customerContractCityTier   = paramsData.CustomerContractCityTier;
      // this.customerContractName   = paramsData.CustomerContractName;
      const encryptedCustomerContractCityTiersID = paramsData.CustomerContractCityTiersID;
const encryptedCustomerContractCityTier = paramsData.CustomerContractCityTier;
const encryptedCustomerContractName = paramsData.CustomerContractName;

// Decrypt the parameters if they exist
if (encryptedCustomerContractCityTiersID && encryptedCustomerContractCityTier && encryptedCustomerContractName) {
  this.customerContractCityTiersID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractCityTiersID));
  this.customerContractCityTier = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractCityTier));
  this.customerContractName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));

  // Log the decrypted values for verification
}

    });
    this.InitCities()
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.search.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
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
          customerContractCityTiersID: this.customerContractCityTiersID,
          customerContractCityTier :this.customerContractCityTier,
          customerContractName :this.customerContractName,
          
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerContractCityTiersCityMappingID = row.customerContractCityTiersCityMappingID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerContractCityTiersID: this.customerContractCityTiersID,
        customerContractCityTier :this.customerContractCityTier,
        customerContractName :this.customerContractName,
      }
    });

  }
  deleteItem(row)
  {

    this.customerContractCityTiersCityMappingID = row.id;
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
      this.customerContractCityTiersCityMappingService.getTableData(this.customerContractCityTiersID,this.SearchCustomerContractCityTiersCityMappingID,this.search.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerContractCityTiersCityMapping) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredCityOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CityList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
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
          if(this.MessageArray[0]=="CustomerContractCityTiersCityMappingCreate")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersCityMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contract City Tiers City Mapping Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCityTiersCityMappingUpdate")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersCityMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract City Tiers City Mapping Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCityTiersCityMappingDelete")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersCityMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract City Tiers City Mapping Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCityTiersCityMappingAll")
          {
            if(this.MessageArray[1]=="CustomerContractCityTiersCityMappingView")
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
    this.customerContractCityTiersCityMappingService.getTableDataSort(this.customerContractCityTiersID,this.SearchCustomerContractCityTiersCityMappingID,this.SearchName,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



