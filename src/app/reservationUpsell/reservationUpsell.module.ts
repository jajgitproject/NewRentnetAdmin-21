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
import { ReservationUpsellService } from './reservationUpsell.service';
import { UpsellFlowDialogComponent } from './dialogs/upsell-flow-dialog/upsell-flow-dialog.component';
import { CancelUpsellDialogComponent } from './dialogs/cancel-upsell-dialog/cancel-upsell-dialog.component';

@NgModule({
  declarations: [UpsellFlowDialogComponent, CancelUpsellDialogComponent],
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
    MatSnackBarModule
  ],
  providers: [ReservationUpsellService],
  exports: [UpsellFlowDialogComponent, CancelUpsellDialogComponent]
})
export class ReservationUpsellModule {}
