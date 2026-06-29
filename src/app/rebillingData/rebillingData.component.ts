// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../general/general.service';
import { RebillingDataService } from './rebillingData.service';
import { ReBilledInvoiceDetailsModel, ReBilledInvoiceModel } from './rebillingData.model';

@Component({
  standalone: false,
  selector: 'app-rebilling-data',
  templateUrl: './rebillingData.component.html',
  styleUrls: ['./rebillingData.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class RebillingDataComponent implements OnInit {
  displayedColumns = [
    'ReservationID',
    'AllotmentID',
    'DutySlipID',
    'DutySlipForBIllingID',
    'InvoiceCalculationID',
    'actions'
  ];

  masterData: ReBilledInvoiceModel | null = null;
  detailsData: ReBilledInvoiceDetailsModel[] = [];
  invoiceCreditNoteID: number;
  creditNoteNumber: string;
  expandedDetailId: number | null = null;
  parsedDetailJson: { [key: number]: ParsedDetailField[] } = {};

  constructor(
    public rebillingDataService: RebillingDataService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      this.invoiceCreditNoteID = paramsData.invoiceCreditNoteID;
      this.creditNoteNumber = paramsData.creditNoteNumber;
    });
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  loadData() {
    this.rebillingDataService.getRebillingData(this.invoiceCreditNoteID).subscribe(
      data => {
        this.masterData = data?.master || null;
        this.detailsData = data?.details || [];
        this.parsedDetailJson = {};
        this.detailsData.forEach(detail => {
          this.parsedDetailJson[detail.reBilledInvoiceDetailsID] = this.parseDetailJson(detail.detailJson);
        });
      },
      (error: HttpErrorResponse) => {
        this.masterData = null;
        this.detailsData = [];
      }
    );
  }

  parseDetailJson(jsonString: string): ParsedDetailField[] {
    if (!jsonString) {
      return [];
    }
    try {
      const parsed = JSON.parse(jsonString);
      const records = Array.isArray(parsed) ? parsed : [parsed];
      if (records.length === 0) {
        return [];
      }
      return Object.keys(records[0]).map(key => {
        const value = records[0][key];
        if (this.isCustomerSpecificFieldsKey(key)) {
          return {
            key,
            value,
            isCustomerSpecificFields: true,
            customerSpecificFields: this.parseCustomerSpecificFields(value)
          };
        }
        return { key, value };
      });
    } catch {
      return [{ key: 'Raw Data', value: jsonString }];
    }
  }

  isCustomerSpecificFieldsKey(key: string): boolean {
    return (key || '').toLowerCase() === 'customerspecificfields';
  }

  parseCustomerSpecificFields(value: string | null | undefined): { fieldName: string; fieldValue: string }[] {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return [];
    }

    const parseCandidates = [
      trimmed,
      `[${trimmed}]`,
      trimmed.startsWith('[') ? trimmed : `[${trimmed.replace(/^\s*,\s*/, '')}]`
    ];

    for (const candidate of parseCandidates) {
      try {
        const parsed = JSON.parse(candidate);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const mapped = list
          .map(item => this.extractCustomerSpecificFieldPair(item))
          .filter(item => item.fieldName || item.fieldValue);

        if (mapped.length) {
          return mapped;
        }
      } catch {
        // try next parse strategy
      }
    }

    const results: { fieldName: string; fieldValue: string }[] = [];
    const fieldPattern = /"(?:FieldName|fieldName)"\s*:\s*"([^"]*)"[\s\S]*?"(?:FieldValue|fieldValue)"\s*:\s*"([^"]*)"/g;
    let match;

    while ((match = fieldPattern.exec(trimmed)) !== null) {
      results.push({ fieldName: match[1], fieldValue: match[2] });
    }

    return results;
  }

  private extractCustomerSpecificFieldPair(item: any): { fieldName: string; fieldValue: string } {
    return {
      fieldName: item?.FieldName ?? item?.fieldName ?? '',
      fieldValue: item?.FieldValue ?? item?.fieldValue ?? ''
    };
  }

  toggleDetailJson(detailId: number) {
    this.expandedDetailId = this.expandedDetailId === detailId ? null : detailId;
  }

  isDetailExpanded(detailId: number): boolean {
    return this.expandedDetailId === detailId;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}

interface ParsedDetailField {
  key: string;
  value: any;
  isCustomerSpecificFields?: boolean;
  customerSpecificFields?: { fieldName: string; fieldValue: string }[];
}
