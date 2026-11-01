// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { AllotmentHistoryDialogComponent } from './allotmentHistory.component';
import { AllotmentHistoryService } from './allotmentHistory.service';

@NgModule({
  declarations: [AllotmentHistoryDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  exports: [AllotmentHistoryDialogComponent],
  providers: [AllotmentHistoryService]
})
export class AllotmentHistoryModule {}
