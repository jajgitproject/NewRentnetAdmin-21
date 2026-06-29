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
  parsedDetailJson: { [key: number]: { key: string; value: any }[] } = {};

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

  parseDetailJson(jsonString: string): { key: string; value: any }[] {
    if (!jsonString) {
      return [];
    }
    try {
      const parsed = JSON.parse(jsonString);
      const records = Array.isArray(parsed) ? parsed : [parsed];
      if (records.length === 0) {
        return [];
      }
      return Object.keys(records[0]).map(key => ({
        key,
        value: records[0][key]
      }));
    } catch {
      return [{ key: 'Raw Data', value: jsonString }];
    }
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
