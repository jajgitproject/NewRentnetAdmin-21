// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-DynamicEInvoiceDetails',
  templateUrl: './DynamicEInvoiceDetails.component.html',
  styleUrls: ['./DynamicEInvoiceDetails.component.sass']
})
export class DynamicEInvoiceDetailsComponent implements OnInit {

  dialogTitle: string = 'Dynamic E-Invoice Payload Details';
  DynamicEInvoiceDetails: any;
  formattedPayload: string = '';

  constructor(
    public dialogRef: MatDialogRef<DynamicEInvoiceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
     

    this.DynamicEInvoiceDetails = this.data;

    // ✅ Parse JSON payload properly
    if (this.DynamicEInvoiceDetails?.dynamicsAPIRequestPayLoad) {
      try {
        const parsed = JSON.parse(this.DynamicEInvoiceDetails.dynamicsAPIRequestPayLoad);
        this.formattedPayload = JSON.stringify(parsed, null, 2); // pretty format
      } catch (e) {
        console.error('JSON parse error', e);
        this.formattedPayload = this.DynamicEInvoiceDetails.dynamicsAPIRequestPayLoad;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

