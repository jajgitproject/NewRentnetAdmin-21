// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

import { GeneralService } from '../general/general.service';
import { ApplicationAuditPageSettingRow } from './applicationAuditSettings.model';
import { ApplicationAuditSettingsService } from './applicationAuditSettings.service';

@Component({
  standalone: false,
  selector: 'app-application-audit-settings',
  templateUrl: './applicationAuditSettings.component.html',
  styleUrls: ['./applicationAuditSettings.component.sass'],
})
export class ApplicationAuditSettingsComponent implements OnInit {
  rows: ApplicationAuditPageSettingRow[] = [];
  filteredRows: ApplicationAuditPageSettingRow[] = [];
  pendingChanges: { [pageKey: string]: boolean } = {};
  isLoading = false;
  isSaving = false;

  filterTextCtrl = new FormControl('');
  showFilterCtrl = new FormControl('all');

  constructor(
    private settingsService: ApplicationAuditSettingsService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.filterTextCtrl.valueChanges.subscribe(() => this.applyFilters());
    this.showFilterCtrl.valueChanges.subscribe(() => this.applyFilters());
  }

  loadSettings(): void {
    this.isLoading = true;
    this.pendingChanges = {};
    this.settingsService
      .getPageSettings()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.rows = data || [];
          this.applyFilters();
        },
        error: () => {
          this.rows = [];
          this.filteredRows = [];
          this.snackBar.open(
            'Failed to load page settings. Ensure ApplicationAuditPageSetting_Tables.sql has been run.',
            '',
            { duration: 8000 }
          );
        },
      });
  }

  pageKey(row: ApplicationAuditPageSettingRow): string {
    return (row.pageKey || row.PageKey || '').toString();
  }

  path(row: ApplicationAuditPageSettingRow): string {
    return (row.path || row.Path || '').toString();
  }

  isEnabled(row: ApplicationAuditPageSettingRow): boolean {
    const key = this.pageKey(row);
    if (key && Object.prototype.hasOwnProperty.call(this.pendingChanges, key)) {
      return this.pendingChanges[key];
    }
    return !!(row.isEnabled ?? row.IsEnabled);
  }

  effectiveSource(row: ApplicationAuditPageSettingRow): string {
    const src = (row.effectiveSource || row.EffectiveSource || 'default').toString();
    if (src.toLowerCase() === 'appsettings') {
      return 'appsettings default';
    }
    if (src.toLowerCase() === 'default') {
      return 'appsettings default';
    }
    return src;
  }

  onToggle(row: ApplicationAuditPageSettingRow, enabled: boolean): void {
    const key = this.pageKey(row);
    if (!key) return;
    const original = !!(row.isEnabled ?? row.IsEnabled);
    if (enabled === original) {
      delete this.pendingChanges[key];
    } else {
      this.pendingChanges[key] = enabled;
    }
  }

  hasPendingChanges(): boolean {
    return Object.keys(this.pendingChanges).length > 0;
  }

  save(): void {
    const performedBy = this.generalService.getUserID();
    if (!performedBy || performedBy <= 0) {
      this.snackBar.open('Unable to determine current user.', '', { duration: 4000 });
      return;
    }

    const pages = Object.keys(this.pendingChanges).map((pageKey) => ({
      pageKey,
      isEnabled: this.pendingChanges[pageKey],
    }));

    if (!pages.length) {
      return;
    }

    this.isSaving = true;
    this.settingsService
      .savePageSettings(performedBy, pages)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (data) => {
          this.rows = data || [];
          this.pendingChanges = {};
          this.applyFilters();
          this.snackBar.open('Page audit settings saved.', '', { duration: 3000 });
        },
        error: (err) => {
          const msg =
            err?.error?.message ||
            'Failed to save settings. Ensure ApplicationAuditPageSetting table exists.';
          this.snackBar.open(msg, '', { duration: 8000 });
        },
      });
  }

  formatModifiedDate(value: string | null | undefined): string {
    if (!value) return '—';
    const d = new Date(value);
    if (!isFinite(d.getTime())) return value;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  modifiedLabel(row: ApplicationAuditPageSettingRow): string {
    const name = (row.modifiedByName || row.ModifiedByName || '').trim();
    const date = this.formatModifiedDate(row.modifiedDate || row.ModifiedDate);
    if (!name && date === '—') return '—';
    if (!name) return date;
    return name + ' · ' + date;
  }

  private applyFilters(): void {
    const text = (this.filterTextCtrl.value || '').toString().toLowerCase().trim();
    const show = (this.showFilterCtrl.value || 'all').toString();

    this.filteredRows = (this.rows || []).filter((row) => {
      const key = this.pageKey(row).toLowerCase();
      const path = this.path(row).toLowerCase();
      if (text && !key.includes(text) && !path.includes(text)) {
        return false;
      }
      const enabled = this.isEnabled(row);
      if (show === 'enabled' && !enabled) return false;
      if (show === 'disabled' && enabled) return false;
      return true;
    });
  }
}
