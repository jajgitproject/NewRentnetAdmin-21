// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerContactPersonService } from './customerContactPerson.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerContactPerson } from './customerContactPerson.model';
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
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';
import { CustomerDesignationDropDown } from '../customerDesignation/customerDesignationDropDown.model';
import { CustomerDepartmentDropDown } from '../customerDepartment/customerDepartmentDropDown.model';
import { SalutationDropDown } from '../general/salutationDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerContactPerson',
  templateUrl: './customerContactPerson.component.html',
  styleUrls: ['./customerContactPerson.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerContactPersonComponent implements OnInit {
  displayedColumns = [
    'contactPersonName',
    'mobile',
    'email',
    'customerDesignation',
    'customerDepartment',
    'status',
    'actions'
  ];
  dataSource: CustomerContactPerson[] | null;
  customerContactPersonID: number;
  advanceTable: CustomerContactPerson | null;
  searchmobile: string = '';
  searchemail: string = '';
  searchsalutation: string = '';
  searchcontactPersonName: string = '';
  searchcustomerDesignation: string = '';
  searchcustomerDepartment: string = '';
  SearchCustomerContactPersonID:number=0;
  SearchisActive : boolean=true;
  PageNumber: number = 0;
  mobile : FormControl = new FormControl();
  email : FormControl = new FormControl();
  salutation : FormControl = new FormControl();
  contactPersonName : FormControl = new FormControl();
  customerDesignation : FormControl = new FormControl();
  customerDepartment : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
  public DepartmentList?: CustomerDepartmentDropDown[] = [];
  public DesginationList?:CustomerDesignationDropDown[]=[];
  public SalutationList?:SalutationDropDown[]=[];

  customerID: any;
  customerName: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerContactPersonService: CustomerContactPersonService,
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
        this.customerID   = paramsData.CustomerID;
        this.customerName   = paramsData.CustomerName;
    });
    this.initCustomerCategory();
    this.initRate();
    this.initCustomerDepartment();
    this.initCustomerDesignation();
    this.initgetSalutations();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchmobile = '';
    this.searchemail = '';
    this.SearchisActive = true;
    this.PageNumber=0;
    this.loadData();
  }

  initCustomerCategory(){
    this._generalService.getCustomerCategory().subscribe(
      data=>{
        this.customerCategoryList=data;
      }
    )
    //console.log(this.customerCategoryList)
  }

  initCustomerDepartment(){
    this._generalService.getCustomerDepartments().subscribe
    (
      data =>   
      {
        this.DepartmentList = data;
        console.log(this.DepartmentList)
       
      }
    );
  }

  initCustomerDesignation(){
    this._generalService.getCustomerDesignations().subscribe
    (
      data =>   
      {
        this.DesginationList = data;
        console.log(this.DesginationList)
       
      }
    );
  }

  initgetSalutations(){
    this._generalService.GetSalutations().subscribe
    (
      data =>   
      {
        this.SalutationList = data;
        console.log(this.SalutationList)
       
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
          customerID: this.customerID,
          customerName :this.customerName,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerContactPersonID = row.customerContactPersonID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerID: this.customerID,
        customerName :this.customerName,
      }
    });

  }
  deleteItem(row)
  {

    this.customerContactPersonID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
      this.customerContactPersonService.getTableData(this.customerID,this.searchsalutation,this.searchcontactPersonName,this.searchcustomerDesignation,this.searchcustomerDepartment,this.searchmobile,this.searchemail,this.SearchisActive, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        //console.log(this.dataSource)
        this.dataSource.forEach((ele)=>{
          if(ele.isActive===true){
            this.activeData="Active";
          }
          else{
            this.activeData="Deleted"
          }
        })
       
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
  onContextMenu(event: MouseEvent, item: CustomerContactPerson) {
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
        console.log(this.RateList)
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
          if(this.MessageArray[0]=="CustomerContactPersonCreate")
          {
            if(this.MessageArray[1]=="CustomerContactPersonView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Contact Person  Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContactPersonUpdate")
          {
            if(this.MessageArray[1]=="CustomerContactPersonView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contact Person  Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContactPersonDelete")
          {
            if(this.MessageArray[1]=="CustomerContactPersonView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Contact Person Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerContactPersonAll")
          {
            if(this.MessageArray[1]=="CustomerContactPersonView")
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
    this.customerContactPersonService.getTableDataSort(this.customerID,this.searchsalutation,this.searchcontactPersonName,this.searchcustomerDesignation,this.searchcustomerDepartment,this.searchmobile,this.searchemail,this.SearchisActive, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



