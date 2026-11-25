// @ts-nocheck
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GeneralService } from '../../general/general.service';

@Component({
  selector: 'app-mis-my-format',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './mis-my-format.component.html',
  styleUrls: ['./mis-my-format.component.scss']
})
export class MisMyFormatComponent implements OnInit {
  @Input() apiSegment = '';
  @Input() panelTitle = 'My Format';
  @Output() formatReadyChange = new EventEmitter<boolean>();

  availableFields: string[] = [];
  selectedFields: string[] = [];
  maxFields = 50;
  hasFormat = false;
  loading = false;
  saving = false;
  panelExpanded = true;
  private apiUrl = '';
  private selectedLookup = new Set<string>();

  constructor(
    private http: HttpClient,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.apiUrl = (this.generalService.BaseURL || '') + this.apiSegment;
    this.load();
  }

  get selectedCount(): number {
    return this.selectedFields.length;
  }

  get hasUnsavedSelection(): boolean {
    return !this.hasFormat && this.selectedFields.length > 0;
  }

  isChecked(field: string): boolean {
    return this.selectedLookup.has(field);
  }

  canCheckMore(): boolean {
    return this.selectedFields.length < this.maxFields;
  }

  toggle(field: string, checked: boolean): void {
    if (checked) {
      if (this.selectedLookup.has(field)) {
        return;
      }
      if (this.selectedFields.length >= this.maxFields) {
        this.snackBar.open(`You cannot select more than ${this.maxFields} fields.`, '', {
          duration: 2500,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
        return;
      }
      this.selectedFields = [...this.selectedFields, field];
    } else {
      this.selectedFields = this.selectedFields.filter((f) => f !== field);
    }
    this.selectedLookup = new Set(this.selectedFields);
    // Selecting alone does not unlock search; only a successful Save does.
    if (this.hasFormat) {
      this.hasFormat = false;
      this.formatReadyChange.emit(false);
    }
  }

  save(): void {
    if (this.selectedFields.length < 1) {
      this.snackBar.open('Select at least one field.', '', {
        duration: 2500,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-danger'
      });
      return;
    }

    if (this.selectedFields.length > this.maxFields) {
      this.snackBar.open(`You cannot select more than ${this.maxFields} fields.`, '', {
        duration: 2500,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-danger'
      });
      return;
    }

    const pendingFields = [...this.selectedFields];
    this.saving = true;
    const body = {
      UserID: this.generalService.getUserID(),
      Fields: pendingFields
    };
    this.http.put(this.apiUrl + '/MyFormat', body).subscribe({
      next: (data: any) => {
        this.saving = false;
        // Keep checkbox choices if the response is odd; never unlock unless server HasFormat.
        if (pendingFields.length > 0 && this.selectedFields.length === 0) {
          this.selectedFields = [...pendingFields];
          this.selectedLookup = new Set(this.selectedFields);
        }
        const unlocked = this.applyDto(data, false);
        if (!unlocked) {
          this.hasFormat = false;
          this.formatReadyChange.emit(false);
          this.load(true);
          return;
        }
        this.panelExpanded = false;
        this.snackBar.open('Format saved.', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-success'
        });
      },
      error: (err) => {
        this.saving = false;
        this.hasFormat = false;
        this.formatReadyChange.emit(false);
        const message = err?.error?.message || err?.error?.Message || 'Could not save format.';
        this.snackBar.open(message, '', {
          duration: 4500,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
      }
    });
  }

  private load(afterSave = false): void {
    this.loading = !afterSave;
    const userId = this.generalService.getUserID();
    this.http.get(this.apiUrl + '/MyFormat', { params: { userId: String(userId || 0) } }).subscribe({
      next: (data: any) => {
        this.loading = false;
        const unlocked = this.applyDto(data, !afterSave);
        if (afterSave) {
          if (unlocked && this.hasFormat) {
            this.panelExpanded = false;
            this.snackBar.open('Format saved.', '', {
              duration: 2000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-success'
            });
          } else {
            this.hasFormat = false;
            this.formatReadyChange.emit(false);
            this.snackBar.open(
              'Format was not saved. Apply MisUserReportFormat.sql on the API database, then try again.',
              '',
              {
                duration: 4500,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: 'snackbar-danger'
              }
            );
          }
        } else {
          this.panelExpanded = !this.hasFormat;
        }
      },
      error: () => {
        this.loading = false;
        this.hasFormat = false;
        this.formatReadyChange.emit(false);
        this.panelExpanded = true;
        this.snackBar.open('Could not load My Format. Apply MisUserReportFormat.sql if tables are missing.', '', {
          duration: 4000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
      }
    });
  }

  /**
   * Applies server DTO. Unlocks only when the server reports a saved format with fields.
   * @param replaceSelection when true, empty selectedFields from server clears local checkboxes (initial load).
   */
  private applyDto(data: any, replaceSelection = true): boolean {
    const dto = data?.format || data?.Format || data || {};
    const available = dto?.availableFields || dto?.AvailableFields;
    const selectedRaw = dto?.selectedFields || dto?.SelectedFields;
    const selected = Array.isArray(selectedRaw) ? selectedRaw.filter((f) => !!f) : [];

    if (Array.isArray(available) && available.length > 0) {
      this.availableFields = available;
    }

    this.maxFields = dto?.maxFields || dto?.MaxFields || this.maxFields || 50;

    const serverHasFormat = !!(dto?.hasFormat || dto?.HasFormat) && selected.length > 0;
    if (serverHasFormat) {
      this.selectedFields = [...selected];
      this.selectedLookup = new Set(this.selectedFields);
      this.hasFormat = true;
      this.formatReadyChange.emit(true);
      return true;
    }

    if (replaceSelection && Array.isArray(selectedRaw)) {
      this.selectedFields = [];
      this.selectedLookup = new Set();
    }

    this.hasFormat = false;
    this.formatReadyChange.emit(false);
    return false;
  }
}
