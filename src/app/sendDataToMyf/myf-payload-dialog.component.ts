// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-myf-payload-dialog',
  template: `
    <div class="myf-payload">
      <div class="myf-payload__head">
        <div>
          <p class="myf-payload__kicker">{{ data.channel }} · {{ data.kind }}</p>
          <h2>Duty slip {{ data.dutySlipId }}</h2>
        </div>
        <button type="button" mat-icon-button (click)="close()" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="myf-payload__meta" *ngIf="!loading">
        <span *ngIf="eventName">Event {{ eventName }}</span>
        <span *ngIf="status">Status {{ status }}</span>
      </div>
      <div class="myf-payload__body">
        <div *ngIf="loading" class="myf-payload__loading">Loading payload…</div>
        <pre *ngIf="!loading">{{ body }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .myf-payload { width: min(860px, 86vw); max-height: 82vh; display: flex; flex-direction: column; }
    .myf-payload__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .myf-payload__kicker { margin: 0; letter-spacing: .08em; text-transform: uppercase; color: #00bcd4; font-size: 12px; font-weight: 700; }
    :host-context(body.theme-white) .myf-payload__kicker { color: #00bcd4; }
    :host-context(body.theme-black) .myf-payload__kicker { color: #1a202e; }
    :host-context(body.theme-purple) .myf-payload__kicker { color: #6777ef; }
    :host-context(body.theme-blue) .myf-payload__kicker { color: #03a9f3; }
    :host-context(body.theme-cyan) .myf-payload__kicker { color: #01d8da; }
    :host-context(body.theme-green) .myf-payload__kicker { color: #57d68f; }
    :host-context(body.theme-orange) .myf-payload__kicker { color: #ffb463; }
    h2 { margin: 4px 0 0; color: #0f172a; font-size: 22px; }
    .myf-payload__meta { display: flex; gap: 10px; margin: 10px 0; color: #475569; font-size: 13px; }
    .myf-payload__body { overflow: auto; background: #0f172a; border-radius: 14px; min-height: 180px; }
    pre { margin: 0; padding: 16px; color: #e2e8f0; white-space: pre-wrap; word-break: break-word; font-size: 12.5px; line-height: 1.5; }
    .myf-payload__loading { color: #cbd5e1; padding: 24px; }
  `]
})
export class MyfPayloadDialogComponent implements OnInit {
  loading = true;
  body = '';
  eventName = '';
  status = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dutySlipId: number; channel: string; kind: string; loader: any },
    private dialogRef: MatDialogRef<MyfPayloadDialogComponent>,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loader = this.data && this.data.loader;
    if (!loader || typeof loader.pipe !== 'function') {
      this.body = 'Payload could not be loaded.';
      this.finish();
      return;
    }

    loader.pipe(finalize(() => this.finish())).subscribe({
      next: (payload) => {
        this.eventName = payload?.eventName || payload?.EventName || '';
        this.status = payload?.status || payload?.Status || '';
        this.body = this.pretty(payload?.body || payload?.Body || '');
      },
      error: () => {
        this.body = 'Payload could not be loaded.';
      }
    });
  }

  private finish(): void {
    this.loading = false;
    if (!this.body) {
      this.body = 'No payload stored for this duty.';
    }
    this.changeDetector.detectChanges();
  }

  close(): void {
    this.dialogRef.close();
  }

  private pretty(text: string): string {
    const value = String(text || '').trim();
    if (!value) {
      return 'No payload stored for this duty.';
    }
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
}
