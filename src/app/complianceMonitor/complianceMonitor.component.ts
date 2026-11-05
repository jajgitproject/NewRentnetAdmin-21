// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from '../general/general.service';
import { FormDialogComponent as DriverDocumentFormDialogComponent } from '../driverDocument/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as InventoryDocumentFormDialogComponent } from '../inventoryDocument/dialogs/form-dialog/form-dialog.component';
import { DocumentDropDown } from '../general/documentDropDown.model';
import { OrganizationalEntityDropDown } from '../general/organizationalEntityDropDown.model';
import { ComplianceMonitorService } from './complianceMonitor.service';
import {
  ComplianceMonitorMetrics,
  ComplianceMonitorRow,
  ComplianceMonitorLocationOption,
} from './complianceMonitor.model';

@Component({
  standalone: false,
  selector: 'app-compliance-monitor',
  templateUrl: './complianceMonitor.component.html',
  styleUrls: ['./complianceMonitor.component.sass'],
})
export class ComplianceMonitorComponent implements OnInit {
  displayedColumns = [
    'resourceType',
    'resourceIdentifier',
    'documentName',
    'validUpto',
    'expiryStatus',
    'deploymentEffect',
    'owner',
    'actions',
  ];

  rows: ComplianceMonitorRow[] = [];
  metrics: ComplianceMonitorMetrics = new ComplianceMonitorMetrics();
  documentList: DocumentDropDown[] = [];
  branchList: OrganizationalEntityDropDown[] = [];
  locationList: ComplianceMonitorLocationOption[] = [];

  searchText = '';
  resourceType = '';
  searchDocumentID: number | null = null;
  urgency = '';
  metricFilter = '';
  branchID: number | null = null;
  locationID: number | null = null;
  pageNumber = 0;

  constructor(
    private complianceMonitorService: ComplianceMonitorService,
    private generalService: GeneralService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initDocuments();
    this.initBranches();
    this.loadLocations();
    this.loadData();
  }

  initDocuments(): void {
    this.generalService.getDocumentRequired().subscribe((data) => {
      this.documentList = data || [];
    });
  }

  initBranches(): void {
    this.generalService.GetOrganizationalBranch().subscribe((data) => {
      this.branchList = data || [];
    });
  }

  onBranchChange(): void {
    this.locationID = null;
    this.loadLocations();
  }

  loadLocations(): void {
    this.complianceMonitorService.getLocationsByBranch(this.branchID || 0).subscribe(
      (data) => {
        this.locationList = data || [];
      },
      () => {
        this.locationList = [];
      }
    );
  }

  loadData(): void {
    this.complianceMonitorService
      .getData(
        this.searchText,
        this.resourceType,
        this.searchDocumentID != null ? String(this.searchDocumentID) : '',
        this.urgency,
        this.metricFilter,
        this.branchID,
        this.locationID,
        this.pageNumber
      )
      .subscribe(
        (response) => {
          this.metrics = response.metrics;
          this.rows = response.rows || [];
        },
        () => {
          this.rows = [];
          this.metrics = new ComplianceMonitorMetrics();
          this.notify('Unable to load compliance monitor data.', 'snackbar-danger');
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
    this.urgency = '';
    this.metricFilter = '';
    this.branchID = null;
    this.locationID = null;
    this.pageNumber = 0;
    this.loadLocations();
    this.loadData();
  }

  filterByMetric(filter: string): void {
    this.metricFilter = filter;
    this.urgency = '';
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

  renew(row: ComplianceMonitorRow): void {
    const preselectedDocumentID = row.documentID;
    const preselectedDocumentName = row.documentName;

    if (row.resourceType === 'Driver') {
      const dialogRef = this.dialog.open(DriverDocumentFormDialogComponent, {
        data: {
          action: 'add',
          driverID: row.resourceID,
          driverName: row.resourceIdentifier,
          preselectedDocumentID,
          preselectedDocumentName,
        },
      });
      dialogRef.afterClosed().subscribe(() => this.loadData());
      return;
    }

    const dialogRef = this.dialog.open(InventoryDocumentFormDialogComponent, {
      data: {
        action: 'add',
        inventoryID: row.resourceID,
        inventoryName: row.resourceIdentifier,
        preselectedDocumentID,
        preselectedDocumentName,
      },
    });
    dialogRef.afterClosed().subscribe(() => this.loadData());
  }

  statusClass(classKey: string): string {
    return classKey ? `status-${classKey}` : '';
  }

  notify(message: string, panelClass: string): void {
    this.snackBar.open(message, '', { duration: 2500, panelClass, verticalPosition: 'bottom', horizontalPosition: 'center' });
  }
}
