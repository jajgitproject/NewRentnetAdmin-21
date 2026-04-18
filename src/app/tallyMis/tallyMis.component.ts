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
// import { TallyMisService } from './tallyMis.service';
// import { TallyMis } from './tallyMis.model';
import { DocumentDropDown } from '../general/documentDropDown.model';
import { TallyMis } from './tallyMis.model';
import { TallyMisService } from './tallyMis.service';

@Component({
  standalone: false,
  selector: 'app-tallyMis',
  templateUrl: './tallyMis.component.html',
  styleUrls: ['./tallyMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TallyMisComponent implements OnInit {
  displayedColumns = [
    'billingBranch',
    'customerServiceLocation',
    'customerGSTRNo',
    'bookedBy',
    'usedBy',
    'billno',
   'billDate',
   'customerName',
   'customerid',
   'carHireCharges',
   'parkingandToll',
   'netCCProcessingamount',
   'subtotal',
   'netSgstAmount',
   'netCgstAmount',
   'netIgstAmount',
   'finalBillAmount', 
    'sgstRate' ,
     'cgstRate' ,
    'igstRate' ,
    'roundOff' ,
    'narration' ,
    'billAlter' ,
    'irnno' ,
   'irndate',
  ];

  dataSource: TallyMis[] | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  // SearchFromDate: string = '';
  // SearchToDate: string = '';
  SearchTRN:string ='';
  SearchEcoBookingNo: string = '';
  SearchStatus:string ='';
  searchLocation: string = '';
  searchinvoiceStatusActiveOrVoid: string = '';
  public DocumentTypeList?:TallyMis[]=[];
    filteredDocumentTypeOption: Observable<TallyMis[]>;
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
  searchActivationStatus : boolean=true;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  advanceTableForm: any;
  SearchFromDate: string = '';
  startDate : FormControl = new FormControl();

  SearchToDate: string = '';
  endDate : FormControl = new FormControl();
  exporting: boolean = false;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public tallyMisService: TallyMisService,
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
    // this.loadData();
    this.InitLocation();
    this.SubscribeUpdateService();

  }

  refresh() {
    this.searchActivationStatus = true;
    this.PageNumber = 0;
   this.SearchFromDate = '';
    this.SearchToDate = '';
    this.location.setValue('');
   
  
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
   if(this.SearchFromDate!=="")
       {
         this.SearchFromDate=moment(this.SearchFromDate).format('yyyy-MM-DD');
       }
       if(this.SearchToDate!=="")
       {
         this.SearchToDate=moment(this.SearchToDate).format('yyyy-MM-DD');
       }
    
    this.tallyMisService.getTableData(this.SearchFromDate, this.SearchToDate, this.location.value, this.PageNumber).subscribe(
      data => {
        if (Array.isArray(data)) {
          this.dataSource = data.map(d => ({
            ...d,
            billDate: d.billDate ? moment(d.billDate).format('DD/MM/YYYY') : '',
            roundOff: ((d.roundOff ?? d.roundoff ?? d.roundOFF ?? d.round_off) || '').toString().trim() === '' ? '' : (d.roundOff ?? d.roundoff ?? d.roundOFF ?? d.round_off),
            narration: ((d.narration ?? d.Narration ?? d.invoiceNarration) || '').toString().trim() === '' ? '' : (d.narration ?? d.Narration ?? d.invoiceNarration)
          }));
        } else {
          this.dataSource = data;
        }
        console.log(this.dataSource)
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

downloadExcel() {
  this.tallyMisService.exportExcel(
    this.SearchFromDate,
    this.SearchToDate,
    this.location.value,
    this.PageNumber,
    'InvoiceID',
    'Ascending'
  ).subscribe(
    (response: any) => {

      // Backend sends HTML Excel as bytes → correct MIME type
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MISTally.xls';     // KEEP .xls because backend creates .xls
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      this.showNotification('snackbar-success', 'Download Completed', 'bottom', 'center');
    },
    (error: HttpErrorResponse) => {
      this.showNotification('snackbar-danger', 'Error downloading Excel', 'bottom', 'center');
    }
  );
}

  // Export all pages to Excel
  exportAllToExcel() {
    this.exporting = true;
    const allData: TallyMis[] = [];
    let page = 0;
    const fromDate = this.SearchFromDate ? moment(this.SearchFromDate).format('yyyy-MM-DD') : '';
    const toDate = this.SearchToDate ? moment(this.SearchToDate).format('yyyy-MM-DD') : '';
    const locationValue = this.location.value;

    const fetchNext = () => {
      this.tallyMisService.getTableData(fromDate, toDate, locationValue, page).subscribe(
        data => {
          const arr = Array.isArray(data) ? data : [];
          if (arr.length === 0) {
            this.generateExcel(allData);
            this.exporting = false;
            return;
          }
          const mapped = arr.map(d => ({
            ...d,
            billDate: d.billDate ? moment(d.billDate).format('DD/MM/YYYY') : '',
            roundOff: ((d.roundOff ?? d.roundoff ?? d.roundOFF ?? d.round_off) || '').toString().trim() === '' ? '' : (d.roundOff ?? d.roundoff ?? d.roundOFF ?? d.round_off),
            narration: ((d.narration ?? d.Narration ?? d.invoiceNarration) || '').toString().trim() === '' ? '' : (d.narration ?? d.Narration ?? d.invoiceNarration)
          }));
          allData.push(...mapped);
          page++;
          fetchNext();
        },
        _ => {
          // On error still try to export what we have
          this.generateExcel(allData);
          this.exporting = false;
        }
      );
    };
    fetchNext();
  }

  private generateExcel(rows: TallyMis[]) {
    if (!rows || rows.length === 0) { 
      this.showNotification('snackbar-danger', 'No data to export', 'bottom', 'center');
      return; 
    }
    
    // Create CSV content
    const headers = Object.keys(rows[0]);
    let csvContent = headers.join(',') + '\n';
    
    rows.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return '"' + stringValue.replace(/"/g, '""') + '"';
        }
        return stringValue;
      });
      csvContent += values.join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'TallyMIS.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showNotification('snackbar-success', 'Download Excel ', 'bottom', 'center');
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: TallyMis) {
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
      this.loadData();
    }
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
    this.tallyMisService.getTableDataSort(this.SearchFromDate, this.SearchToDate, this.location.value, this.PageNumber, coloumName.active, this.sortType).subscribe(
      data => {
        if (Array.isArray(data)) {
          this.dataSource = data.map(d => ({
            ...d,
            billDate: d.billDate ? moment(d.billDate).format('DD/MM/YYYY') : '',
            roundOff: ((d.roundOff ?? d.roundoff ?? d.roundOFF ?? d.round_off) || '').toString().trim() === '' ? '' : (d.roundOff ?? d.roundoff ?? d.roundOFF ?? d.round_off),
            narration: ((d.narration ?? d.Narration ?? d.invoiceNarration) || '').toString().trim() === '' ? '' : (d.narration ?? d.Narration ?? d.invoiceNarration)
          }));
        } else {
          this.dataSource = data;
        }
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
  openInNewTab(rowItem: any) {
    console.log(rowItem);
    let baseUrl = this._generalService.FormURL;   
    const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingConfiguration'], { queryParams: {
      BookingID:rowItem.integrationRequestID,
      } }));
      window.open(baseUrl + url, '_blank');
  }



   InitLocation(){
      this.tallyMisService.GetLocation().subscribe(
        data=>
          {
            this.OrganizationalEntityList=data;
            console.log(this.OrganizationalEntityList);
            this.filteredOrganizationalEntityOptions = this.location.valueChanges.pipe(
              startWith(""),
              map(value => this._filterOrganizationalEntity(value || ''))
            ); 
          });
    }
    private _filterOrganizationalEntity(value: string): any {
      const filterValue = value.toLowerCase();
       if (!value || value.length < 3)
     {
        return [];   
      }
      return this.OrganizationalEntityList.filter(
        customer => 
        {
          return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
        });
    }

    
   
 viewCreditNote(row) {
    console.log(row?.invoiceID);
    this.dialog.open(CreditNoteHistoryComponent, {
      width: '500px',
      data: {
        invoiceID: row?.invoiceID,
        invoiceNumberWithPrefix: row?.invoiceNumberWithPrefix
      }
    });
  }

  //---------- Attach/Detach ----------
  openAttachDetachForAdd() 
  { 
    const url = this.route.serializeUrl(
      this.route.createUrlTree(['/invoiceAttachDetach']));
      window.open(this._generalService.FormURL + url, '_blank');
  }

  openAttachDetachForEdit(item:any) 
  { 
    const url = this.route.serializeUrl(
      this.route.createUrlTree(['/invoiceAttachDetach'],{ queryParams: {
      invoiceNumberWithPrefix:item.invoiceNumberWithPrefix,
      invoiceID:item.invoiceID
      } }));
      window.open(this._generalService.FormURL + url, '_blank');
  }
  
viewInvoiceBilling(row) {
    console.log(row?.invoiceID);
    this.dialog.open(InvoiceBillingHistoryComponent, {
      width: '500px',
      data: {
        invoiceID: row?.invoiceID,
        invoiceNumberWithPrefix: row?.invoiceNumberWithPrefix
      }
    });
  }



   

}



