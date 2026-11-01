// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import {
  CLOSE_DUTY_COMPARE_FIELDS,
  CloseDutyCompare,
  amountsDiffer,
  compareFromStoredPayload,
  downloadCloseDutyCompare
} from '../shared/close-duty-compare';

@Component({
  standalone: false,
  selector: 'app-vendor-closing-payload-dialog',
  template: `
    <div class="myf-payload">
      <div class="myf-payload__head">
        <div>
          <p class="myf-payload__kicker">{{ data.vendor || 'Vendor' }}</p>
          <h2>{{ showPayload ? 'Request and response' : 'Closing Data ECO vs MYF' }}</h2>
          <p class="myf-payload__slip">Duty slip {{ data.dutySlipId }}</p>
        </div>
        <button type="button" mat-icon-button (click)="close()" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="myf-payload__meta" *ngIf="!loading && status">
        <span>Status {{ status }}</span>
      </div>
      <div class="myf-payload__body">
        <div *ngIf="loading" class="myf-payload__loading">Loading payload…</div>

        <ng-container *ngIf="!loading && !showPayload && compare">
          <section class="close-compare">
            <h3>ECO Closing Data</h3>
            <table>
              <thead>
                <tr>
                  <th *ngFor="let field of fields">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td *ngFor="let field of fields" [class.is-diff]="differs(field.key)">{{ compare.eco[field.key] }}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section class="close-compare">
            <h3>MYF Closing Data</h3>
            <table>
              <thead>
                <tr>
                  <th *ngFor="let field of fields">{{ field.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td *ngFor="let field of fields" [class.is-diff]="differs(field.key)">{{ compare.myf[field.key] }}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </ng-container>

        <ng-container *ngIf="!loading && showPayload">
          <div *ngIf="hasStartTrip" class="vendor-payload__block">
            <h3 class="vendor-payload__label">Start trip</h3>
            <div class="vendor-payload__pair">
              <section class="payload-json">
                <h3>Request</h3>
                <pre>{{ startRequest }}</pre>
              </section>
              <section class="payload-json">
                <h3>Response</h3>
                <pre>{{ startResponse }}</pre>
              </section>
            </div>
          </div>
          <div *ngIf="hasEndTrip" class="vendor-payload__block">
            <h3 class="vendor-payload__label">End trip</h3>
            <div class="vendor-payload__pair">
              <section class="payload-json">
                <h3>Request</h3>
                <pre>{{ endRequest }}</pre>
              </section>
              <section class="payload-json">
                <h3>Response</h3>
                <pre>{{ endResponse }}</pre>
              </section>
            </div>
          </div>
          <div class="vendor-payload__block">
            <h3 class="vendor-payload__label">Closed</h3>
            <div class="vendor-payload__pair">
              <section class="payload-json">
                <h3>Request</h3>
                <pre>{{ requestBody }}</pre>
              </section>
              <section class="payload-json">
                <h3>Response</h3>
                <pre>{{ responseBody }}</pre>
              </section>
            </div>
          </div>
          <div *ngIf="hasUpload" class="vendor-payload__block">
            <h3 class="vendor-payload__label">Upload duty</h3>
            <div class="vendor-payload__pair">
              <section class="payload-json">
                <h3>Request</h3>
                <pre>{{ uploadRequest }}</pre>
              </section>
              <section class="payload-json">
                <h3>Response</h3>
                <pre>{{ uploadResponse }}</pre>
              </section>
            </div>
          </div>
        </ng-container>
      </div>
      <div class="myf-payload__actions" *ngIf="!loading">
        <button type="button" mat-stroked-button *ngIf="compare && !showPayload" (click)="download()">Download Excel</button>
        <button type="button" mat-stroked-button *ngIf="compare" (click)="togglePayload()">
          {{ showPayload ? 'Closing table' : 'Request and response' }}
        </button>
        <button type="button" mat-flat-button color="primary" (click)="close()">OK</button>
      </div>
    </div>
  `,
  styles: [`
    .myf-payload { width: min(980px, 92vw); max-height: 82vh; display: flex; flex-direction: column; }
    .myf-payload__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .myf-payload__kicker { margin: 0; letter-spacing: .08em; text-transform: uppercase; color: #00bcd4; font-size: 12px; font-weight: 700; }
    .myf-payload__slip { margin: 4px 0 0; color: #475569; font-size: 13px; }
    h2 { margin: 4px 0 0; color: #0f172a; font-size: 22px; }
    .myf-payload__meta { display: flex; gap: 10px; margin: 10px 0; color: #475569; font-size: 13px; }
    .myf-payload__body { overflow: auto; min-height: 180px; }
    .myf-payload__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .close-compare h3 { margin: 18px 0 8px; padding: 0; text-align: center; color: #111827; font-size: 18px; font-weight: 500; letter-spacing: 0; text-transform: none; }
    .close-compare table { width: 100%; border-collapse: collapse; }
    .close-compare th, .close-compare td { border: 1px solid #111827; padding: 8px 10px; text-align: center; color: #111827; background: #fff; }
    .close-compare th { font-weight: 700; }
    .close-compare td.is-diff { background: #fee2e2; font-weight: 700; }
    .vendor-payload__block { margin-top: 14px; }
    .vendor-payload__label { margin: 0 0 8px; padding: 0; color: #0f172a; font-size: 14px; letter-spacing: 0; text-transform: none; }
    .vendor-payload__pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .payload-json { background: #0f172a; border-radius: 14px; min-width: 0; }
    .payload-json h3 { margin: 0; padding: 12px 16px 0; color: #94a3b8; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
    pre { margin: 0; padding: 12px 16px 16px; color: #e2e8f0; white-space: pre-wrap; word-break: break-word; font-size: 12.5px; line-height: 1.5; }
    .myf-payload__loading { color: #334155; padding: 24px; }
    @media (max-width: 800px) { .vendor-payload__pair { grid-template-columns: 1fr; } }
  `]
})
export class VendorClosingPayloadDialogComponent implements OnInit {
  loading = true;
  showPayload = false;
  requestBody = '';
  responseBody = '';
  uploadRequest = '';
  uploadResponse = '';
  hasUpload = false;
  startRequest = '';
  startResponse = '';
  hasStartTrip = false;
  endRequest = '';
  endResponse = '';
  hasEndTrip = false;
  status = '';
  compare: CloseDutyCompare | null = null;
  fields = CLOSE_DUTY_COMPARE_FIELDS;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dutySlipId: number; vendor: string; loader: any },
    private dialogRef: MatDialogRef<VendorClosingPayloadDialogComponent>,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loader = this.data && this.data.loader;
    if (!loader || typeof loader.pipe !== 'function') {
      this.requestBody = 'Payload could not be loaded.';
      this.responseBody = '';
      this.showPayload = true;
      this.finish();
      return;
    }

    loader.pipe(finalize(() => this.finish())).subscribe({
      next: (payload) => {
        this.status = payload?.status || payload?.Status || '';
        const requestPartsRaw = this.splitTripPayload(payload?.request || payload?.Request || '');
        const responsePartsRaw = this.splitTripPayload(payload?.response || payload?.Response || '');
        this.startRequest = this.pretty(requestPartsRaw.startTrip);
        this.startResponse = this.pretty(responsePartsRaw.startTrip);
        this.hasStartTrip = !!(String(requestPartsRaw.startTrip || '').trim() || String(responsePartsRaw.startTrip || '').trim());
        this.endRequest = this.pretty(requestPartsRaw.endTrip);
        this.endResponse = this.pretty(responsePartsRaw.endTrip);
        this.hasEndTrip = !!(String(requestPartsRaw.endTrip || '').trim() || String(responsePartsRaw.endTrip || '').trim());
        const requestParts = this.splitUpload(requestPartsRaw.closed);
        const responseParts = this.splitUpload(responsePartsRaw.closed);
        this.requestBody = this.pretty(requestParts.closed);
        this.responseBody = this.pretty(responseParts.closed);
        this.uploadRequest = this.pretty(requestParts.upload);
        this.uploadResponse = this.pretty(responseParts.upload);
        this.hasUpload = !!(requestParts.upload || responseParts.upload);
        this.compare = compareFromStoredPayload(requestParts.closed, responseParts.closed);
        this.showPayload = !this.compare;
      },
      error: () => {
        this.requestBody = 'Payload could not be loaded.';
        this.responseBody = '';
        this.showPayload = true;
      }
    });
  }

  differs(key: string): boolean {
    return amountsDiffer(this.compare?.eco?.[key], this.compare?.myf?.[key]);
  }

  download(): void {
    if (!this.compare) {
      return;
    }
    downloadCloseDutyCompare(this.compare, this.data?.dutySlipId);
  }

  togglePayload(): void {
    this.showPayload = !this.showPayload;
  }

  close(): void {
    this.dialogRef.close();
  }

  private finish(): void {
    this.loading = false;
    this.changeDetector.markForCheck();
  }

  private splitTripPayload(value: string): { closed: string; startTrip: string; endTrip: string } {
    const start = this.splitMarked(value, '\n\nStart trip\n');
    if (start.after) {
      const end = this.splitMarked(start.after, '\n\nEnd trip\n');
      return { closed: start.before, startTrip: end.before, endTrip: end.after };
    }

    const endOnly = this.splitEndTrip(start.before);
    return { closed: endOnly.closed, startTrip: '', endTrip: endOnly.endTrip };
  }

  private splitMarked(value: string, marker: string): { before: string; after: string } {
    const text = String(value || '');
    const index = text.indexOf(marker);
    if (index < 0) {
      return { before: text, after: '' };
    }
    return { before: text.slice(0, index), after: text.slice(index + marker.length) };
  }

  private splitEndTrip(value: string): { closed: string; endTrip: string } {
    const text = String(value || '');
    const marker = '\n\nEnd trip\n';
    const index = text.lastIndexOf(marker);
    if (index < 0) {
      return { closed: text, endTrip: '' };
    }
    return {
      closed: text.slice(0, index),
      endTrip: text.slice(index + marker.length)
    };
  }

  private splitUpload(value: string): { closed: string; upload: string } {
    const text = String(value || '');
    const marker = '\n\nUpload duty\n';
    const index = text.indexOf(marker);
    if (index < 0) {
      return { closed: text, upload: '' };
    }
    return {
      closed: text.slice(0, index),
      upload: text.slice(index + marker.length)
    };
  }

  private pretty(value: string): string {
    const text = String(value || '').trim();
    if (!text) {
      return 'No payload was stored.';
    }
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch (e) {
      return text;
    }
  }
}
