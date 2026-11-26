// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-admin-report-show-fields-dialog',
  template: `
    <h2 mat-dialog-title>Selected Fields</h2>
    <mat-dialog-content>
      <p class="field-count" *ngIf="fieldCount != null">Field count: {{ fieldCount }}</p>
      <pre class="fields-json">{{ prettyJson }}</pre>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .field-count {
        margin: 0 0 8px;
        font-size: 13px;
        color: #555;
      }
      .fields-json {
        margin: 0;
        padding: 12px;
        max-height: 60vh;
        overflow: auto;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-family: Consolas, 'Courier New', monospace;
        font-size: 12px;
        white-space: pre-wrap;
        word-break: break-word;
      }
    `
  ]
})
export class ShowFieldsDialogComponent {
  prettyJson = '';
  fieldCount: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ShowFieldsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const fields = data?.selectedFields || data?.SelectedFields;
    const rawJson = data?.selectedFieldsJson || data?.SelectedFieldsJson;
    this.fieldCount =
      data?.fieldCount ?? data?.FieldCount ?? (Array.isArray(fields) ? fields.length : null);

    try {
      if (Array.isArray(fields) && fields.length) {
        this.prettyJson = JSON.stringify(fields, null, 2);
      } else if (rawJson) {
        const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
        this.prettyJson = JSON.stringify(parsed, null, 2);
      } else {
        this.prettyJson = '[]';
      }
    } catch {
      this.prettyJson = String(rawJson || '[]');
    }
  }
}
