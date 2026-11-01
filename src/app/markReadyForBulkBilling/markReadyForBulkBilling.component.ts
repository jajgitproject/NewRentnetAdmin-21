import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { GeneralService } from '../general/general.service';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import {
  getCustomerDisplayLabel,
  getCustomerDisplayValue,
  getCustomerIdValue,
  getCustomerNameFromAutocomplete,
  getCustomerTallyId,
  resolveCustomerFromAutocomplete,
} from '../shared/customer-autocomplete.util';
import { BulkInvoiceService } from '../bulkInvoice/bulkInvoice.service';
import { MarkReadyForBulkBillingRow } from '../bulkInvoice/bulkInvoice.model';

@Component({
  standalone: false,
  selector: 'app-mark-ready-for-bulk-billing',
  templateUrl: './markReadyForBulkBilling.component.html',
  styleUrls: ['./markReadyForBulkBilling.component.scss'],
})
export class MarkReadyForBulkBillingComponent implements OnInit {
  searchDutySlipIds = '';
  searchReservationIds = '';
  searchBatchDate: Date | null = null;
  searchRunId: number | null = null;
  customerCtrl = new FormControl('');
  customerList: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]> = of([]);
  selectedCustomerID = 0;

  duties: MarkReadyForBulkBillingRow[] = [];
  totalMatchedCount = 0;
  previewLoading = false;
  saving = false;
  selectedDutySlipIds: number[] = [];
  previewError = '';

  previewColumns = [
    'select',
    'dutySlipID',
    'reservationID',
    'pickupDate',
    'customerName',
    'bulkGfbBatchDate',
    'bulkGfbBatchId',
    'readyForBulkBilling',
  ];

  getCustomerDisplayLabel = getCustomerDisplayLabel;
  getCustomerDisplayValue = getCustomerDisplayValue;

  constructor(
    private service: BulkInvoiceService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  get selectedCount(): number {
    return this.selectedDutySlipIds.length;
  }

  get allSelected(): boolean {
    return this.duties.length > 0 && this.duties.every((row) => this.isRowSelected(row.dutySlipID));
  }

  get someSelected(): boolean {
    const selected = this.duties.filter((row) => this.isRowSelected(row.dutySlipID)).length;
    return selected > 0 && selected < this.duties.length;
  }

  displayCustomer = (value: string): string => {
    const selected = resolveCustomerFromAutocomplete(value, this.customerList);
    if (!selected) {
      return getCustomerNameFromAutocomplete(value);
    }
    const tally = getCustomerTallyId(selected);
    return tally ? `${selected.customerName} (${tally})` : selected.customerName || '';
  };

  onCustomerSelected(value: string): void {
    const selected = resolveCustomerFromAutocomplete(value, this.customerList);
    this.selectedCustomerID = selected?.customerID > 0 ? selected.customerID : 0;
  }

  isRowSelected(dutySlipID: number): boolean {
    return this.selectedDutySlipIds.indexOf(Number(dutySlipID)) >= 0;
  }

  setRowSelected(dutySlipID: number, checked: boolean): void {
    const id = Number(dutySlipID);
    if (checked) {
      if (this.selectedDutySlipIds.indexOf(id) < 0) {
        this.selectedDutySlipIds = this.selectedDutySlipIds.concat(id);
      }
      return;
    }
    this.selectedDutySlipIds = this.selectedDutySlipIds.filter((value) => value !== id);
  }

  toggleAll(checked: boolean): void {
    this.selectedDutySlipIds = checked ? this.duties.map((row) => Number(row.dutySlipID)) : [];
  }

  customerLabel(row: MarkReadyForBulkBillingRow): string {
    if (row.tallyIntegrationCode) {
      return `${row.customerName || ''} (${row.tallyIntegrationCode})`;
    }
    return row.customerName || '';
  }

  clearSearch(): void {
    this.searchDutySlipIds = '';
    this.searchReservationIds = '';
    this.searchBatchDate = null;
    this.searchRunId = null;
    this.customerCtrl.setValue('');
    this.selectedCustomerID = 0;
    this.duties = [];
    this.totalMatchedCount = 0;
    this.selectedDutySlipIds = [];
    this.previewError = '';
  }

  search(): void {
    this.syncCustomerFromInput();
    this.previewLoading = true;
    this.previewError = '';
    this.service
      .previewMarkTag({
        batchDate: this.formatDate(this.searchBatchDate),
        bulkGfbBatchId: this.searchRunId > 0 ? Number(this.searchRunId) : undefined,
        dutySlipIds: (this.searchDutySlipIds || '').trim(),
        reservationIds: (this.searchReservationIds || '').trim(),
        customerId: this.selectedCustomerID,
      })
      .subscribe({
        next: (result) => {
          this.duties = this.asArray(result.duties ?? (result as any).Duties).map((row: any) =>
            this.normalizeRow(row)
          );
          this.totalMatchedCount = result.totalMatchedCount ?? (result as any).TotalMatchedCount ?? this.duties.length;
          this.selectedDutySlipIds = this.duties.map((row) => Number(row.dutySlipID));
          this.previewLoading = false;
        },
        error: (err) => {
          this.previewLoading = false;
          this.duties = [];
          this.previewError = this.readError(err, 'Search failed.');
        },
      });
  }

  onRowTagChange(row: MarkReadyForBulkBillingRow, checked: boolean): void {
    const previous = row.readyForBulkBilling;
    row.readyForBulkBilling = checked;
    this.saving = true;
    this.service.setTag(row.dutySlipID, checked, this.generalService.getUserID()).subscribe({
      next: (result) => {
        this.saving = false;
        row.readyForBulkBilling =
          result?.readyForBulkBilling === true || result?.ReadyForBulkBilling === true;
        this.snackBar.open(checked ? 'Tagged.' : 'Tag cleared.', '', { duration: 2000 });
      },
      error: (err) => {
        this.saving = false;
        row.readyForBulkBilling = previous;
        Swal.fire({
          title: this.readError(err, 'Could not update tag.'),
          icon: 'error',
        });
      },
    });
  }

  markSelected(value: boolean): void {
    if (!this.selectedCount) {
      return;
    }
    this.saving = true;
    this.service.setTags(this.selectedDutySlipIds.slice(), value, this.generalService.getUserID()).subscribe({
      next: (payload) => {
        this.saving = false;
        const updated = payload?.updatedCount ?? payload?.UpdatedCount ?? 0;
        const failed = payload?.failedCount ?? payload?.FailedCount ?? 0;
        this.duties = this.duties.map((row) => {
          if (this.isRowSelected(row.dutySlipID)) {
            return { ...row, readyForBulkBilling: value };
          }
          return row;
        });
        this.snackBar.open(`Updated ${updated}${failed ? `, failed ${failed}` : ''}.`, '', { duration: 3000 });
        if (failed) {
          this.search();
        }
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({
          title: this.readError(err, 'Could not update tags.'),
          icon: 'error',
        });
      },
    });
  }

  private loadCustomers(): void {
    this.generalService.getCustomers().subscribe({
      next: (data) => {
        this.customerList = data || [];
        this.filteredCustomerOptions = this.customerCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterCustomers(value || ''))
        );
      },
      error: () => undefined,
    });
  }

  private filterCustomers(value: string): CustomerDropDown[] {
    const raw = (value || '').toLowerCase();
    const name = getCustomerNameFromAutocomplete(value).toLowerCase();
    return (this.customerList || []).filter((row) => {
      const customerName = (row.customerName || '').toLowerCase();
      const tally = getCustomerTallyId(row).toLowerCase();
      const customerId = getCustomerIdValue(row).toLowerCase();
      return (
        customerName.includes(name) ||
        customerName.includes(raw) ||
        tally.includes(raw) ||
        customerId.includes(raw) ||
        getCustomerDisplayLabel(row).toLowerCase().includes(raw)
      );
    });
  }

  private syncCustomerFromInput(): void {
    const typed = this.customerCtrl.value;
    if (!typed) {
      this.selectedCustomerID = 0;
      return;
    }
    const resolved = resolveCustomerFromAutocomplete(typed, this.customerList);
    this.selectedCustomerID = resolved?.customerID > 0 ? resolved.customerID : this.selectedCustomerID;
  }

  private formatDate(value: Date | null): string {
    if (!value) {
      return '';
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizeRow(row: any): MarkReadyForBulkBillingRow {
    return {
      dutySlipID: row.dutySlipID ?? row.DutySlipID,
      dutySlipForBillingID: row.dutySlipForBillingID ?? row.DutySlipForBillingID,
      reservationID: row.reservationID ?? row.ReservationID,
      pickupDate: row.pickupDate ?? row.PickupDate,
      customerName: row.customerName ?? row.CustomerName,
      tallyIntegrationCode: row.tallyIntegrationCode ?? row.TallyIntegrationCode,
      bulkGfbBatchId: row.bulkGfbBatchId ?? row.BulkGfbBatchId,
      bulkGfbBatchDate: row.bulkGfbBatchDate ?? row.BulkGfbBatchDate,
      readyForBulkBilling: row.readyForBulkBilling === true || row.ReadyForBulkBilling === true,
    };
  }

  private asArray(payload: any): any[] {
    if (Array.isArray(payload)) {
      return payload;
    }
    if (Array.isArray(payload?.$values)) {
      return payload.$values;
    }
    return [];
  }

  private readError(err: any, fallback: string): string {
    if (typeof err === 'string' && err.trim()) {
      return err;
    }
    return err?.error?.message || err?.error?.Message || err?.message || fallback;
  }
}
