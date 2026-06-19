// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BackfillStepDialogComponent } from './backfill-step-dialog.component';

@NgModule({
  declarations: [BackfillStepDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [BackfillStepDialogComponent],
})
export class BackfillStepDialogModule {}
