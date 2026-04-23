// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-DynamicEInvoiceResponseDetails',
  templateUrl: './DynamicEInvoiceResponseDetails.component.html',
  styleUrls: ['./DynamicEInvoiceResponseDetails.component.sass']
})
export class DynamicEInvoiceResponseDetailsComponent implements OnInit {

  dialogTitle: string = 'Response Details';
  DynamicEInvoiceDetails: any;
  formattedPayload: string = '';

  constructor(
    public dialogRef: MatDialogRef<DynamicEInvoiceResponseDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

    this.DynamicEInvoiceDetails = this.data;
    if (this.DynamicEInvoiceDetails?.dynamicsAPIRequestPayLoad) {
      try {
        const parsed = JSON.parse(this.DynamicEInvoiceDetails.dynamicsAPIRequestPayLoad);
        this.formattedPayload = JSON.stringify(parsed, null, 2); // pretty format
      } catch (e) {
        console.error('JSON parse error:', e);
        this.formattedPayload = this.DynamicEInvoiceDetails.dynamicsAPIRequestPayLoad;
      }
    } else {
      console.warn('dynamicsAPIRequestPayLoad is missing or undefined.');
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

