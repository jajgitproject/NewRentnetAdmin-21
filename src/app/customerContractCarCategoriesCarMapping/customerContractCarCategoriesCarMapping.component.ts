// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContractCarCategoriesCarMappingService } from './customerContractCarCategoriesCarMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContractCarCategoriesCarMapping } from './customerContractCarCategoriesCarMapping.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerContractCarCategoriesCarMapping',
  templateUrl: './customerContractCarCategoriesCarMapping.component.html',
  styleUrls: ['./customerContractCarCategoriesCarMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContractCarCategoriesCarMappingComponent implements OnInit {
  displayedColumns = [
    'vehicle',
    'customerVehicleName',
    'customerVehicleCodeForIntegration',
    'status',
    'actions'
  ];
  dataSource: CustomerContractCarCategoriesCarMapping[] | null;
  customerContractCarCategoriesCarMappingID: number;
  advanceTable: CustomerContractCarCategoriesCarMapping | null;
  searchvehicle: string = '';
  searchcustomerVehicleName: string = '';
  searchcustomerVehicleCodeForIntegration: string = '';
  searchCustomerContractCarCategoriesCarMappingID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  vehicle : FormControl = new FormControl();
  customerVehicleName : FormControl = new FormControl();
  customerVehicleCodeForIntegration: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  CustomerContractID!: any;
  CustomerContractCityTier: any;
  public CityList?: CitiesDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  customerContractCarCategoryID: any;
  customerContractCarCategory: any;
  customerContractName:any;
  customerContractID: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerContractCarCategoriesCarMappingService: CustomerContractCarCategoriesCarMappingService,
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
      // this.customerContractCarCategoryID   = paramsData.CustomerContractCarCategoryID;
      // this.customerContractCarCategory   = paramsData.CustomerContractCarCategory;
      // this.customerContractName   = paramsData.CustomerContractName;
      const encryptedCustomerContractCarCategoryID = paramsData.CustomerContractCarCategoryID;
       const encryptedCustomerContractID = paramsData.CustomerContractID;
  const encryptedCustomerContractCarCategory = paramsData.CustomerContractCarCategory;
  const encryptedCustomerContractName = paramsData.CustomerContractName;
  
  // Decrypt the parameters if they exist
    if (encryptedCustomerContractID) {
    this.customerContractID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
    console.log("Decrypted CustomerContractID:", this.customerContractID);
  }
  if (encryptedCustomerContractCarCategoryID && encryptedCustomerContractCarCategory &&
      encryptedCustomerContractName) {
        
    this.customerContractCarCategoryID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractCarCategoryID));
    this.customerContractCarCategory = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractCarCategory));
    this.customerContractName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
    
    // Log the decrypted values to the console for verification
    console.log("Decrypted CustomerContractCarCategoryID:", this.customerContractCarCategoryID);
    console.log("Decrypted CustomerContractCarCategory:", this.customerContractCarCategory);
    console.log("Decrypted CustomerContractName:", this.customerContractName);
  }

});

    this.InitCities();
    this.initVehicle();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchvehicle = '';
    this.searchcustomerVehicleName = '';
    this.searchcustomerVehicleCodeForIntegration = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
      });
  }

  initVehicle(){
    this._generalService.GetVehicle().subscribe
    (
      data =>   
      {
        this.VehicleList = data;
        
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
      
          action: 'add',
          customerContractCarCategoryID: this.customerContractCarCategoryID,
          customerContractCarCategory :this.customerContractCarCategory,
          customerContractName :this.customerContractName,
            customerContractID: this.customerContractID,
          
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerContractCarCategoriesCarMappingID = row.customerContractCarCategoriesCarMappingID;
    //  row.customerContractID = this.customerContractID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerContractCarCategoryID: this.customerContractCarCategoryID,
        customerContractCarCategory :this.customerContractCarCategory,
        customerContractName :this.customerContractName,
        customerContractID: this.customerContractID,
      }
    });

  }
  deleteItem(row)
  {

    this.customerContractCarCategoriesCarMappingID = row.id;
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
      this.customerContractCarCategoriesCarMappingService.getTableData( this.customerContractID,this.customerContractCarCategoryID,this.searchCustomerContractCarCategoriesCarMappingID,this.searchvehicle,this.searchcustomerVehicleName,this.searchcustomerVehicleCodeForIntegration,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerContractCarCategoriesCarMapping) {
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
          if(this.MessageArray[0]=="CustomerContractCarCategoriesCarMappingCreate")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoriesCarMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contract Car Categories Car Mapping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCarCategoriesCarMappingUpdate")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoriesCarMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Car Categories Car Mapping  Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCarCategoriesCarMappingDelete")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoriesCarMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contract Car Categories Car Mapping  Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContractCarCategoriesCarMappingAll")
          {
            if(this.MessageArray[1]=="CustomerContractCarCategoriesCarMappingView")
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
    this.customerContractCarCategoriesCarMappingService.getTableDataSort( this.customerContractID,this.customerContractCarCategoryID,this.searchCustomerContractCarCategoriesCarMappingID,this.searchvehicle,this.searchcustomerVehicleName,this.searchcustomerVehicleCodeForIntegration,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



