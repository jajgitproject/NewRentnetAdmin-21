// @ts-nocheck
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreditNoteHistoryComponent } from './creditnotehistory.component';

@Component({
  standalone: false,
  selector: 'app-creditnote-history-example',
  template: `
    <div class="example-container">
      <h3>Credit Note History Integration Example</h3>
      <p>This shows how to open the Credit Note History dialog filtered by lifeCycleStatus:</p>
      
      <div class="button-group">
        <button mat-raised-button color="primary" (click)="openCreditNoteHistory()">
          <mat-icon>history</mat-icon>
          View All History
        </button>
        
        <button mat-raised-button color="accent" (click)="openCreditNoteHistoryByStatus('APPROVED')">
          <mat-icon>check_circle</mat-icon>
          View Approved History
        </button>
        
        <button mat-raised-button color="warn" (click)="openCreditNoteHistoryByStatus('REJECTED')">
          <mat-icon>cancel</mat-icon>
          View Rejected History
        </button>
        
        <button mat-raised-button (click)="openCreditNoteHistoryByStatus('PENDING_APPROVAL')">
          <mat-icon>pending</mat-icon>
          View Pending History
        </button>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      max-width: 800px;
    }
    .button-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 16px;
    }
    .button-group button {
      min-width: 160px;
    }
  `]
})
export class CreditNoteHistoryExampleComponent {
  
  constructor(private dialog: MatDialog) {}

  openCreditNoteHistory(creditNoteID: number = 1): void {
    const dialogRef = this.dialog.open(CreditNoteHistoryComponent, {
      width: '90vw',
      height: '80vh',
      data: {
        creditNoteID: creditNoteID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCreditNoteHistoryByStatus(lifeCycleStatus: string, creditNoteID: number = 1): void {
    const dialogRef = this.dialog.open(CreditNoteHistoryComponent, {
      width: '90vw',
      height: '80vh',
      data: {
        creditNoteID: creditNoteID,
        preSelectedStatus: lifeCycleStatus
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}


