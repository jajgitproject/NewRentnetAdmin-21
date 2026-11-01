import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-audit-nlp-questions-dialog',
  templateUrl: './nlp-questions-dialog.component.html',
  styleUrls: ['./nlp-questions-dialog.component.sass'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule]
})
export class AuditNlpQuestionsDialogComponent {
  readonly intro =
    'Type these in Search in plain English and click Ask. Dates cannot go beyond 31 days.';
  readonly footer =
    'After Ask, open Details on a row to see Old Driver and New Driver (name and mobile).';
  readonly sections: { title: string; examples: string[] }[] = [
    {
      title: 'Allotment stages',
      examples: [
        'soft allotment today',
        'hard allotment last week',
        'cancel allotment by Mayank',
        'reallotment for reservation 133539',
        'soft to hard allotment today'
      ]
    },
    {
      title: 'Who did it',
      examples: [
        'allotment updates by Mayank last week',
        'changes by Mayank today',
        'reservation updates by Mayank yesterday'
      ]
    },
    {
      title: 'A specific booking',
      examples: [
        'reservation 133539',
        'allotment 135836',
        'show allotment changes for reservation 133539 today'
      ]
    },
    {
      title: 'What kind of change',
      examples: [
        'inserted allotments today',
        'updated reservations last week',
        'deleted records by Mayank'
      ]
    },
    {
      title: 'When',
      examples: [
        'allotment changes today',
        'reservation changes yesterday',
        'allotment updates last 7 days',
        'from 01-09-2026 to 03-09-2026',
        'on 03-09-2026'
      ]
    },
    {
      title: 'Driver name or mobile in the change',
      examples: [
        'Old Driver',
        'New Driver',
        '9876543210 (a driver mobile that appears in Details)'
      ]
    }
  ];

  constructor(public dialogRef: MatDialogRef<AuditNlpQuestionsDialogComponent>) {}
}
