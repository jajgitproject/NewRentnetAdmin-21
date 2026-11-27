// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CappingFacilityConfigService } from './cappingFacilityConfig.service';
import {
  CappingFacilityDateConfigModel,
  CappingFacilityDateConfigSaveRequest
} from './cappingFacilityConfig.model';
import { GeneralService } from '../general/general.service';

@Component({
  standalone: false,
  selector: 'app-capping-facility-config',
  templateUrl: './cappingFacilityConfig.component.html',
  styleUrls: ['./cappingFacilityConfig.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CappingFacilityConfigComponent implements OnInit {
  selectedDates: Date[] = [];
  datePickerControl = new FormControl(null);
  existingConfigs: CappingFacilityDateConfigModel[] = [];
  displayedColumns = ['configDateDisplay', 'actions'];
  isLoading = false;
  isSaving = false;
  rangeFrom: Date;
  rangeTo: Date;

  constructor(
    private service: CappingFacilityConfigService,
    private snackBar: MatSnackBar,
    public generalService: GeneralService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    const now = new Date();
    this.rangeFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    this.rangeTo = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  }

  ngOnInit() {
    this.loadExisting();
  }

  loadExisting() {
    this.isLoading = true;
    const from = this.formatDateIso(this.rangeFrom);
    const to = this.formatDateIso(this.rangeTo);
    this.service.getByRange(from, to).subscribe({
      next: (rows) => {
        const list = Array.isArray(rows) ? rows : [];
        // Form is OFF-only: hide any legacy ON rows
        this.existingConfigs = list.filter(
          (r) => r && (r.isCappingEnabled === false || r.IsCappingEnabled === false)
        );
        this.isLoading = false;
      },
      error: () => {
        this.existingConfigs = [];
        this.isLoading = false;
        this.showNotification('snackbar-danger', 'Failed to load capping facility configs', 'bottom', 'center');
      }
    });
  }

  onDateSelected(date: Date | null) {
    if (!date) {
      return;
    }
    const day = this.stripTime(date);
    const exists = this.selectedDates.some((d) => this.isSameDay(d, day));
    if (!exists) {
      this.selectedDates = [...this.selectedDates, day].sort((a, b) => a.getTime() - b.getTime());
    }
    this.datePickerControl.setValue(null);
  }

  removeSelectedDate(date: Date) {
    this.selectedDates = this.selectedDates.filter((d) => !this.isSameDay(d, date));
  }

  clearSelected() {
    this.selectedDates = [];
  }

  save() {
    if (!this.selectedDates.length) {
      this.showNotification('snackbar-warning', 'Select at least one date', 'bottom', 'center');
      return;
    }

    const request: CappingFacilityDateConfigSaveRequest = {
      dates: this.selectedDates.map((d) => this.formatDateIso(d)),
      isCappingEnabled: false,
      userID: this.generalService.getUserID()
    };

    this.isSaving = true;
    this.service.save(request).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res && res.result && String(res.result).toLowerCase().startsWith('success')) {
          this.showNotification(
            'snackbar-success',
            'Saved capping OFF for ' + (res.savedCount || this.selectedDates.length) + ' date(s)',
            'bottom',
            'center'
          );
          this.selectedDates = [];
          this.loadExisting();
        } else {
          this.showNotification('snackbar-danger', (res && res.result) || 'Save failed', 'bottom', 'center');
        }
      },
      error: (err) => {
        this.isSaving = false;
        const message =
          (err && err.error && (typeof err.error === 'string' ? err.error : err.error.result)) ||
          'Save failed';
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    });
  }

  deleteConfig(row: CappingFacilityDateConfigModel) {
    if (!row || !row.cappingFacilityDateConfigID) {
      return;
    }
    this.service.delete(row.cappingFacilityDateConfigID).subscribe({
      next: () => {
        this.showNotification('snackbar-success', 'Config removed', 'bottom', 'center');
        this.loadExisting();
      },
      error: () => {
        this.showNotification('snackbar-danger', 'Failed to delete config', 'bottom', 'center');
      }
    });
  }

  formatDisplay(date: Date): string {
    if (!date) {
      return '';
    }
    const dd = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dd + '-' + months[date.getMonth()] + '-' + date.getFullYear();
  }

  private formatDateIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
