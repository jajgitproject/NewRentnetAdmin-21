// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { DocumentDropDown } from '../general/documentDropDown.model';
import { DriverDocumentService } from '../driverDocument/driverDocument.service';
import { InventoryDocumentService } from '../inventoryDocument/inventoryDocument.service';
import { FormDialogDriverVerificationsComponent } from '../driverDocument/dialogs/verification/verification.component';
import { FormDialogInventoryVerificationsComponent } from '../inventoryDocument/dialogs/verification/verification.component';
import { ComplianceApprovalCenterService } from './complianceApprovalCenter.service';
import {
  ComplianceApprovalCenterMetrics,
  ComplianceApprovalCenterRow,
} from './complianceApprovalCenter.model';

@Component({
  standalone: false,
  selector: 'app-compliance-approval-center',
  templateUrl: './complianceApprovalCenter.component.html',
  styleUrls: ['./complianceApprovalCenter.component.sass'],
})
export class ComplianceApprovalCenterComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'resourceContext',
    'resourceType',
    'resourceStatus',
    'documentName',
    'verificationStatus',
    'aging',
    'documentNumber',
    'documentStartDate',
    'documentValidUpto',
    'uploadedByEmployee',
    'actions',
  ];

  rows: ComplianceApprovalCenterRow[] = [];
  metrics: ComplianceApprovalCenterMetrics = new ComplianceApprovalCenterMetrics();
  documentList: DocumentDropDown[] = [];

  searchText = '';
  resourceType = '';
  searchDocumentID: number | null = null;
  verificationStatus = '';
  documentNumber = '';
  metricFilter = '';
  pageNumber = 0;

  private updateSubscription: Subscription;

  constructor(
    private complianceApprovalCenterService: ComplianceApprovalCenterService,
    private driverDocumentService: DriverDocumentService,
    private inventoryDocumentService: InventoryDocumentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.initDocuments();
    this.loadData();
    this.updateSubscription = this.generalService.getUpdate().subscribe((message) => {
      const text = message?.text || '';
      if (text.includes('DocumentVerification') || text.includes('DriverDocumentVerification')) {
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  initDocuments(): void {
    this.generalService.getDocumentRequired().subscribe((data) => {
      this.documentList = data || [];
    });
  }

  loadData(): void {
    this.complianceApprovalCenterService
      .getData(
        this.searchText,
        this.resourceType,
        this.searchDocumentID != null ? String(this.searchDocumentID) : '',
        this.verificationStatus,
        this.documentNumber,
        this.metricFilter,
        this.pageNumber,
        'DocumentRecordID',
        'Ascending'
      )
      .subscribe(
        (response) => {
          this.metrics = response.metrics;
          this.rows = response.rows || [];
        },
        () => {
          this.rows = [];
          this.metrics = new ComplianceApprovalCenterMetrics();
          this.showNotification('snackbar-danger', 'Unable to load approval queue.', 'bottom', 'center');
        }
      );
  }

  applySearch(): void {
    this.pageNumber = 0;
    this.metricFilter = '';
    this.loadData();
  }

  refresh(): void {
    this.searchText = '';
    this.resourceType = '';
    this.searchDocumentID = null;
    this.verificationStatus = '';
    this.documentNumber = '';
    this.metricFilter = '';
    this.pageNumber = 0;
    this.loadData();
  }

  filterByMetric(filter: string): void {
    this.metricFilter = filter;
    this.verificationStatus = '';
    this.pageNumber = 0;
    this.loadData();
  }

  previousPage(): void {
    if (this.pageNumber > 0) {
      this.pageNumber -= 1;
      this.loadData();
    }
  }

  nextPage(): void {
    this.pageNumber += 1;
    this.loadData();
  }

  review(row: ComplianceApprovalCenterRow): void {
    if (row.resourceType === 'Driver') {
      this.driverDocumentService.getById(row.documentRecordID).subscribe(
        (document) => {
          const dialogRef = this.dialog.open(FormDialogDriverVerificationsComponent, {
            data: {
              advanceTable: document,
              driverID: row.resourceID,
              driverName: row.resourceName,
            },
          });
          dialogRef.afterClosed().subscribe(() => this.loadData());
        },
        () => this.showNotification('snackbar-danger', 'Unable to open driver verification.', 'bottom', 'center')
      );
      return;
    }

    this.inventoryDocumentService.getById(row.documentRecordID).subscribe(
      (document) => {
        const dialogRef = this.dialog.open(FormDialogInventoryVerificationsComponent, {
          data: {
            advanceTable: document,
            inventoryID: row.resourceID,
            inventoryName: row.registrationNumber || row.resourceName,
          },
        });
        dialogRef.afterClosed().subscribe(() => this.loadData());
      },
      () => this.showNotification('snackbar-danger', 'Unable to open inventory verification.', 'bottom', 'center')
    );
  }

  agingClass(aging: string): string {
    if (!aging) {
      return '';
    }
    const match = /^(\d+)d/.exec(aging.trim());
    if (match && Number(match[1]) >= 1) {
      return 'aging-warn';
    }
    const hoursMatch = /^(\d+)h/.exec(aging.trim());
    if (hoursMatch && Number(hoursMatch[1]) >= 24) {
      return 'aging-warn';
    }
    return '';
  }

  statusClass(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'verified') {
      return 'status-verified';
    }
    if (normalized === 'rejected') {
      return 'status-rejected';
    }
    return 'status-pending';
  }

  showNotification(colorName: string, text: string, placementFrom: string, placementAlign: string): void {
    this.snackBar.open(text, '', {
      duration: 2500,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
