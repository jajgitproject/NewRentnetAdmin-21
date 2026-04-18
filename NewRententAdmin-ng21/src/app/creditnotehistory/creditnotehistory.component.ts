// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { CreditNoteHistory } from './creditnotehistory.model';
import { CreditNoteHistoryService } from './creditnotehistory.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  standalone: false,
  selector: 'app-creditnotehistory',
  templateUrl: './creditnotehistory.component.html',
  styleUrls: ['./creditnotehistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNoteHistoryComponent implements OnInit {
  dialogTitle: string;
  dataSource: MatTableDataSource<CreditNoteHistory>;
  creditNoteID: number;
  creditNoteHistoryDataSource: any;
  noDataFound: boolean = false;
  selectedLifeCycleStatus: string = 'all';
  lifeCycleStatuses: string[] = [];
   PageNumber: number = 0;
  @Input() invoiceID: number;
  invoiceNumberWithPrefix: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
    InvoiceCreditNoteHistoryID: string;
  
  constructor(
    public dialogRef: MatDialogRef<CreditNoteHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public creditNoteHistoryService: CreditNoteHistoryService,
    private dialog: MatDialog
  ) {
    this.dialogTitle = 'Credit Note History';
    console.log(this.invoiceID);
    this.invoiceID = data?.invoiceID || data?.invoiceID || 0;
    this.invoiceNumberWithPrefix = data?.invoiceNumberWithPrefix || '';
    this.creditNoteID = data?.creditNoteID || data?.invoiceID || 0;
    this.selectedLifeCycleStatus = data?.preSelectedStatus || 'all';
    this.dataSource = new MatTableDataSource<CreditNoteHistory>([]);
    
    // Validate input data
    if (!this.invoiceID || this.invoiceID <= 0) {
      console.warn('No valid invoice ID provided to CreditNoteHistoryComponent');
    }
  }

  ngOnInit() {
    this.getCreditNoteHistoryData();
    //this.loadCreditNoteHistoryData();
    
    // Set dialog title based on pre-selected status
    // if (this.selectedLifeCycleStatus !== 'all') {
    //   this.dialogTitle = `Credit Note History - ${this.selectedLifeCycleStatus.replace('_', ' ')}`;
    // }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getCreditNoteHistoryData() {
    if (!this.invoiceID || this.invoiceID <= 0) {
      console.error('Invalid invoice ID:', this.invoiceID);
      this.creditNoteHistoryDataSource = [];
      this.noDataFound = true;
      return;
    }

    this.creditNoteHistoryService.getCreditNoteHistory(this.invoiceID).subscribe(
      (data: CreditNoteHistory[]) => {
        this.creditNoteHistoryDataSource = data || [];
        this.dataSource.data = this.creditNoteHistoryDataSource;
        this.noDataFound = this.creditNoteHistoryDataSource.length === 0;
        console.log('Credit Note History Data:', this.creditNoteHistoryDataSource);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching credit note history:', error);
        this.creditNoteHistoryDataSource = [];
        this.dataSource.data = [];
        this.noDataFound = true;
        
        // Show user-friendly error message
        if (error.status === 500) {
          console.error('Server error - please check the backend API');
        } else if (error.status === 404) {
          console.error('Credit note history not found for invoice ID:', this.invoiceID);
        }
      }
    );
  }

  onLifeCycleStatusChange(): void {
    if (this.selectedLifeCycleStatus === 'all') {
      this.getCreditNoteHistoryData();
    } else {
      this.creditNoteHistoryService.getCreditNoteHistoryByLifeCycleStatus(
        this.invoiceID, 
        this.selectedLifeCycleStatus
      ).subscribe(
        (data: CreditNoteHistory[]) => {
          this.creditNoteHistoryDataSource = data || [];
          this.dataSource.data = this.creditNoteHistoryDataSource;
          this.noDataFound = this.creditNoteHistoryDataSource.length === 0;
        },
        (error: HttpErrorResponse) => {
          console.error('Error filtering credit note history:', error);
          this.creditNoteHistoryDataSource = [];
          this.dataSource.data = [];
          this.noDataFound = true;
        }
      );
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'badge-success';
      case 'REJECTED':
        return 'badge-danger';
      case 'PENDING_APPROVAL':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }
}


