// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SharedModule } from '../../shared/shared.module';
import { FuelEntryManualComponent } from './fuelEntryManual.component';
import { FuelEntryManualRoutingModule } from './fuelEntryManual-routing.module';
import { FuelEntryService } from '../fuelEntry.service';
import { OdometerResetService } from '../odometerReset.service';

@NgModule({
  declarations: [FuelEntryManualComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    FuelEntryManualRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
  ],
  providers: [FuelEntryService, OdometerResetService],
})
export class FuelEntryManualModule {}
