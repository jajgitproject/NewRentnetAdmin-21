// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

import { GeneralService } from '../../general/general.service';
import { OrganizationalEntityDropDown } from '../../organizationalEntity/organizationalEntityDropDown.model';
import {
  FuelEntryDetailDto,
  FuelEntryLookupDto,
  FuelEntryStatusHistoryItem,
  FuelEntryVerificationActionRequest,
  FuelEntryVerificationRow,
  FuelEntryVerificationSearchCriteria,
  FuelLookupItem,
} from '../fuelEntry.model';
import { FuelEntryService } from '../fuelEntry.service';

type ActionMode = 'verify' | 'hold' | 'reject' | null;

@Component({
  standalone: false,
  selector: 'app-fuel-entry-verification',
  templateUrl: './fuelEntryVerification.component.html',
  styleUrls: ['./fuelEntryVerification.component.sass'],
})
export class FuelEntryVerificationComponent implements OnInit, OnDestroy {
  lookups: FuelEntryLookupDto = {};
  locations: OrganizationalEntityDropDown[] = [];

  fromDate = '';
  toDate = '';
  locationID: number | null = null;
  statusCode = 'PendingVerification';
  registrationNumber = '';
  driverName = '';
  entrySourceID: number | null = null;

  rows: FuelEntryVerificationRow[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 50;
  isSearching = false;
  isActing = false;

  selection = new SelectionModel<FuelEntryVerificationRow>(true, []);

  displayedColumns = [
    'select',
    'fuelEntryNumber',
    'fuelDate',
    'fuelSlipNo',
    'registrationNumber',
    'driverName',
    'entrySourceName',
    'locationName',
    'fuelQuantity',
    'amount',
    'statusName',
    'documents',
    'actions',
  ];

  actionMode: ActionMode = null;
  actionReason = '';
  actionRemarks = '';

  showViewModal = false;
  viewDetail: FuelEntryDetailDto | null = null;
  viewHistory: FuelEntryStatusHistoryItem[] = [];
  isLoadingView = false;

  showImageModal = false;
  imageModalTitle = '';
  imagePreviewUrl: string | null = null;
  imageDownloadUrl: string | null = null;

  private imageObjectUrls: string[] = [];

  constructor(
    private fuelEntryService: FuelEntryService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadLocations();
    this.search();
  }

  ngOnDestroy(): void {
    this.revokeImageUrls();
  }

  get performedBy(): number {
    return this.generalService.getUserID();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  get selectedIds(): number[] {
    return this.selection.selected.map((row) => this.rowId(row)).filter((id) => id > 0);
  }

  search(): void {
    this.pageNumber = 1;
    this.loadRows();
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.locationID = null;
    this.statusCode = 'PendingVerification';
    this.registrationNumber = '';
    this.driverName = '';
    this.entrySourceID = null;
    this.pageNumber = 1;
    this.loadRows();
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadRows();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadRows();
    }
  }

  isAllSelected(): boolean {
    return this.rows.length > 0 && this.selection.selected.length === this.rows.length;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.rows);
    }
  }

  openAction(mode: ActionMode): void {
    if (!this.selectedIds.length) {
      this.snackBar.open('Select at least one fuel entry.', '', { duration: 3000 });
      return;
    }
    this.actionMode = mode;
    this.actionReason = '';
    this.actionRemarks = '';
  }

  closeAction(): void {
    this.actionMode = null;
    this.actionReason = '';
    this.actionRemarks = '';
  }

  confirmAction(): void {
    if (!this.performedBy || !this.actionMode) return;

    const request: FuelEntryVerificationActionRequest = {
      fuelEntryIDs: this.selectedIds,
      reason: (this.actionReason || '').trim() || undefined,
      remarks: (this.actionRemarks || '').trim() || undefined,
    };

    let call$;
    if (this.actionMode === 'verify') {
      call$ = this.fuelEntryService.verifyEntries(this.performedBy, request);
    } else if (this.actionMode === 'hold') {
      if (!request.reason) {
        this.snackBar.open('Hold reason is required.', '', { duration: 3000 });
        return;
      }
      call$ = this.fuelEntryService.holdEntries(this.performedBy, request);
    } else {
      if (!request.reason) {
        this.snackBar.open('Rejection reason is required.', '', { duration: 3000 });
        return;
      }
      call$ = this.fuelEntryService.rejectEntries(this.performedBy, request);
    }

    this.isActing = true;
    call$
      .pipe(finalize(() => (this.isActing = false)))
      .subscribe({
        next: (result) => {
          const succeeded = result?.succeeded ?? result?.Succeeded ?? 0;
          const failed = result?.failed ?? result?.Failed ?? 0;
          const messages = result?.messages ?? result?.Messages ?? [];
          const msg = `Updated ${succeeded} entr${succeeded === 1 ? 'y' : 'ies'}` + (failed ? `, ${failed} failed.` : '.');
          this.snackBar.open(msg, '', { duration: 5000 });
          if (messages?.length) {
            console.warn('Fuel verification messages', messages);
          }
          this.closeAction();
          this.selection.clear();
          this.loadRows();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Action failed.', '', { duration: 6000 });
        },
      });
  }

  openView(row: FuelEntryVerificationRow): void {
    const id = this.rowId(row);
    if (!id) return;

    this.showViewModal = true;
    this.isLoadingView = true;
    this.viewDetail = null;
    this.viewHistory = [];

    this.fuelEntryService.getById(id).subscribe({
      next: (detail) => {
        this.viewDetail = detail;
        this.isLoadingView = false;
      },
      error: () => {
        this.isLoadingView = false;
        this.snackBar.open('Failed to load entry detail.', '', { duration: 4000 });
      },
    });

    this.fuelEntryService.getStatusHistory(id).subscribe({
      next: (history) => {
        this.viewHistory = history || [];
      },
      error: () => {
        this.viewHistory = [];
      },
    });
  }

  closeView(): void {
    this.showViewModal = false;
    this.viewDetail = null;
    this.viewHistory = [];
  }

  openImage(row: FuelEntryVerificationRow, type: 'FuelSlip' | 'Odometer'): void {
    const fuelEntryId = this.rowId(row);
    const documentId =
      type === 'FuelSlip'
        ? row.fuelSlipDocumentID ?? row.FuelSlipDocumentID
        : row.odometerDocumentID ?? row.OdometerDocumentID;
    if (!fuelEntryId || !documentId) return;

    this.imageModalTitle = type === 'FuelSlip' ? 'Fuel Slip' : 'Odometer Photo';
    this.imageDownloadUrl = this.fuelEntryService.getDocumentFileUrl(fuelEntryId, documentId);
    this.showImageModal = true;
    this.imagePreviewUrl = null;

    const contentType =
      type === 'FuelSlip'
        ? row.fuelSlipContentType ?? row.FuelSlipContentType
        : row.odometerContentType ?? row.OdometerContentType;
    const isImage = (contentType || '').toLowerCase().startsWith('image/');

    if (isImage) {
      this.fuelEntryService.downloadDocument(fuelEntryId, documentId).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.imageObjectUrls.push(url);
          this.imagePreviewUrl = url;
        },
      });
    }
  }

  closeImage(): void {
    this.showImageModal = false;
    this.imageModalTitle = '';
    this.imagePreviewUrl = null;
    this.imageDownloadUrl = null;
  }

  hasFuelSlip(row: FuelEntryVerificationRow): boolean {
    return !!(row.fuelSlipDocumentID ?? row.FuelSlipDocumentID);
  }

  hasOdometer(row: FuelEntryVerificationRow): boolean {
    return !!(row.odometerDocumentID ?? row.OdometerDocumentID);
  }

  isImageContentType(contentType: string | undefined): boolean {
    return (contentType || '').toLowerCase().startsWith('image/');
  }

  statusClass(code: string): string {
    switch (code) {
      case 'Verified':
        return 'status-verified';
      case 'PendingVerification':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      case 'Hold':
        return 'status-hold';
      default:
        return 'status-draft';
    }
  }

  rowId(row: FuelEntryVerificationRow): number {
    return row?.fuelEntryID ?? row?.FuelEntryID ?? 0;
  }

  rowNumber(row: FuelEntryVerificationRow): string {
    return row?.fuelEntryNumber ?? row?.FuelEntryNumber ?? '';
  }

  formatDate(value: string | undefined): string {
    if (!value) return '—';
    return String(value).substring(0, 10);
  }

  formatDateTime(value: string | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleString();
  }

  displayCalc(value: number | null | undefined): string {
    if (value == null) return '—';
    return Number(value).toFixed(2);
  }

  lookupItems(key: string): FuelLookupItem[] {
    const pascal = key.charAt(0).toUpperCase() + key.slice(1);
    return (this.lookups as any)?.[key] || (this.lookups as any)?.[pascal] || [];
  }

  lookupId(item: FuelLookupItem): number {
    return item?.id ?? item?.Id ?? 0;
  }

  lookupName(item: FuelLookupItem): string {
    return item?.name ?? item?.Name ?? '';
  }

  lookupCode(item: FuelLookupItem): string {
    return item?.code ?? item?.Code ?? '';
  }

  locationName(id: number | null): string {
    if (!id) return '—';
    const match = (this.locations || []).find((l) => (l.organizationalEntityID ?? l.OrganizationalEntityID) === id);
    return match?.organizationalEntityName ?? match?.OrganizationalEntityName ?? String(id);
  }

  private loadLookups(): void {
    this.fuelEntryService.getLookups().subscribe({
      next: (data) => {
        this.lookups = data || {};
      },
      error: () => {
        this.snackBar.open('Failed to load lookups.', '', { duration: 5000 });
      },
    });
  }

  private loadLocations(): void {
    this.generalService.GetLocationHub().subscribe({
      next: (data) => {
        this.locations = data || [];
      },
      error: () => {
        this.locations = [];
      },
    });
  }

  private loadRows(): void {
    const criteria: FuelEntryVerificationSearchCriteria = {
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
      locationID: this.locationID || undefined,
      statusCode: (this.statusCode || '').trim() || undefined,
      registrationNumber: (this.registrationNumber || '').trim() || undefined,
      driverName: (this.driverName || '').trim() || undefined,
      entrySourceID: this.entrySourceID || undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    this.isSearching = true;
    this.fuelEntryService
      .verificationSearch(criteria)
      .pipe(finalize(() => (this.isSearching = false)))
      .subscribe({
        next: (result) => {
          this.rows = result?.rows ?? result?.Rows ?? [];
          this.totalCount = result?.totalCount ?? result?.TotalCount ?? 0;
          this.pageNumber = result?.pageNumber ?? result?.PageNumber ?? this.pageNumber;
          this.pageSize = result?.pageSize ?? result?.PageSize ?? this.pageSize;
          this.selection.clear();
        },
        error: (err) => {
          this.rows = [];
          this.totalCount = 0;
          this.snackBar.open(err?.error?.message || 'Search failed.', '', { duration: 6000 });
        },
      });
  }

  private revokeImageUrls(): void {
    this.imageObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.imageObjectUrls = [];
  }
}
