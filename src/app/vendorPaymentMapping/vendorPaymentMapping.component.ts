// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';

import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';

import { ActivatedRoute, Router } from '@angular/router';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';


import { ModeOfPaymentDropDown } from '../modeOfPayment/modeOfPaymentDropDown.model';
import Swal from 'sweetalert2';
import { VendorPaymentMapping } from './vendorPaymentMapping.model';
import { VendorPaymentMappingService } from './vendorPaymentMapping.service';

@Component({
  standalone: false,
  selector: 'app-vendorPaymentMapping',
  templateUrl: './vendorPaymentMapping.component.html',
  styleUrls: ['./vendorPaymentMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorPaymentMappingComponent implements OnInit {
  displayedColumns = [
    'ModeOfPayment',
    'activationStatus',
    'actions'
  ];
  dataSource: VendorPaymentMapping[] | null;
  vendorPaymentMappingID: number;
  advanceTable: VendorPaymentMapping | null;
  searchModeOfPayment: string = '';
  modeOfPayment : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  public ModeOfPaymentList?: ModeOfPaymentDropDown[] = [];
  filteredModeOptions: Observable<ModeOfPaymentDropDown[]>;
  
  Applicable_To: any;
  Applicable_From: any;
  customerContract_ID: any;
  customerContract_Name: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
vendorContract_ID:any;
  vendorContractName: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public vendorPaymentMappingService: VendorPaymentMappingService,
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
      // this.customerContract_ID   = paramsData.CustomerContractID;
      //  this.Applicable_From   = paramsData.StartDate;
      //  this.Applicable_To   = paramsData.EndDate;
      //  this.customerContract_Name=paramsData.CustomerContractName;
      const encryptedVendorContractID = paramsData.VendorContractID;
      const encryptedStartDate = paramsData.StartDate;
      const encryptedEndDate = paramsData.EndDate;
      const encryptedVendorContractName = paramsData.VendorContractName;
    
      // Decrypt the parameters if they exist
      if (encryptedVendorContractID && encryptedStartDate && encryptedEndDate && encryptedVendorContractName) {
        this.vendorContract_ID = parseInt(this._generalService.decrypt(decodeURIComponent(encryptedVendorContractID)), 10);
        this.Applicable_From = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
        this.Applicable_To = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));
        this.vendorContractName = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractName));
    
        // Log the decrypted values to the console for verification
        console.log("Decrypted VendorContractID:", this.vendorContract_ID);
        console.log("Decrypted StartDate:", this.Applicable_From);
        console.log("Decrypted EndDate:", this.Applicable_To);
        console.log("Decrypted VendorContractName:", this.vendorContractName);
      }
    });
    this.loadData();
    this.InitModeOfPayment();
    this.SubscribeUpdateService();
  }

   //------------modeOfPayment -----------------

   InitModeOfPayment(){
    this._generalService.GetModeOfPayment().subscribe
    (
      data =>   
      {
        this.ModeOfPaymentList = data; 
        this.filteredModeOptions = this.modeOfPayment.valueChanges.pipe(
          startWith(""),
          map(value => this._filterMode(value || ''))
        );
       
      }
    );
  }
private _filterMode(value: string): any {
     const filterValue = value.toLowerCase();
     return this.ModeOfPaymentList.filter(
       customer => 
       {
         return customer.modeOfPayment.toLowerCase().indexOf(filterValue)===0;
       }
     );
     
   };
   
  refresh() {
    this.modeOfPayment.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  addNew()
  {
    console.log("Vendor Contract ID in Add New Call:", this.vendorContract_ID);
      const dialogRef = this.dialog.open(FormDialogComponent, 
        {
          data: 
            {
              advanceTable: this.advanceTable,
              action: 'add',
               vendorContract_ID:this.vendorContract_ID
            }
        }); 
  }

  editCall(row) {
    console.log("Vendor Contract ID in Edit Call:", this.vendorContract_ID);
    //  alert(row.id);
  this.vendorPaymentMappingID = row.vendorPaymentMappingID;

  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
vendorContract_ID:this.vendorContract_ID

    }
  });

}
deleteItem(row)
{
  this.vendorPaymentMappingID = row.id;
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

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'paymentType':
        this.modeOfPayment.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      const vendorContractID = Number(this.vendorContract_ID);
      this.vendorPaymentMappingService.getTableData(vendorContractID,this.modeOfPayment.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: VendorPaymentMapping) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource?.length>0) 
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
      this.loadData(); 
    } 
  }

  public SearchData()
  {
    this.loadData();

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
          if(this.MessageArray[0]=="VendorPaymentMappingCreate")
          {
            if(this.MessageArray[1]=="VendorPaymentMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract Payment Mapping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorPaymentMappingUpdate")
          {
            if(this.MessageArray[1]=="VendorPaymentMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Payment Mapping Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorPaymentMappingDelete")
          {
            if(this.MessageArray[1]=="VendorPaymentMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Vendor Contract Payment Mapping Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorPaymentMappingAll")
          {
            if(this.MessageArray[1]=="VendorPaymentMappingView")
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
    const vendorContractID = Number(this.vendorContract_ID);
    this.vendorPaymentMappingService.getTableDataSort(vendorContractID,this.searchModeOfPayment,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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



