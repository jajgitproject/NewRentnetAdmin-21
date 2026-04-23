// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import moment from 'moment';
import { Router } from '@angular/router';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../carPaidTaxMIS/registrationDropDown.model';
import { CreditNoteHistoryComponent } from '../creditnotehistory/creditnotehistory.component';
import { InvoiceBillingHistoryComponent } from '../invoiceBillingHistory/invoiceBillingHistory.component';
import { SupplierComplianceDashboardService } from './supplierComplianceDashboard.service';
import { SupplierComplianceDashboard } from './supplierComplianceDashboard.model';
import { DriverComplianceDashboard } from '../driverComplianceDashboard/driverComplianceDashboard.model';
import { DriverComplianceDashboardService } from '../driverComplianceDashboard/driverComplianceDashboard.service';
import { DocumentDropDown } from '../general/documentDropDown.model';

@Component({
  standalone: false,
  selector: 'app-supplierComplianceDashboard',
  templateUrl: './supplierComplianceDashboard.component.html',
  styleUrls: ['./supplierComplianceDashboard.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierComplianceDashboardComponent implements OnInit {
  displayedColumns = [
    'supplierName',
    'documentType',
     'documentName',
    'supplierRequiredDocumentsNumber',
    'validTill',
    'daysRemaining',
   'documentStatus',
   'organizationalEntityName',
  ];

  dataSource: SupplierComplianceDashboard[] | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  SearchRequestFromDate: string = '';
  SearchRequestToDate: string = '';
  SearchTRN:string ='';
  SearchEcoBookingNo: string = '';
  SearchStatus:string ='';
  searchLocation: string = '';
  searchinvoiceStatusActiveOrVoid: string = '';
  public DocumentTypeList?:DriverComplianceDashboard[]=[];
  filteredDocumentTypeOption: Observable<DriverComplianceDashboard[]>;
  public DocumentList?:DocumentDropDown[]=[];
  filteredDocumentOption: Observable<DocumentDropDown[]>;
  documentType : FormControl=new FormControl();
filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
searchOwnedSupplier:string='';
searchDocumentType:string='';
searchDaysRemaning:string='';
location : FormControl=new FormControl();
documentName:FormControl=new FormControl();
searchDocumentName: string = '';
  searchActivationStatus :string ="Active";
  searchTerm: any = '';
  selectedFilter: string = 'search';
  advanceTableForm: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public supplierComplianceDashboardService: SupplierComplianceDashboardService,
    public driverComplianceDashboardService: DriverComplianceDashboardService,
    private snackBar: MatSnackBar,
    public router:Router,
    public _generalService: GeneralService,
    public route: Router,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.initDocumentType();
    this.initDocument();
    this.InitLocation();
    this.SubscribeUpdateService();

  }

   //-------------Document TYpe ------------------
   initDocumentType(){
    this.driverComplianceDashboardService.GetDocumentType().subscribe(
      data=>
      {                
        this.DocumentTypeList=data;
        this.filteredDocumentTypeOption = this.documentType.valueChanges.pipe(
         startWith(""),
         map(value => this._filterDocumentType(value || ''))
          );
      });
  }
  
  private _filterDocumentType(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
    return this.DocumentTypeList?.filter(
      data => 
      {
        return data.documentType.toLowerCase().includes(filterValue);
      }
    );
  }

  initDocument(){
    this._generalService.GetDocument().subscribe(
      data=>
      {                
        this.DocumentList=data;
        this.filteredDocumentOption = this.documentName.valueChanges.pipe(
         startWith(""),
         map(value => this._filterDocument(value || ''))
          );
      });
  }
  
  private _filterDocument(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
    return this.DocumentList?.filter(
      data => 
      {
        return data.documentName.toLowerCase().includes(filterValue);
      }
    );
  }

  refresh() {
    this.searchActivationStatus = 'Active';
    this.PageNumber = 0;
    this.documentType.setValue('');
    this.location.setValue('');
    this.searchDaysRemaning = "";
    this.documentName.setValue('');
    this.searchOwnedSupplier = "";
   
  
    this.searchTerm = '';
    this.selectedFilter = 'search';
  
    this.loadData();
  }

  public SearchData() {
    this.loadData();

  }
 
  public Filter() {
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
    //  switch (this.selectedFilter)
    // {
    //   case 'customerName':
    //     this.customerName.setValue(this.searchTerm);
    //     break;
    //   case 'searchLocation':
    //     this.searchLocation =this.searchTerm;
    //       break;
    //   default:
    //     this.searchTerm = '';
    //     break;
    // }
    
    this.supplierComplianceDashboardService.getTableData(this.documentName.value ,this.documentType.value,this.searchOwnedSupplier,  this.location.value, this.searchDaysRemaning,this.searchActivationStatus,this.PageNumber).subscribe(
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
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
  onContextMenu(event: MouseEvent, item: SupplierComplianceDashboard) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() {
    if (this.dataSource.length > 0) {

      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall() {

    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");
          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "UnlockEmployeeCreate") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployeeUpdate") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployee") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Account successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "UnlockEmployeeAll") {
              if (this.MessageArray[1] == "UnlockEmployeeView") {
                if (this.MessageArray[2] == "Failure") {
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
            else if (this.MessageArray[0] == "DataNotFound") {
              if (this.MessageArray[1] == "DuplicacyError") {
                if (this.MessageArray[2] == "Failure") {
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
    this.supplierComplianceDashboardService.getTableDataSort(this.searchDocumentName,this.searchDocumentType, this.searchOwnedSupplier, this.searchLocation, this.searchDaysRemaning, this.searchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
  openInNewTab(rowItem: any) {
    let baseUrl = this._generalService.FormURL;   
    const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingConfiguration'], { queryParams: {
      BookingID:rowItem.integrationRequestID,
      } }));
      window.open(baseUrl + url, '_blank');
  }



   InitLocation(){
      this.supplierComplianceDashboardService.GetLocation().subscribe(
        data=>
          {
            this.OrganizationalEntityList=data;
            this.filteredOrganizationalEntityOptions = this.location.valueChanges.pipe(
              startWith(""),
              map(value => this._filterOrganizationalEntity(value || ''))
            ); 
          });
    }
    private _filterOrganizationalEntity(value: string): any {
      const filterValue = value.toLowerCase();
    //   if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
      return this.OrganizationalEntityList.filter(
        customer => 
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        });
    }

    
   
 viewCreditNote(row) {
    this.dialog.open(CreditNoteHistoryComponent, {
      width: '500px',
      data: {
        invoiceID: row?.invoiceID,
        invoiceNumberWithPrefix: row?.invoiceNumberWithPrefix
      }
    });
  }





   

}




