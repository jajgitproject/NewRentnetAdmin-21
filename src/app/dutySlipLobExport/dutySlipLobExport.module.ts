// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DutySlipLobExportRoutingModule } from './dutySlipLobExport-routing.module';
import { DutySlipLobExportComponent } from './dutySlipLobExport.component';
import { DutySlipLobExportService } from './dutySlipLobExport.service';

@NgModule({
  declarations: [DutySlipLobExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DutySlipLobExportRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [DutySlipLobExportService],
})
export class DutySlipLobExportModule {}
