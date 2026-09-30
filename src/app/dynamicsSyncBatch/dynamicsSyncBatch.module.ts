import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DynamicsSyncBatchRoutingModule } from './dynamicsSyncBatch-routing.module';
import { DynamicsSyncBatchComponent } from './dynamicsSyncBatch.component';
import { DynamicsSyncBatchService } from './dynamicsSyncBatch.service';
import { BatchDetailsDialogComponent } from './dialogs/batch-details-dialog.component';
import { InvoiceSyncDetailsDialogModule } from '../sendDataToDynamics/dialogs/invoice-sync-details-dialog.module';

@NgModule({
  declarations: [DynamicsSyncBatchComponent, BatchDetailsDialogComponent],
  imports: [
    InvoiceSyncDetailsDialogModule,
    CommonModule,
    FormsModule,
    RouterModule,
    DynamicsSyncBatchRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  providers: [DynamicsSyncBatchService]
})
export class DynamicsSyncBatchModule {}
