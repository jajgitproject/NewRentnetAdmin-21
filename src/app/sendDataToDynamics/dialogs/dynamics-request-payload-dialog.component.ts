// @ts-nocheck

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DynamicsRequestPayloadDialogData {
  requestPayload?: string | null;
  title?: string;
}

@Component({
  standalone: false,
  selector: 'app-dynamics-request-payload-dialog',
  templateUrl: './dynamics-request-payload-dialog.component.html',
  styleUrls: ['./dynamics-request-payload-dialog.component.scss']
})
export class DynamicsRequestPayloadDialogComponent {
  formattedPayload: string;

  constructor(
    public dialogRef: MatDialogRef<DynamicsRequestPayloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DynamicsRequestPayloadDialogData
  ) {
    this.formattedPayload = this.formatPayload(data?.requestPayload);
  }

  get dialogTitle(): string {
    return this.data?.title || 'Request JSON';
  }

  close(): void {
    this.dialogRef.close();
  }

  private formatPayload(raw: any): string {
    if (raw === null || raw === undefined) {
      return '';
    }

    const text = typeof raw === 'string' ? raw.trim() : String(raw).trim();
    if (!text) {
      return '';
    }

    if (text.startsWith('{') || text.startsWith('[')) {
      try {
        return JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        return text;
      }
    }

    if (typeof raw === 'object') {
      try {
        return JSON.stringify(raw, null, 2);
      } catch {
        return text;
      }
    }

    return text;
  }
}
