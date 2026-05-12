// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { of } from 'rxjs';
import { catchError, finalize, take, timeout } from 'rxjs/operators';

export interface CustomerKamRow {
  kamID?: number;
  KamID?: number;
  firstName?: string;
  FirstName?: string;
  lastName?: string;
  LastName?: string;
  mobile?: string;
  Mobile?: string;
  email?: string;
  Email?: string;
}

export interface KamInfoDialogData {
  customerID: number;
  customerName?: string;
  /** When set (e.g. from prefetch), skip HTTP and render immediately */
  kamList?: CustomerKamRow[] | null;
}

@Component({
  standalone: false,
  selector: 'app-kam-info-dialog',
  templateUrl: './kam-info-dialog.component.html',
  styleUrls: ['./kam-info-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class KamInfoDialogComponent implements OnInit {
  dialogTitle = 'KAM Info';
  loading = true;
  kamList: CustomerKamRow[] = [];
  loadError: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<KamInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KamInfoDialogData,
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.data?.customerID;
    if (id == null || id === '' || Number.isNaN(Number(id))) {
      this.loading = false;
      this.loadError = 'No customer selected.';
      this.cdr.detectChanges();
      return;
    }

    const preloaded = this.data?.kamList;
    if (Array.isArray(preloaded)) {
      this.kamList = preloaded.map((k) => ({ ...k }));
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this._generalService
      .GetCustomerKam(Number(id))
      .pipe(
        take(1),
        timeout(25000),
        catchError(() => {
          this.loadError = 'Could not load KAM details.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((rows: CustomerKamRow[] | null) => {
        this.kamList =
          rows == null ? [] : Array.isArray(rows) ? rows.map((k) => ({ ...k })) : [{ ...(rows as CustomerKamRow) }];
      });
  }

  displayName(k: CustomerKamRow): string {
    const fn = k.firstName ?? k.FirstName ?? '';
    const ln = k.lastName ?? k.LastName ?? '';
    return `${fn} ${ln}`.trim() || '—';
  }

  displayMobile(k: CustomerKamRow): string {
    return k.mobile ?? k.Mobile ?? '—';
  }

  displayEmail(k: CustomerKamRow): string {
    return k.email ?? k.Email ?? '—';
  }
}
