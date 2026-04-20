// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerCreditService } from './customerCredit.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerCredit } from './customerCredit.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerCredit',
  templateUrl: './customerCredit.component.html',
  styleUrls: ['./customerCredit.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerCreditComponent implements OnInit {
  displayedColumns = [
    'customerCreditStartDate',
    'customerCreditEndDate',
    'creditPeriodInDays',
    'creditLimitAmount',
    'activationStatus',
    'actions'
  ];
  dataSource: CustomerCredit[] | null;
  customerCreditID: number;
  advanceTable: CustomerCredit | null;
  SearchCustomerCredit: string = ''; 
  SearchGstNumber: string='';
  SearchPercentage:string='';
  SearchbillingName:string='';
  gstNumber : FormControl = new FormControl();
  billingName : FormControl = new FormControl();
  percentage: FormControl = new FormControl();
  searchEntity: FormControl = new FormControl();
  SearchEntityType:string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  SupplierContractID:number=1;
  public CityList?: CityDropDown[] = [];
  CustomerContractMapping_ID: any;
  customer_Name: any;
  CustomerContractMappingID:any;
  Applicable_From:any;
  Applicable_To:any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;


  SearchEmployeeName: string = '';
  next : FormControl = new FormControl();

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endingDate : FormControl = new FormControl();
  public EmployeeList?: EmployeeDropDown[] = [];
  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    
    public customerCreditService: CustomerCreditService,
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
      this.CustomerContractMapping_ID   = paramsData.customerContractMappingID;
       this.customer_Name=paramsData.CustomerName;
       this.Applicable_From   = paramsData.ApplicableFrom;
       this.Applicable_To   = paramsData.ApplicableTo;
    });
    this.loadData();
    this.InitEmployee();
    this.SubscribeUpdateService();
  }
  refresh() {
     
  
    this.SearchCustomerCredit = '';
    this.SearchEmployeeName='';
    this.SearchStartDate='';
    this.SearchEndDate='';
    this.SearchActivationStatus = true;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    
    const dialogRef = this.dialog.open(FormDialogComponentHolder, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerContractMappingID:this.CustomerContractMapping_ID,
          CustomerName:this.customer_Name,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
        }
    });
    //console.log(this.CustomerContractMapping_ID);
  }
  editCall(row) {
      //  alert(row.id);
    this.customerCreditID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerContractMappingID:this.CustomerContractMapping_ID,
        CustomerName:this.customer_Name,
        ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
      }
    });
    

  }
  public SearchData()
  {
    this.loadData();
    //this.SearchCustomerCredit='';
  }
  
  deleteItem(row)
  {

    this.customerCreditID = row.id;
  //console.log(row)
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
  public loadData() 
   {
     
    if(this.SearchStartDate!==""){
      this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
    }
    if(this.SearchEndDate!==""){
      this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
    }  
    switch (this.selectedFilter)
    {
      case 'startDate':
        this.SearchStartDate = this.searchTerm;
        break;
        case 'endDate':
        this.SearchEndDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }  
      this.customerCreditService.getTableData(this.CustomerContractMapping_ID,this.SearchEmployeeName,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: CustomerCredit) {
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
      this.loadData();
    }
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
       // console.log(this.MessageArray);
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CustomerCreditCreate")
          {
            if(this.MessageArray[1]=="CustomerCreditView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
                this.refresh();
                this.showNotification(
                'snackbar-success',
                ' Customer Credit Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerCreditUpdate")
          {
            if(this.MessageArray[1]=="CustomerCreditView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Customer Credit Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerCreditDelete")
          {
            if(this.MessageArray[1]=="CustomerCreditView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Customer Credit Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerCreditAll")
          {
            if(this.MessageArray[1]=="CustomerCreditView")
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
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
       
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
    this.customerCreditService.getTableDataSort(this.CustomerContractMapping_ID,this.SearchEmployeeName,this.SearchStartDate,this.SearchEndDate,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
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




