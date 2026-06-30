// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subscription, firstValueFrom } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl, Validators } from '@angular/forms';
import { InvoiceHomeService } from './invoiceHome.service';
import { InvoiceHome } from './invoiceHome.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import moment from 'moment';
import { Router } from '@angular/router';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../carPaidTaxMIS/registrationDropDown.model';
import { CreditNoteHistoryComponent } from '../creditnotehistory/creditnotehistory.component';
import { InvoiceBillingHistoryComponent } from '../invoiceBillingHistory/invoiceBillingHistory.component';
import { FormDialogCIComponent } from '../cancelInvoice/dialogs/form-dialog/form-dialog.component';
import Swal from 'sweetalert2';
import { BulkBillsDownloadService } from '../bulkBillsDownload/bulkBillsDownload.service';
import { BackfillStepDialogComponent } from '../bulkBillsDownload/backfill-step-dialog.component';
import { ViewBillPdfService } from '../general/view-bill-pdf.service';
import { resolveViewBillRoute } from '../general/view-bill-route.util';

interface ExistingPdfSummary {
  invoice: string[];
  dutySlips: string[];
  tollParking: string[];
  interstateTax: string[];
  reservationEmails: string[];
}

@Component({
  standalone: false,
  selector: 'app-invoiceHome',
  templateUrl: './invoiceHome.component.html',
  styleUrls: ['./invoiceHome.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InvoiceHomeComponent implements OnInit {
  displayedColumns = [
    'invoiceNumberWithPrefix',
    'customerName',
    'invoiceDate',
    'invoiceTotalAmountAfterGST',
    'totalCreditNoteAmount',
    'organizationalEntityName',
   'invoiceType',
   'invoiceStatusActiveOrVoid',
     'IRNStatus',
    // 'viewCreditNote',
    // 'viewHistory',
    'actions'
  ];

  dataSource: InvoiceHome[] | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  // searchFromDate: string = '';
  // searchToDate: string = '';
  SearchRequestFromDate: string = '';
  SearchRequestToDate: string = '';
  SearchTRN:string ='';
  SearchEcoBookingNo: string = '';
  SearchStatus:string ='';
  archivingInvoiceId: number | null = null;
  searchInvoiceNo: string = '';
   searchDutySlip:string='';
   searchReservationID:string='';
  searchinvoiceStatusActiveOrVoid: string = '';
  public CustomerList?:CustomerDropDown[]=[];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  customerName : FormControl=new FormControl();
  filteredBillingOptions: Observable<OrganizationalEntityDropDown[]>;
     filteredVOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
   filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
     public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
filteredOptions: Observable<CustomerGroupDropDown[]>;
public customerGroupList?: CustomerGroupDropDown[] = [];
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];
searchCustomerGroup:string='';
searchCustomerName:string='';
searchBranch:string='';
customerGroup : FormControl=new FormControl();
branch:FormControl=new FormControl();
organizationalEntityName: FormControl = new FormControl();
bookerName: FormControl = new FormControl();
  searchActivationStatus : boolean=true;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  invoiceNumberWithPrefix: FormControl=new FormControl();
  InvoiceCreditNoteHistoryID: any;
  invoiceID: any;
  advanceTableForm: any;
  SearchEInvoiceStatus:string='';
  customerGroupID: any;
  customer : FormControl=new FormControl();

  SearchFromDate: string = '';
  startDate : FormControl = new FormControl();

  SearchToDate: string = '';
  endDate : FormControl = new FormControl();
  SearchInvoiceStatus:string='';

  searchInvoiceType:string='';
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public invoiceHomeService: InvoiceHomeService,
    private bulkBillsDownloadService: BulkBillsDownloadService,
    private viewBillPdfService: ViewBillPdfService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
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
    this.InitCustomerGroup();
    // this.initAllCustomers();
    this.InitCompany();
    this.InitRegistrationNumber();
    this.SubscribeUpdateService();

  }

  refresh() 
  {
    this.searchActivationStatus = true;
    this.PageNumber = 0;
    this.customerGroup.setValue('');
    this.searchInvoiceNo = "";
    this.branch.setValue('');
    this.customer.setValue('');
    this.searchinvoiceStatusActiveOrVoid = "";
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchEInvoiceStatus = "";
    this.searchInvoiceType = "";
    this.searchDutySlip = '';
    this.searchReservationID = '';
    this.customerName.setValue('');
    this.SearchInvoiceStatus = '';
    this.searchTerm = '';
    this.selectedFilter = 'search';
    // this.initAllCustomers();
    this.loadData();
  }

  public SearchData() 
  {
    if (this.customer.invalid) {
      this.customer.markAsTouched();
      return;
    }
    this.loadData();
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
    if(this.SearchFromDate!=="")
    {
      this.SearchFromDate=moment(this.SearchFromDate).format('yyyy-MM-DD');
    }
    if(this.SearchToDate!=="")
    {
      this.SearchToDate=moment(this.SearchToDate).format('yyyy-MM-DD');
    }
    this.invoiceHomeService.getTableData(this.searchInvoiceType,this.customer.value,this.customerGroup.value,  this.searchInvoiceNo.replace("/","-"), this.branch.value,this.SearchFromDate,this.SearchToDate,this.SearchInvoiceStatus,this.SearchEInvoiceStatus,this.searchDutySlip,this.searchReservationID,this.searchActivationStatus,this.PageNumber).subscribe(
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
  onContextMenu(event: MouseEvent, item: InvoiceHome) {
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
    this.invoiceHomeService.getTableDataSort(this.searchCustomerName, this.searchCustomerGroup, this.searchInvoiceNo, this.searchBranch, this.SearchFromDate, this.SearchToDate, this.SearchInvoiceStatus, this.SearchEInvoiceStatus,this.searchDutySlip,this.searchReservationID,this.searchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
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
      BookingID: rowItem.integrationRequestID,
      returnUrl: '/invoiceHome',
      } }));
      window.open(baseUrl + url, '_blank');
  }

  //---------- Customer Group ----------
  InitCustomerGroup()
  {
    this._generalService.getCustomerGroup().subscribe(
    data=>{
      this.customerGroupList=data;
      this.filteredOptions = this.customerGroup.valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomerGroup(value || ''))
      );
    })
  }
  private _filterCustomerGroup(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().includes(filterValue);
      }
    );    
  };

  onCustomerGroupSelected(customerGroup: string) {
    const selectedCustomerGroup = this.customerGroupList.find(
      data => data.customerGroup === customerGroup
    );
  
    if (selectedCustomerGroup) {
      this.customer.setValue('');
      this.getGroupID(selectedCustomerGroup.customerGroupID);
    } else {
      // Group cleared — reset customer list to all customers
      this.customerGroupID = null;
      this.customer.setValue('');
      // this.initAllCustomers();
    }
  }

  getGroupID(customerGroupID: any) {
    this.customerGroupID=customerGroupID;
    this.InitCustomer();
  }

  //-------Customer (all, no group filter)-------
  onKeyupCustomerName(event?: any)
  {
    const Prefix = ((event?.target?.value ?? this.customer?.value) || '').toString().trim();
    if (Prefix.length < 3)
    {
      this.CustomerList = [];
      return;
    }
    this._generalService.getCustomerForInvoice(Prefix).subscribe(
    data=>
    {
      this.CustomerList=data;
      this.filteredCustomerOptions = merge(of(Prefix), this.customer.valueChanges).pipe(
        map(value => this._filterCustomer((value || '').toString()))
      );
    });
  }
  
  //-------Customer (filtered by group)-------
  InitCustomer()
  {
    this._generalService.GetCustomersForCP(this.customerGroupID).subscribe(
    data=>
    {
      this.CustomerList=data;
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomer(value || ''))
      ); 
    });
  }

  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];
    }
    return this.CustomerList.filter(
      data => 
      {
        return data.customerName.toLowerCase().includes(filterValue);
      }
    );
  }

  onCustomerSelected(customer: string) 
  {
    const selectedCustomer = this.CustomerList.find(
      data => data.customerName === customer);
  }

   InitCompany(){
      this._generalService.GetOrganizationalBranch().subscribe(
        data=>
          {
            this.OrganizationalEntityList=data;
            this.filteredOrganizationalEntityOptions = this.branch.valueChanges.pipe(
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

     InitRegistrationNumber(){
      this._generalService.GetRegistrationForDropDown().subscribe(
        data=>
        {
          this.RegistrationNumberList=data;
          this.filteredRegistrationNumberOptions = this.invoiceNumberWithPrefix.valueChanges.pipe(
            startWith(""),
            map(value => this._filterRN(value || ''))
          ); 
        });
    }
    
    private _filterRN(value: string): any {
      const filterValue = value.toLowerCase();
       if (!value || value.length < 3)
     {
        return [];   
      }
      return this.RegistrationNumberList.filter(
        customer => 
        {
          return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }

  async generateAndArchivePdfs(row: InvoiceHome) {
    if (!row?.invoiceID) {
      return;
    }

    let existingPdfs: ExistingPdfSummary | null = null;

    try {
      existingPdfs = await this.loadExistingPdfs(row.invoiceID);
    } catch (err: any) {
      Swal.fire({
        title: 'Unable to check existing PDFs',
        text: this.extractPdfGenerationError(err, 'Failed to load archived document records from the database.'),
        icon: 'error'
      });
      return;
    }

    const confirmed = await this.confirmPdfGeneration(row, existingPdfs);
    if (!confirmed) {
      return;
    }

    const performedBy = this._generalService.getUserID();
    this.setArchivingInvoice(row.invoiceID);
    const stepErrors: string[] = [];

    try {
      await this.runGeneratePdfsInteractive(row, performedBy, stepErrors);
      if (stepErrors.length) {
        Swal.fire({
          title: 'PDF generation completed with errors',
          html: stepErrors.join('<br>'),
          icon: 'warning'
        });
        return;
      }

      Swal.fire({
        title: 'PDFs generated',
        text: 'All documents were generated successfully.',
        icon: 'success'
      });
    } catch (err: any) {
      const message = this.extractPdfGenerationError(err, 'PDF generation failed.');
      Swal.fire({
        title: 'PDF generation failed',
        text: message,
        icon: 'error'
      });
    } finally {
      this.clearArchivingInvoice();
    }
  }

  isArchivingInvoice(invoiceId: number | string | null | undefined): boolean {
    if (this.archivingInvoiceId == null || invoiceId == null) {
      return false;
    }
    return Number(this.archivingInvoiceId) === Number(invoiceId);
  }

  private setArchivingInvoice(invoiceId: number | string): void {
    this.archivingInvoiceId = Number(invoiceId) || null;
    this.cdr.markForCheck();
  }

  private clearArchivingInvoice(): void {
    this.archivingInvoiceId = null;
    this.cdr.markForCheck();
  }

  private async confirmPdfGeneration(row: InvoiceHome, existingPdfs: ExistingPdfSummary): Promise<boolean> {
    if (this.hasExistingPdfs(existingPdfs)) {
      const result = await Swal.fire({
        title: 'PDFs Already Exist as Below',
        html: `${this.formatExistingPdfsMessage(existingPdfs)}<br><br><strong>Do you wish to Regenerate?</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, regenerate',
        cancelButtonText: 'No',
        customClass: {
          cancelButton: 'btn btn-danger',
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: true
      });
      return !!result.isConfirmed;
    }

    const result = await Swal.fire({
      title: 'Generate PDFs?',
      text: `Generate invoice bill, duty slip(s), toll/parking, and interstate tax PDFs for ${row.invoiceNumberWithPrefix || row.invoiceID}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, generate',
      cancelButtonText: 'Cancel',
      customClass: {
        cancelButton: 'btn btn-danger',
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: true
    });
    return !!result.isConfirmed;
  }

  private async loadExistingPdfs(invoiceId: number): Promise<ExistingPdfSummary> {
    const result = await firstValueFrom(this.bulkBillsDownloadService.getExistingInvoiceDocuments(invoiceId));
    return {
      invoice: this.normalizeFileNameList(result?.invoiceFileNames ?? result?.InvoiceFileNames),
      dutySlips: this.normalizeFileNameList(result?.dutySlipFileNames ?? result?.DutySlipFileNames),
      tollParking: this.normalizeFileNameList(result?.tollParkingFileNames ?? result?.TollParkingFileNames),
      interstateTax: this.normalizeFileNameList(result?.interstateTaxFileNames ?? result?.InterstateTaxFileNames),
      reservationEmails: this.normalizeFileNameList(result?.reservationEmailFileNames ?? result?.ReservationEmailFileNames),
    };
  }

  private normalizeFileNameList(values: string[] | null | undefined): string[] {
    return (values || []).filter((name) => !!name);
  }

  private hasExistingPdfs(summary: ExistingPdfSummary): boolean {
    return summary.invoice.length > 0
      || summary.dutySlips.length > 0
      || summary.tollParking.length > 0
      || summary.interstateTax.length > 0
      || summary.reservationEmails.length > 0;
  }

  private formatExistingPdfsMessage(summary: ExistingPdfSummary): string {
    const lines: string[] = [];
    if (summary.invoice.length) {
      lines.push(`Invoice = ${summary.invoice.join(', ')}`);
    }
    if (summary.dutySlips.length) {
      lines.push(`Duty Slip = ${summary.dutySlips.join(', ')}`);
    }
    if (summary.tollParking.length) {
      lines.push(`Toll Parking = ${summary.tollParking.join(', ')}`);
    }
    if (summary.interstateTax.length) {
      lines.push(`InterState Tax = ${summary.interstateTax.join(', ')}`);
    }
    if (summary.reservationEmails.length) {
      lines.push(`ReservationEmail = ${summary.reservationEmails.join(', ')}`);
    }
    return lines.join('<br>');
  }

  private async runGeneratePdfsInteractive(
    row: InvoiceHome,
    performedBy: number,
    stepErrors: string[]
  ): Promise<void> {
    await this.generateInvoicePdfStep(row, performedBy, stepErrors);

    const invoiceId = row.invoiceID;
    const duties = await firstValueFrom(this.bulkBillsDownloadService.getInvoiceDuties(invoiceId));
    const dutyRows = duties || [];
    if (!dutyRows.length) {
      await this.showPdfStepModal('Duty Slip', false, 'NA');
      return;
    }

    for (const duty of dutyRows) {
      const dutySlipId = duty.dutySlipID ?? duty.DutySlipID;
      if (!dutySlipId) continue;

      await this.generateDocumentStep(
        'Duty Slip',
        () => firstValueFrom(this.bulkBillsDownloadService.generateDutySlipPdf(dutySlipId, performedBy, invoiceId)),
        stepErrors
      );

      await this.generateReceiptDocumentsStep(
        'Toll Parking',
        () => firstValueFrom(this.bulkBillsDownloadService.generateTollParkingPdfs(dutySlipId, performedBy, true)),
        stepErrors
      );

      await this.generateReceiptDocumentsStep(
        'Interstate Tax',
        () => firstValueFrom(this.bulkBillsDownloadService.generateInterstateTaxPdfs(dutySlipId, performedBy, true)),
        stepErrors
      );
    }
  }

  private async generateInvoicePdfStep(
    row: InvoiceHome,
    performedBy: number,
    stepErrors: string[]
  ): Promise<void> {
    await this.generateDocumentStep(
      'Invoice',
      async () => {
        if (this.viewBillPdfService.isSupportedViewBillRoute(row.templateAddress, row.invoiceType)) {
          return this.viewBillPdfService.archiveBillFromViewBill(
            row.invoiceID,
            performedBy,
            row.templateAddress,
            row.invoiceType
          );
        }

        return firstValueFrom(this.bulkBillsDownloadService.generateInvoicePdf(row.invoiceID, performedBy));
      },
      stepErrors
    );
  }

  private async generateDocumentStep(
    documentType: string,
    action: () => Promise<any>,
    stepErrors: string[]
  ): Promise<void> {
    try {
      const result = await action();
      const fileName = result?.fileName ?? result?.FileName ?? 'NA';
      const created = !!fileName && fileName !== 'NA';
      await this.showPdfStepModal(documentType, created, fileName);
      if (!created) {
        stepErrors.push(`${documentType} not created`);
      }
    } catch (err) {
      const message = this.extractPdfGenerationError(err, `${documentType} failed.`);
      stepErrors.push(message);
      await this.showPdfStepModal(documentType, false, 'NA');
    }
  }

  private async generateReceiptDocumentsStep(
    documentType: string,
    action: () => Promise<any[]>,
    stepErrors: string[]
  ): Promise<void> {
    try {
      const results = await action();
      const docs = results || [];
      if (!docs.length) {
        await this.showPdfStepModal(documentType, false, 'NA');
        return;
      }
      for (const doc of docs) {
        const fileName = doc?.fileName ?? doc?.FileName ?? 'NA';
        await this.showPdfStepModal(documentType, true, fileName);
      }
    } catch (err) {
      const message = this.extractPdfGenerationError(err, `${documentType} failed.`);
      stepErrors.push(message);
      await this.showPdfStepModal(documentType, false, 'NA');
    }
  }

  private showPdfStepModal(documentType: string, created: boolean, fileName: string): Promise<void> {
    const status = created ? 'Created' : 'Not Created';
    const name = created && fileName ? fileName : 'NA';
    const message = `${documentType} ${status} ${name}`;
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(BackfillStepDialogComponent, {
        width: '480px',
        disableClose: true,
        data: {
          title: 'PDF generation step',
          message,
        },
      });
      dialogRef.afterClosed().subscribe(() => resolve());
    });
  }

  private extractPdfGenerationError(err: any, fallback: string): string {
    const body = err?.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      const message = body.message ?? body.Message ?? body.title ?? body.Title;
      if (message) {
        return String(message);
      }
    }
    return err?.message || fallback;
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
    this.dialog.open(InvoiceBillingHistoryComponent, {
      width: '500px',
      data: {
        invoiceID: row?.invoiceID,
        invoiceNumberWithPrefix: row?.invoiceNumberWithPrefix
      }
    });
  }

 //-------------View Bill-------------------------

   ViewBill(item)
  {
    const route = resolveViewBillRoute(item.templateAddress, item.invoiceType);
    const url = this.router.serializeUrl(this.router.createUrlTree([`/${route}`], {
      queryParams: {
        invoiceID: item.invoiceID,
      }
    }));
    window.open(this._generalService.buildAppWindowUrl(url), '_blank');
  }

//   ViewBill(item) {
//     debugger
//   let baseUrl = this._generalService.FormURL;

//   // Use templateAddress directly as the route
//   const url = this.router.serializeUrl(
//     this.router.createUrlTree([`/${item.templateAddress}`], {
//       queryParams: {
//         invoiceID: item.invoiceID
//       }
//     })
//   );

//   window.open(baseUrl + url, '_blank');
// }

  //----------------Cancel Invoice ---------------------
  //  cancelInvoice(row) {
  //   this.dialog.open(FormDialogCIComponent, {
  //     width: '400px',
  //     data: {
  //       invoiceID: row?.invoiceID,
  //       invoiceNumberWithPrefix: row?.invoiceNumberWithPrefix
  //     }
  //   });
  // }
    cancelInvoice(row)
    {
      if(row.irnStatus)
      {
        Swal.fire({
         title: 'E Invoice Generated.',
         icon: 'warning'
           });
      }
      else
      {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to cancel this Invoice?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        customClass: {
          cancelButton: 'btn btn-danger',
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: true // Let Bootstrap classes apply fully
      }).then((result) => {
        if (result.isConfirmed) 
        {
          const dialogRef = this.dialog.open(FormDialogCIComponent, 
          {
           width: '600px',
            data: 
            {
              invoiceID: row?.invoiceID,
              invoiceNumberWithPrefix: row?.invoiceNumberWithPrefix,
              data:row,
              //action:'cancel',
            }
          });
          dialogRef.afterClosed().subscribe((res: any) => {
            if (res === true) 
            {
             this.loadData();
            }
          });
        }
      });
      }
     
    }

}




