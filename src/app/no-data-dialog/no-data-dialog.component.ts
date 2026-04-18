// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-no-data-dialog',
  templateUrl: './no-data-dialog.component.html',
  styleUrls: ['./no-data-dialog.component.scss']
})
export class NoDataDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NoDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  ngOnInit(): void {
  }
   // Close the dialog when the button is clicked
   close(): void {
    this.dialogRef.close();
  }

}


