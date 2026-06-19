// @ts-nocheck

import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



export interface BackfillStepDialogData {

  message: string;

  title?: string;

}



@Component({

  standalone: false,

  selector: 'app-backfill-step-dialog',

  template: `

    <h2 mat-dialog-title>{{ data.title || 'PDF archive step' }}</h2>

    <mat-dialog-content>

      <p class="step-message">{{ data.message }}</p>

    </mat-dialog-content>

    <mat-dialog-actions align="end">

      <button mat-raised-button color="primary" type="button" (click)="close()">OK</button>

    </mat-dialog-actions>

  `,

  styles: [

    `

      .step-message {

        font-family: Consolas, 'Courier New', monospace;

        font-size: 14px;

        margin: 0;

        white-space: pre-wrap;

      }

    `,

  ],

})

export class BackfillStepDialogComponent {

  constructor(

    public dialogRef: MatDialogRef<BackfillStepDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: BackfillStepDialogData

  ) {}



  close(): void {

    this.dialogRef.close();

  }

}


