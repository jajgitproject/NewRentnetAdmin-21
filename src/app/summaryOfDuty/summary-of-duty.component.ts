// @ts-nocheck
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SummaryOfDutyData, SummaryOfDutyRow } from './summary-of-duty.model';

/** Row order/labels match invoice summary design; values from API or "—". */
const PACKAGE_SECTION_PLACEHOLDER: SummaryOfDutyRow[] = [
  { label: 'Total Kms', value: '—' },
  { label: 'Total Hrs', value: '—' },
  { label: 'Package', value: '—' },
  { label: 'Package Amount', value: '—' }
];

const EXTRA_SECTION_PLACEHOLDER: SummaryOfDutyRow[] = [
  { label: 'Extra Kms', value: '—' },
  { label: 'Extra Kms Amt', value: '—' },
  { label: 'Extra Hrs', value: '—' },
  { label: 'Extra Hrs Amt', value: '—' }
];

const OTHER_CHARGES_PLACEHOLDER: SummaryOfDutyRow[] = [
  { label: 'Driver Allowance Amount', value: '—' },
  { label: 'Night Amount', value: '—' },
  { label: 'FGR', value: '—' },
  { label: 'Parking / Toll', value: '—' },
  { label: 'Interstate Tax', value: '—' }
];

const TAX_SECTION_PLACEHOLDER: SummaryOfDutyRow[] = [
  { label: 'Chargeable Expenses GST %', value: '—' },
  { label: 'GST Type', value: '—' },
  { label: 'GST Amount', value: '—' }
];

@Component({
  standalone: false,
  selector: 'app-summary-of-duty',
  templateUrl: './summary-of-duty.component.html',
  styleUrls: ['./summary-of-duty.component.sass']
})
export class SummaryOfDutyComponent implements OnInit, OnChanges {
  /** Mapped calculate API payload; null/empty shows placeholder rows only (no sample numbers). */
  @Input() data: SummaryOfDutyData | null;

  packageDetails: SummaryOfDutyRow[] = [];
  extraDetails: SummaryOfDutyRow[] = [];
  otherCharges: SummaryOfDutyRow[] = [];
  taxDetails: SummaryOfDutyRow[] = [];
  finalBillLabel = 'Final Bill Amount';
  finalBillAmount = '—';

  ngOnInit(): void {
    this.applyModel();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.applyModel();
  }

  /** Merge API rows into a fixed template so order and missing labels always match the design. */
  private mergeRows(template: SummaryOfDutyRow[], live: SummaryOfDutyRow[] | undefined): SummaryOfDutyRow[] {
    if (!live?.length) {
      return [...template];
    }
    const by = new Map(live.map((r) => [r.label, r.value]));
    return template.map((t) => ({
      label: t.label,
      value: by.has(t.label) ? by.get(t.label) : t.value
    }));
  }

  private applyModel(): void {
    const useLive = this.data != null && this.hasAnySection(this.data);
    if (!useLive) {
      this.packageDetails = [...PACKAGE_SECTION_PLACEHOLDER];
      this.extraDetails = [...EXTRA_SECTION_PLACEHOLDER];
      this.otherCharges = [...OTHER_CHARGES_PLACEHOLDER];
      this.taxDetails = [...TAX_SECTION_PLACEHOLDER];
      this.finalBillLabel = 'Final Bill Amount';
      this.finalBillAmount = '—';
      return;
    }
    const src = this.data as SummaryOfDutyData;
    this.packageDetails = this.mergeRows(PACKAGE_SECTION_PLACEHOLDER, src.packageDetails);
    this.extraDetails = this.mergeRows(EXTRA_SECTION_PLACEHOLDER, src.extraDetails);
    this.otherCharges = this.mergeRows(OTHER_CHARGES_PLACEHOLDER, src.otherCharges);
    this.taxDetails = this.mergeRows(TAX_SECTION_PLACEHOLDER, src.taxDetails);
    this.finalBillLabel = src.finalBillLabel ?? 'Final Bill Amount';
    this.finalBillAmount = src.finalBillAmount ?? '—';
  }

  private hasAnySection(d: SummaryOfDutyData): boolean {
    return (
      (d.packageDetails?.length ?? 0) > 0 ||
      (d.extraDetails?.length ?? 0) > 0 ||
      (d.otherCharges?.length ?? 0) > 0 ||
      (d.taxDetails?.length ?? 0) > 0 ||
      !!d.finalBillAmount
    );
  }

  trackByLabel(_index: number, row: SummaryOfDutyRow): string {
    return row.label;
  }
}
