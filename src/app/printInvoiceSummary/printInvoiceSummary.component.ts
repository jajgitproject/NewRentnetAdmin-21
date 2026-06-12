// @ts-nocheck

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { PrintInvoiceSummaryService } from './printInvoiceSummary.service';

import { PrintInvoiceSummary } from './printInvoiceSummary.model';

import { MAT_DATE_LOCALE } from '@angular/material/core';



@Component({

  standalone: false,

  selector: 'app-printInvoiceSummary',

  templateUrl: './printInvoiceSummary.component.html',

  styleUrls: ['./printInvoiceSummary.component.scss'],

  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]

})

export class PrintInvoiceSummaryComponent implements OnInit {

  summaryID: number = 0;

  data: PrintInvoiceSummary | null = null;

  isLoading = false;

  loadError = '';

  @ViewChild('printSection', { static: false }) printSection: ElementRef;

  constructor(

    public route: ActivatedRoute,

    public printService: PrintInvoiceSummaryService

  ) {}



  ngOnInit() {

    this.route.queryParams.subscribe((params) => {

      this.summaryID = Number(params.SummaryID || params.summaryID || 0);

      if (this.summaryID) {

        this.loadData();

      } else {

        this.loadError = 'Summary ID is required.';

      }

    });

  }



  loadData() {

    this.isLoading = true;

    this.loadError = '';

    this.printService.getPrintData(this.summaryID).subscribe(

      (response) => {

        this.isLoading = false;

        if (response) {

          this.data = new PrintInvoiceSummary(response);

        } else {

          this.loadError = 'No data found for this summary.';

        }

      },

      () => {

        this.isLoading = false;

        this.loadError = 'Failed to load invoice summary print data.';

      }

    );

  }



  formatDate(value: any): string {

    if (!value) {

      return '';

    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {

      return '';

    }

    return date.toLocaleDateString('en-GB');

  }



  formatAmount(value: number): string {

    if (value === null || value === undefined) {

      return '0.00';

    }

    return Number(value).toLocaleString('en-IN', {

      minimumFractionDigits: 2,

      maximumFractionDigits: 2

    });

  }



  print() {
    const printElement =
      this.printSection?.nativeElement || document.getElementById('printSection');
    const printContent = printElement?.innerHTML;
    if (!printContent) {
      return;
    }

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = this.getPrintHtml(printContent);

    let restored = false;
    const restorePage = () => {
      if (restored) {
        return;
      }
      restored = true;
      window.onafterprint = null;
      document.body.innerHTML = originalContents;
      window.location.reload();
    };

    window.onafterprint = restorePage;
    window.print();
    setTimeout(restorePage, 2000);
  }

  private getPrintHtml(content: string): string {
    return `
      <style>
        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
          margin: 20px;
          font-size: 14px;
          line-height: 1.6;
        }
        .cover-letter { max-width: 900px; margin: 0 auto; }
        .letter-date { margin-bottom: 24px; }
        .address-block p, .body-text, .subject-line, .closing-block p { margin: 0 0 8px; }
        .subject-line { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
        .body-text { margin-bottom: 16px; text-align: justify; }
        .invoice-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .invoice-table th, .invoice-table td { border: 1px solid #000; padding: 8px 10px; vertical-align: top; }
        .invoice-table th { font-weight: 600; text-align: left; }
        .amount-col { text-align: right; white-space: nowrap; }
        .total-row .total-label { text-align: right; font-weight: 600; }
        .closing-block { margin-top: 32px; }
        .signatory { margin-top: 48px; }
      </style>
      <div class="cover-letter">${content}</div>
    `;
  }

}


