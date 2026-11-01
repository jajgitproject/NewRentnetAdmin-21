// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CLOSE_DUTY_COMPARE_FIELDS,
  CloseDutyCompare,
  amountsDiffer,
  downloadCloseDutyCompare
} from './close-duty-compare';

@Component({
  standalone: false,
  selector: 'app-close-duty-compare-dialog',
  template: `
    <div class="close-compare">
      <div class="close-compare__head">
        <h2>Closing Data ECO vs MYF</h2>
        <button type="button" mat-icon-button (click)="close()" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <section>
        <h3>ECO Closing Data</h3>
        <table>
          <thead>
            <tr>
              <th *ngFor="let field of fields">{{ field.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td *ngFor="let field of fields" [class.is-diff]="differs(field.key)">{{ data.eco[field.key] }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3>MYF Closing Data</h3>
        <table>
          <thead>
            <tr>
              <th *ngFor="let field of fields">{{ field.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td *ngFor="let field of fields" [class.is-diff]="differs(field.key)">{{ data.myf[field.key] }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <div class="close-compare__actions">
        <button type="button" mat-stroked-button (click)="download()">Download Excel</button>
        <button type="button" mat-flat-button color="primary" (click)="close()">OK</button>
      </div>
    </div>
  `,
  styles: [`
    .close-compare { width: min(920px, 92vw); padding: 8px 8px 4px; }
    .close-compare__head { display: flex; justify-content: space-between; align-items: center; }
    h2 { margin: 0; color: #111827; font-size: 22px; }
    h3 { margin: 18px 0 8px; text-align: center; color: #111827; font-size: 18px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #111827; padding: 8px 10px; text-align: center; color: #111827; }
    th { font-weight: 700; }
    td.is-diff { background: #fee2e2; font-weight: 700; }
    .close-compare__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
  `]
})
export class CloseDutyCompareDialogComponent {
  fields = CLOSE_DUTY_COMPARE_FIELDS;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CloseDutyCompare,
    private dialogRef: MatDialogRef<CloseDutyCompareDialogComponent>
  ) {}

  differs(key: string): boolean {
    return amountsDiffer(this.data?.eco?.[key], this.data?.myf?.[key]);
  }

  download(): void {
    downloadCloseDutyCompare(this.data);
  }

  close(): void {
    this.dialogRef.close();
  }
}
