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
    console.log('Dialog Data:', this.data);

    this.DynamicEInvoiceDetails = this.data;
    console.log('DynamicEInvoiceDetails:', this.DynamicEInvoiceDetails);
    if (this.DynamicEInvoiceDetails?.dynamicsAPIRequestPayLoad) {
      console.log('Raw dynamicsAPIRequestPayLoad:', this.DynamicEInvoiceDetails.dynamicsAPIRequestPayLoad);
      try {
        const parsed = JSON.parse(this.DynamicEInvoiceDetails.dynamicsAPIRequestPayLoad);
        console.log('Parsed dynamicsAPIRequestPayLoad:', parsed);
        this.formattedPayload = JSON.stringify(parsed, null, 2); // pretty format
      } catch (e) {
        console.error('JSON parse error:', e);
        this.formattedPayload = this.DynamicEInvoiceDetails.dynamicsAPIRequestPayLoad;
      }
    } else {
      console.warn('dynamicsAPIRequestPayLoad is missing or undefined.');
    }

    console.log('Formatted Payload:', this.formattedPayload);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

