// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SummaryOfDutyComponent } from './summary-of-duty.component';
import { SummaryOfDutyDialogComponent } from './summary-of-duty-dialog.component';

@NgModule({
  declarations: [SummaryOfDutyComponent, SummaryOfDutyDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  exports: [SummaryOfDutyComponent, SummaryOfDutyDialogComponent]
})
export class SummaryOfDutyModule {}
