// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FuelEntryVerificationComponent } from './fuelEntryVerification.component';
import { FuelEntryVerificationRoutingModule } from './fuelEntryVerification-routing.module';
import { FuelEntryService } from '../fuelEntry.service';

@NgModule({
  declarations: [FuelEntryVerificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    FuelEntryVerificationRoutingModule,
    MatTableModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  providers: [FuelEntryService],
})
export class FuelEntryVerificationModule {}
