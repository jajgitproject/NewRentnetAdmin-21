// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../bank/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneralBillDetails } from './generalBillDetails.model';
import { GeneralBillDetailsService } from './generalBillDetails.service';
import { CustomerBillToShipTo } from '../customerBillToShipTo/customerBillToShipTo.model';
import { CustomerBillToShipToService } from '../customerBillToShipTo/customerBillToShipTo.service';
@Component({
  standalone: false,
  selector: 'app-generalBillDetails',
  templateUrl: './generalBillDetails.component.html',
  styleUrls: ['./generalBillDetails.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class GeneralBillDetailsComponent implements OnInit {
  dataSource: any;
  advanceTable: GeneralBillDetails | null;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  invoiceID: number;
  reservationID: number;
  vehicleName: any;
  invoiceTotalAmountAfterGSTInWords: void;
    dataSourceForCalculate: any = {
    invoiceTotalAmountAfterGSTInWords: ''
  };
  invoiceLogoUrl: string | null = null;
  shipToDetails: CustomerBillToShipTo | null = null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public generalBillDetailsService: GeneralBillDetailsService,
    private customerBillToShipToService: CustomerBillToShipToService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
 @ViewChild('printSection', { static: false }) printSection: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.invoiceLogoUrl = 'assets/images/logoeco1.png';
    this.route.queryParams.subscribe(paramsData =>{
      this.invoiceID   = paramsData.invoiceID;
    });
    this.loadData();
    
  }

  public loadData() 
  {
     this.generalBillDetailsService.printGeneralBillInfo(this.invoiceID).subscribe
   (
     data =>   
     {
       this.dataSource = data;    
       console.log("dataSource",this.dataSource);   
       this.dataSourceForCalculate.invoiceTotalAmountAfterGSTInWords = this.convertNumberToWords(this.dataSource.invoiceTotalAmountAfterGST);
       this.loadShipToDetails();
     },
     (error: HttpErrorResponse) => {
       this.dataSource = null;
       this.shipToDetails = null;
     }
   );
 }
convertNumberToWords(amount: number): string {

  if (amount == null || amount == undefined) {
    return 'Zero Rupees Only';
  }

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function numToWords(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 100000)
      return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000)
      return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");

    return numToWords(Math.floor(n / 10000000)) + " Crore" +
      (n % 10000000 ? " " + numToWords(n % 10000000) : "");
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = `${numToWords(rupees)} Rupees`;

  if (paise > 0) {
    words += ` and ${numToWords(paise)} Paise`;
  }

  return `${words} Only`;
}
 print() {
  const previousTitle = document.title;
  const previousUrl = `${location.pathname}${location.search}${location.hash}`;
  document.title = 'TAX INVOICE';
  // Clear hash/query so browser print footer does not show the invoice URL.
  history.replaceState(null, '', location.pathname || '/');

  const restore = () => {
    document.title = previousTitle;
    history.replaceState(null, '', previousUrl);
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  window.print();
}

shouldPrintSezInvoiceDeclaration(): boolean {
  return this.isSezCustomerForInvoice();
}

getSezInvoiceDeclaration(): string {
  if (this.isInvoiceGstCharged()) {
    return 'Supply meant for Export/supply to SEZ unit or SEZ developer for authorised operations under bond or letter of undertaking with payment of integrated TAX';
  }
  return 'Supply meant for Export/supply to SEZ unit or SEZ developer for authorised operations under bond or letter of undertaking without payment of integrated TAX';
}

private isSezCustomerForInvoice(): boolean {
  if (this.dataSource?.isSEZ === true) {
    return true;
  }
  const customerType = (this.dataSource?.customerType || '').toString().trim();
  return customerType.toUpperCase() === 'SEZ';
}

private isInvoiceGstCharged(): boolean {
  const src = this.dataSource;
  if (!src) {
    return false;
  }
  const amount =
    (Number(src.cgstAmount) || 0) + (Number(src.sgstAmount) || 0) + (Number(src.igstAmount) || 0);
  if (amount > 0) {
    return true;
  }
  return (
    (Number(src.cgstPercentage) || 0) +
    (Number(src.sgstPercentage) || 0) +
    (Number(src.igstPercentage) || 0)
  ) > 0;
}

  formatExtraKmsHrs(lineItem: any): string {
    if (!lineItem) {
      return '';
    }
    const quantity = lineItem.quantity ?? lineItem.Quantity;
    if (quantity == null || quantity === '' || Number(quantity) === 0) {
      return '';
    }
    const uom = (lineItem.uom ?? lineItem.UOM ?? '').toString().trim();
    return uom ? `${quantity} ${uom}` : `${quantity}`;
  }

  hasShipToDetails(): boolean {
    return !!(this.shipToDetails?.shipToCompany);
  }

  getShipToCountryName(): string {
    return (
      this.shipToDetails?.countryName ||
      this.dataSource?.shipToCountryName ||
      this.dataSource?.customerCountryName ||
      ''
    );
  }

  private loadShipToDetails(): void {
    this.shipToDetails = null;
    if (!this.dataSource) {
      return;
    }

    const inlineShipTo = this.extractInlineShipToDetails(this.dataSource);
    if (inlineShipTo) {
      this.shipToDetails = inlineShipTo;
      return;
    }

    const shipToId = this.getShipToIdFromSource(this.dataSource);
    if (shipToId) {
      this.fetchShipToRecord(shipToId);
      return;
    }

    this.generalBillDetailsService
      .getInvoiceBillToShipToConfigId(
        Number(this.invoiceID || this.dataSource.invoiceID),
        this.dataSource.customerName || this.dataSource.billingName
      )
      .subscribe({
        next: (resolvedId) => {
          if (resolvedId) {
            this.fetchShipToRecord(resolvedId);
          }
        },
        error: () => {
          this.shipToDetails = null;
        },
      });
  }

  private getShipToIdFromSource(source: any): number {
    return Number(
      source?.customerConfigurationBillToShipToID ||
      source?.CustomerConfigurationBillToShipToID ||
      0
    );
  }

  private fetchShipToRecord(shipToId: number): void {
    this.customerBillToShipToService.getById(shipToId).subscribe({
      next: (data) => {
        this.shipToDetails = data ? new CustomerBillToShipTo(data) : null;
      },
      error: () => {
        this.loadShipToDetailsByCustomer(shipToId);
      },
    });
  }

  private loadShipToDetailsByCustomer(shipToId: number): void {
    const customerID = Number(this.dataSource?.customerID || 0);
    if (!customerID) {
      this.shipToDetails = null;
      return;
    }

    this.customerBillToShipToService.getTableData(0, customerID, null, 0).subscribe({
      next: (data) => {
        const record = this.pickShipToRecord(data, shipToId);
        this.shipToDetails = record ? new CustomerBillToShipTo(record) : null;
      },
      error: () => {
        this.shipToDetails = null;
      },
    });
  }

  private pickShipToRecord(
    data: any,
    shipToId: number,
    allowSingleResult = false
  ): any {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      const recordId = Number(
        data.customerConfigurationBillToShipToID ||
        data.CustomerConfigurationBillToShipToID ||
        0
      );
      return recordId === shipToId ? data : null;
    }

    const match = data.find(
      (item) =>
        Number(
          item?.customerConfigurationBillToShipToID ||
          item?.CustomerConfigurationBillToShipToID
        ) === shipToId
    );
    if (match) {
      return match;
    }

    return allowSingleResult && data.length === 1 ? data[0] : null;
  }

  private extractInlineShipToDetails(source: any): CustomerBillToShipTo | null {
    const nested =
      source.customerConfigurationBillToShipTo ||
      source.billToShipTo ||
      source.shipTo;

    if (nested?.shipToCompany || nested?.ShipToCompany) {
      return new CustomerBillToShipTo(nested);
    }

    if (source.shipToCompany || source.ShipToCompany) {
      return new CustomerBillToShipTo({
        shipToCompany: source.shipToCompany || source.ShipToCompany,
        address1: source.shipToAddress1 || source.address1,
        address2: source.shipToAddress2 || source.address2,
        cityName: source.shipToCityName || source.cityName,
        stateName: source.shipToStateName || source.stateName,
        countryName: source.shipToCountryName || source.countryName,
        pincode: source.shipToPincode || source.pincode,
        gstno: source.shipToGstno || source.shipToGSTNO || source.gstno || source.gSTNO,
      });
    }

    return null;
  }

}



