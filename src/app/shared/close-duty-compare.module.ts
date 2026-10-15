// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CloseDutyCompareDialogComponent } from './close-duty-compare-dialog.component';

@NgModule({
  declarations: [CloseDutyCompareDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [CloseDutyCompareDialogComponent]
})
export class CloseDutyCompareModule {}
