// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvoiceSyncDetailsDialogComponent } from './invoice-sync-details-dialog.component';
import { DynamicsRequestPayloadDialogComponent } from './dynamics-request-payload-dialog.component';
import { SendDataToDynamicsService } from '../sendDataToDynamics.service';
import { SendCreditNotesToDynamicsService } from '../../sendCreditNotesToDynamics/sendCreditNotesToDynamics.service';

@NgModule({
  declarations: [InvoiceSyncDetailsDialogComponent, DynamicsRequestPayloadDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  exports: [InvoiceSyncDetailsDialogComponent, DynamicsRequestPayloadDialogComponent],
  providers: [SendDataToDynamicsService, SendCreditNotesToDynamicsService]
})
export class InvoiceSyncDetailsDialogModule {}
