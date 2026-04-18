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
import { InvoiceMultiDuties } from './invoiceMultiDuties.model';
import { InvoiceMultiDutiesService } from './invoiceMultiDuties.service';

@Component({
  standalone: false,
  selector: 'app-InvoiceMultiDuties',
  templateUrl: './invoiceMultiDuties.component.html',
  styleUrls: ['./invoiceMultiDuties.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InvoiceMultiDutiesComponent implements OnInit {
  dataSource: any;
  dataSourceForInvoiceDuties: any[] = [];;
  advanceTable: InvoiceMultiDuties | null;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  reservationID: number;
  vehicleName: any;
  invoiceID: any;
  dataSourceForCalculate: any = {
 
    totalRecivableAfterAdvace: 0,
    totalBasicAmount: 0,
    totalAmountAfterGST: 0,
    totalAmountAfterGSTInWords: ''
  };

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public invoiceMultiDutiesService: InvoiceMultiDutiesService,
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
    this.route.queryParams.subscribe(paramsData =>{
      this.invoiceID   = paramsData.invoiceID;
       console.log(this.invoiceID)
    });
    this.loadData();
   
    
  }

  public loadData() 
  {
     this.invoiceMultiDutiesService.printDutySlipInfo(this.invoiceID).subscribe
   (
     data =>   
     {
       this.dataSource = data;
      console.log(this.dataSource);
      this.getInvoiceloadData();
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }
  public getInvoiceloadData() 
  {
     this.invoiceMultiDutiesService.getinvoiceMultiDuties(this.invoiceID).subscribe
   (
     data =>   
     {
       this.dataSourceForInvoiceDuties = data;
      console.log(this.dataSourceForInvoiceDuties);
        this.calculateTotals();
        
     },
     (error: HttpErrorResponse) => { this.dataSourceForInvoiceDuties = null;}
   );
 }
calculateTotals() {
    // 1️⃣ Basic Amount = sum of all rows
    this.dataSourceForCalculate.totalBasicAmount = this.dataSourceForInvoiceDuties
      .map(d => d.totalAmountAfterExpences || 0)
      .reduce((a, b) => a + b, 0);

    // 2️⃣ Add GST
    // this.dataSourceForCalculate.totalRecivableAfterAdvace =
    //   this.dataSourceForCalculate.totalBasicAmount +
    //   (this.dataSource?.invoiceGSTModel?.igstAmount || 0) +
    //   (this.dataSource?.invoiceGSTModel?.sgstAmount || 0) +
    //   (this.dataSource?.invoiceGSTModel?.cgstAmount || 0);
    //   console.log(this.dataSourceForCalculate.totalRecivableAfterAdvace)

    // 3 Convert to words
    this.dataSourceForCalculate.totalAmountAfterGSTInWords =
      this.convertNumberToWords(this.dataSource?.invoiceModel?.invoiceTotalAmountAfterGST);
      
  }

  // ✅ Rupees in Words Converter (supports lakh, crore)
  convertNumberToWords(amount: number): string {
  
    if (!amount) return 'Zero';

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function numToWords(n: number): string {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
      return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
    }

    return numToWords(Math.floor(amount)).trim();
  }

//  print() 
//  {
//   const printContent = this.printSection?.nativeElement.innerHTML;
//   const originalContents = document.body.innerHTML;

//   document.body.innerHTML = printContent;
//   window.print();
//   document.body.innerHTML = originalContents;
//   window.location.reload(); // Reload to reset the original content
// }

print() 
{
  window.print();
}

getHoursAndMinutes(totalMinutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

}



