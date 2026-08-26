// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ReservationUpsellService } from './reservationUpsell.service';
import { UpsellFlowDialogComponent } from './dialogs/upsell-flow-dialog/upsell-flow-dialog.component';
import { CancelUpsellDialogComponent } from './dialogs/cancel-upsell-dialog/cancel-upsell-dialog.component';
import { UpsellDeclineLogDialogComponent } from './dialogs/upsell-decline-log-dialog/upsell-decline-log-dialog.component';
import { UpsellHistoryDialogComponent } from './dialogs/upsell-history-dialog/upsell-history-dialog.component';

@NgModule({
  declarations: [
    UpsellFlowDialogComponent,
    CancelUpsellDialogComponent,
    UpsellDeclineLogDialogComponent,
    UpsellHistoryDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  providers: [ReservationUpsellService],
  exports: [
    UpsellFlowDialogComponent,
    CancelUpsellDialogComponent,
    UpsellDeclineLogDialogComponent,
    UpsellHistoryDialogComponent
  ]
})
export class ReservationUpsellModule {}
