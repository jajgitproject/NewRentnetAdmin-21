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

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public generalBillDetailsService: GeneralBillDetailsService,
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
     this.generalBillDetailsService.printGeneralBillInfo(this.invoiceID).subscribe
   (
     data =>   
     {
       this.dataSource = data;       
       this.dataSourceForCalculate.invoiceTotalAmountAfterGSTInWords = this.convertNumberToWords(this.dataSource.invoiceTotalAmountAfterGST);
      console.log(this.dataSource);
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }
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
 print() {
  const printContent = this.printSection?.nativeElement.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Reload to reset the original content
}

}



