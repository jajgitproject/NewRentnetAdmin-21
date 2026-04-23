// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerGroupSBTDomainService } from './customerGroupSBTDomain.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerGroupSBTDomain } from './customerGroupSBTDomain.model';
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
@Component({
  standalone: false,
  selector: 'app-customerGroupSBTDomain',
  templateUrl: './customerGroupSBTDomain.component.html',
  styleUrls: ['./customerGroupSBTDomain.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerGroupSBTDomainComponent implements OnInit {
  displayedColumns = [
    'sbtDomain',
    'allowCDPLogin',
    'allowAllCars',
    'allowAllDutyTypes',
    'status',
    
    'actions'
  ];
  dataSource: CustomerGroupSBTDomain[] | null;
  customerGroupSBTDomainID: number;
  advanceTable: CustomerGroupSBTDomain | null;
  searchSbtDomain: string = '';
  //searchemail: string = '';
  SearchCustomerGroupSBTDomainID:number=0;
  SearchStatus : boolean=true;
  PageNumber: number = 0;
  sbt : FormControl = new FormControl();
  //email : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierRateCardDropDown[] = [];
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
  customerGroupID: any;
  customerGroup: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerGroupSBTDomainService: CustomerGroupSBTDomainService,
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
    //     this.customerGroupID   = paramsData.CustomerGroupID;
    //     this.customerGroup   = paramsData.CustomerGroup;
    // });
    const encryptedCustomerGroupID = paramsData.CustomerGroupID;
  const encryptedCustomerGroup = paramsData.CustomerGroup;

  // Decrypt CustomerGroupID and CustomerGroup
  if (encryptedCustomerGroupID && encryptedCustomerGroup) {
    this.customerGroupID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID));
    this.customerGroup = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroup));
  }
  
  // Log decrypted values
});
    this.initCustomerCategory();
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchSbtDomain = '';
    this.SearchStatus = true;
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

  initCustomerCategory(){
    this._generalService.getCustomerCategory().subscribe(
      data=>{
        this.customerCategoryList=data;
      }
    )
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
          customerGroupID: this.customerGroupID,
          customerGroup :this.customerGroup,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerGroupSBTDomainID = row.customerGroupSBTDomainID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerGroupID: this.customerGroupID,
        customerGroup :this.customerGroup,
      }
    });

  }
  deleteItem(row)
  {

    this.customerGroupSBTDomainID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  shouldShowDeleteButton(item: any): boolean {
    return item.status !== false; // Only show delete button if activationStatus is not false (not deleted)
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
     
      case 'sbtDomain':
        this.searchSbtDomain = this.searchTerm;
        break;
       
      default:
        this.searchTerm = '';
        break;
    }
      this.customerGroupSBTDomainService.getTableData(this.customerGroupID,this.searchSbtDomain,this.SearchStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        this.dataSource?.forEach((ele)=>{
          if(ele.status===true){
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
  onContextMenu(event: MouseEvent, item: CustomerGroupSBTDomain) {
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
          if(this.MessageArray[0]=="CustomerGroupSBTDomainCreate")
          {
            if(this.MessageArray[1]=="CustomerGroupSBTDomainView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Group SBT Domain Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupSBTDomainUpdate")
          {
            if(this.MessageArray[1]=="CustomerGroupSBTDomainView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Group SBT Domain Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupSBTDomainDelete")
          {
            if(this.MessageArray[1]=="CustomerGroupSBTDomainView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Group SBT Domain Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupSBTDomainAll")
          {
            if(this.MessageArray[1]=="CustomerGroupSBTDomainView")
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
    this.customerGroupSBTDomainService.getTableDataSort(this.customerGroupID,this.searchSbtDomain,this.SearchStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



