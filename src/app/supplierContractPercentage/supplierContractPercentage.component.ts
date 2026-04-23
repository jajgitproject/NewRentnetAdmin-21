// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierContractPercentageService } from './supplierContractPercentage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierContractPercentage } from './supplierContractPercentage.model';
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
@Component({
  standalone: false,
  selector: 'app-supplierContractPercentage',
  templateUrl: './supplierContractPercentage.component.html',
  styleUrls: ['./supplierContractPercentage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierContractPercentageComponent implements OnInit {
  displayedColumns = [
    'fromDate',
    'toDate',
   'supplierPercentage',
    'activationStatus',
    'actions'
  ];
  dataSource: SupplierContractPercentage[] | null;
  supplierContractPercentageID: number;
  advanceTable: SupplierContractPercentage | null;
  SearchSupplierPercentage: string = ''; 
  search : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  SupplierContractID:number=1;
  supplierContract_ID: any;
  Applicable_From: any;
  Applicable_To: any;
  supplier_Name: any;
  supplierContractName:any;
  
 selectedFilter: string = 'search';
 searchTerm: any = '';
 filterSelected:boolean = true;
 SearchFromDate:string = '';
  SearchToDate:string='';
  SearchPercentage:string='';
  SearchCustomer:string='';
  SearchCity:string='';
  SearchapplicableTo:string='';
  SearchapplicableFrom:string='';

  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public supplierContractPercentageService: SupplierContractPercentageService,
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
      // this.supplierContract_ID   = paramsData.SupplierContractID;
      //  this.Applicable_From   = paramsData.ApplicableFrom;
      //  this.Applicable_To   = paramsData.ApplicableTo;
      //  this.supplier_Name=paramsData.supplierName;
      //  this.supplierContractName=paramsData.supplierContractName;
      const encryptedSupplierContractID = this.route.snapshot.queryParamMap.get('SupplierContractID');
      const encryptedApplicableFrom = this.route.snapshot.queryParamMap.get('ApplicableFrom');
      const encryptedApplicableTo = this.route.snapshot.queryParamMap.get('ApplicableTo');
      const encryptedSupplierName = this.route.snapshot.queryParamMap.get('supplierName');
      const encryptedSupplierContractName = this.route.snapshot.queryParamMap.get('supplierContractName');
      // Check if the parameters exist
      if (encryptedSupplierContractID && encryptedApplicableFrom && encryptedApplicableTo && encryptedSupplierName && encryptedSupplierContractName) {
        // Decrypt and decode the parameters
        this.supplierContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractID));
        this.Applicable_From= this._generalService.decrypt(decodeURIComponent(encryptedApplicableFrom));
        this.Applicable_To= this._generalService.decrypt(decodeURIComponent(encryptedApplicableTo));
        this.supplier_Name= this._generalService.decrypt(decodeURIComponent(encryptedSupplierName));
        this.supplierContractName= this._generalService.decrypt(decodeURIComponent(encryptedSupplierContractName));
        this.supplier_Name = decodeURIComponent(this.supplier_Name);
        this.Applicable_To = decodeURIComponent( this.Applicable_To);
        this.Applicable_From= decodeURIComponent( this.Applicable_From);
      }
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  refresh() {
    this.SearchSupplierPercentage = '';
    this.SearchFromDate= '';
    this.SearchToDate = '';
    this.SearchActivationStatus = true;
    this.searchTerm='';
    this.selectedFilter ='search';
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
          SupplierContractID:this.supplierContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          SupplierName:this.supplier_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierContractPercentageID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        SupplierContractID:this.supplierContract_ID,
          ApplicableFrom:this.Applicable_From,
          ApplicableTo:this.Applicable_To,
          SupplierName:this.supplier_Name
      }
    });

  }
  public SearchData()
  {
    this.loadData();
    //this.SearchSupplierContractPercentage='';
  }
  
  deleteItem(row)
  {

    this.supplierContractPercentageID = row.id;
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
    switch (this.selectedFilter) {
      case 'applicableFrom':
        this.SearchFromDate = this.searchTerm;
        break;
      case 'applicableTo':
        this.SearchToDate = this.searchTerm;
        break;
      case 'supplierPercentage':
        this.SearchSupplierPercentage = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }

      this.supplierContractPercentageService.getTableData(this.supplierContract_ID,
        this.SearchSupplierPercentage,
        this.SearchFromDate,
        this.SearchToDate,
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
  onContextMenu(event: MouseEvent, item: SupplierContractPercentage) {
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
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="SupplierContractPercentageCreate")
          {
            if(this.MessageArray[1]=="SupplierContractPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                //debugger;
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Contract  Percentage Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractPercentageUpdate")
          {
            if(this.MessageArray[1]=="SupplierContractPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Percentage Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractPercentageDelete")
          {
            if(this.MessageArray[1]=="SupplierContractPercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract  Percentage Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractPercentageAll")
          {
            if(this.MessageArray[1]=="SupplierContractPercentageView")
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
    //debugger;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.supplierContractPercentageService.getTableDataSort(this.supplierContract_ID,this.SearchSupplierPercentage,this.SearchFromDate,
      this.SearchToDate,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



