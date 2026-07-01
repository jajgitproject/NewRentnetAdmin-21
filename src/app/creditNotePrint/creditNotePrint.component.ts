// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreditNotePrintService } from './creditNotePrint.service';

@Component({
  standalone: false,
  selector: 'app-creditNotePrint',
  templateUrl: './creditNotePrint.component.html',
  styleUrls: ['./creditNotePrint.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNotePrintComponent implements OnInit {
  dataSource: any;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  InvoiceID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public creditNotePrintService: CreditNotePrintService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('printDutyBill', { static: false }) printDutyBill: ElementRef;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      this.InvoiceID   = paramsData.invoiceID;
    });
    this.loadData();
  }

  public loadData() 
  {
     this.creditNotePrintService.CreditNoteInfo(this.InvoiceID).subscribe
   (
     data =>   
     {
       this.dataSource = data;
       console.log(this.dataSource);
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }

//  print() {
//   const printContent = this.printDutyBill?.nativeElement.innerHTML;
//   const originalContents = document.body.innerHTML;

//   document.body.innerHTML = printContent;
//   window.print();
//   document.body.innerHTML = originalContents;
//   window.location.reload(); // Reload to reset the original content
// }
 print(){

    window.print();

}
}



