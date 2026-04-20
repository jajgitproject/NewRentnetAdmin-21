// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerPersonTempVIPService } from './customerPersonTempVIP.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerPersonTempVIP } from './customerPersonTempVIP.model';
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
import { SupplierRateCardDropDown } from '../supplierRateCard/supplierRateCardDropDown.model';
import moment from 'moment';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerPersonTempVIP',
  templateUrl: './customerPersonTempVIP.component.html',
  styleUrls: ['./customerPersonTempVIP.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPersonTempVIPComponent implements OnInit {
  displayedColumns = [
    'vipStatusStartDate',
    'vipStatusEndDate',
    'forNumberofBookings',
  'forNumberofBookingsStartsFrom',
     'incidenceID',
    'remark',
    'status',
    'actions'
  ];
  dataSource: CustomerPersonTempVIP[] | null;
  customerPersonTempVIPID: number;
  advanceTable: CustomerPersonTempVIP | null;
  searchvipStatusStartDate: string = '';
  searchremark:string='';
  searchvipStatusEndDate: string = '';
  searchforNumberofBookings: string = '';
  searchforNumberofBookingsStartsFrom: string = '';
  SearchCustomerPersonTempVIPID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  remark : FormControl = new FormControl();
  startDate : FormControl = new FormControl();
  endDate : FormControl = new FormControl();
  numberofBookings : FormControl = new FormControl();
  numberofBookingsStartsFrom : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  public CustomerList?: CustomerDropDown[] = [];
  customerPersonID: any;
  customerPersonName: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerPersonTempVIPService: CustomerPersonTempVIPService,
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
    //   this.customerPersonID   = paramsData.CustomerPersonID;
    //   this.customerPersonName   = paramsData.CustomerPersonName;
    // });
    const encryptedCustomerPersonID = paramsData.CustomerPersonID;
    const encryptedCustomerPersonName = paramsData.CustomerPersonName;
  
    if (encryptedCustomerPersonID && encryptedCustomerPersonName) {
      // Decrypt the CustomerPersonID and CustomerPersonName
      this.customerPersonID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonID));
      this.customerPersonName = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonName));
    }
  
    // Log the decrypted values
    console.log(this.customerPersonID, this.customerPersonName);
  });
    this.initCustomerType();
    this.initCustomerfor();
    this.InitCities()
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchvipStatusStartDate = '';
    this.searchremark = '';
    this.searchvipStatusEndDate = '';
    this.searchforNumberofBookings = '';
    this.searchforNumberofBookingsStartsFrom = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
      });
  }
  initCustomerType(){
    this._generalService.getCustomerType().subscribe(
      data=>{
        this.CustomerTypeList=data;
      }
    )
  }

  initCustomerfor(){
    this._generalService.getCustomer().subscribe(
      data=>{
        this.CustomerList=data;
      }
    )
    
  }

  public SearchData()
  {
    this.loadData();    
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerPersonID: this.customerPersonID,
          customerPersonName :this.customerPersonName,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerPersonTempVIPID = row.customerPersonTempVIPID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerPersonID: this.customerPersonID,
        customerPersonName :this.customerPersonName,
      }
    });

  }
  deleteItem(row)
  {

    this.customerPersonTempVIPID = row.id;
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
    if(this.searchvipStatusStartDate!==""){
      this.searchvipStatusStartDate=moment(this.searchvipStatusStartDate).format('MMM DD yyyy');
    }
    if(this.searchvipStatusEndDate!==""){
      this.searchvipStatusEndDate=moment(this.searchvipStatusEndDate).format('MMM DD yyyy');
    } 

    if(this.searchforNumberofBookingsStartsFrom!==""){
      this.searchforNumberofBookingsStartsFrom=moment(this.searchforNumberofBookingsStartsFrom).format('MMM DD yyyy');
    }
    switch (this.selectedFilter)
    {
      case 'remark':
        this.searchremark = this.searchTerm;
        break;
        case 'startDate':
          this.searchvipStatusStartDate = this.searchTerm;
          break;
          case 'endDate':
            this.searchvipStatusEndDate = this.searchTerm;
            break;
      case 'numberofBookings':
        this.searchforNumberofBookings=this.searchTerm;
        break;
        case 'numberofBookingsStatFrom':
        this.searchforNumberofBookingsStartsFrom=this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerPersonTempVIPService.getTableData(this.customerPersonID,this.searchremark,this.searchvipStatusStartDate,this.searchvipStatusEndDate,this.searchforNumberofBookings,this.searchforNumberofBookingsStartsFrom,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerPersonTempVIP) {
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

  initRate(){
    this._generalService.GetRateList().subscribe(
      data=>
      {
        this.RateList=data;
      });
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
          if(this.MessageArray[0]=="CustomerPersonTempVIPCreate")
          {
            if(this.MessageArray[1]=="CustomerPersonTempVIPView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Temp VIP Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonTempVIPUpdate")
          {
            if(this.MessageArray[1]=="CustomerPersonTempVIPView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Temp VIP Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonTempVIPDelete")
          {
            if(this.MessageArray[1]=="CustomerPersonTempVIPView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Temp VIP Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonTempVIPAll")
          {
            if(this.MessageArray[1]=="CustomerPersonTempVIPView")
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
    this.customerPersonTempVIPService.getTableDataSort(this.customerPersonID,this.searchremark,this.searchvipStatusStartDate,this.searchvipStatusEndDate,this.searchforNumberofBookings,this.searchforNumberofBookingsStartsFrom,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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




