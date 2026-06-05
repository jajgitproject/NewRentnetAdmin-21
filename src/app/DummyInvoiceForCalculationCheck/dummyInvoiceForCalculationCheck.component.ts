// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DummyInvoiceForCalculationCheckService } from './dummyInvoiceForCalculationCheck.service';

@Component({
  standalone: false,
  selector: 'app-dummyInvoiceForCalculationCheck',
  templateUrl: './dummyInvoiceForCalculationCheck.component.html',
  styleUrls: ['./dummyInvoiceForCalculationCheck.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DummyInvoiceForCalculationCheckComponent implements OnInit {
  dataSource: any;
  search: FormControl = new FormControl();
  dutySlipID: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public dummyInvoiceForCalculationCheckService: DummyInvoiceForCalculationCheckService,
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
    this.route.queryParams.subscribe(paramsData => {
      const dutySlipId = +(paramsData.dutySlipID ?? paramsData.DutySlipID);
      if (!dutySlipId) {
        this.dataSource = null;
        this.snackBar.open('DutySlipID is missing from the URL.', 'Close', { duration: 5000 });
        return;
      }
      this.dutySlipID = dutySlipId;
      this.loadData();
    });
  }

  public loadData() {
    if (!this.dutySlipID) {
      return;
    }

    this.dummyInvoiceForCalculationCheckService.getDummyInvoice(this.dutySlipID).subscribe(
      data => {
        if (!data || (typeof data === 'object' && !data.dutySlipID && !data.DutySlipID)) {
          this.dataSource = null;
          this.snackBar.open(
            'No calculation data found. Please run Calculate Bill on the closing page first.',
            'Close',
            { duration: 7000 }
          );
          return;
        }
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => {
        this.dataSource = null;
        const message =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : null) ||
          'Unable to load dummy invoice.';
        this.snackBar.open(message, 'Close', { duration: 7000 });
      }
    );
  }

  print() {
    const printContent = this.printSection?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  getHoursAndMinutes(totalMinutes: number): { hours: number; minutes: number } {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }
}
