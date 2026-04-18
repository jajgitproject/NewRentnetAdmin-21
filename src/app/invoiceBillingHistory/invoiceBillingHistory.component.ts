// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails, PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { InvoiceBillingHistory } from './invoiceBillingHistory.model';
import { InvoiceBillingHistoryService } from './invoiceBillingHistory.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: false,
  selector: 'app-invoiceBillingHistory',
  templateUrl: './invoiceBillingHistory.component.html',
  styleUrls: ['./invoiceBillingHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InvoiceBillingHistoryComponent {
  invoiceBillingHistory: InvoiceBillingHistory[] = [];
  dialogTitle: string;
  invoiceID: any;
  invoiceNumberWithPrefix: any;



  constructor(
    public dialogRef: MatDialogRef<InvoiceBillingHistoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService,
    public invoiceBillingHistoryService: InvoiceBillingHistoryService
  ) {
    // Set the defaults
    this.dialogTitle = 'Invoice History';
    // this.invoiceBillingHistory = new InvoiceBillingHistory({});
    this.invoiceID = this.data.invoiceID;
    this.invoiceNumberWithPrefix =this.data.invoiceNumberWithPrefix;
   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
ngOnInit() {
    this.loadData();
   

  }
   public loadData() 
    {
       this.invoiceBillingHistoryService.getInvoiceBilling( this.invoiceID).subscribe
       (
         (data: InvoiceBillingHistory[])=>   
         {
           this.invoiceBillingHistory = data;
          // console.log(this.invoiceBillingHistory)
          
         },
         (error: HttpErrorResponse) => { this.invoiceBillingHistory = null;}
       );
   }
}


