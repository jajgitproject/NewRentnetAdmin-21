// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContractTariffVerificationComponent } from './contractTariffVerification.component';
import { ContractTariffVerificationRoutingModule } from './contractTariffVerification-routing.module';
import { ContractTariffVerificationService } from './contractTariffVerification.service';
import { VerificationHistoryDialogComponent } from './dialogs/verification-history-dialog/verification-history-dialog.component';
import { RateRowDetailsDialogComponent } from './dialogs/rate-row-details-dialog/rate-row-details-dialog.component';

@NgModule({
  declarations: [
    ContractTariffVerificationComponent,
    VerificationHistoryDialogComponent,
    RateRowDetailsDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContractTariffVerificationRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  providers: [ContractTariffVerificationService],
})
export class ContractTariffVerificationModule {}
