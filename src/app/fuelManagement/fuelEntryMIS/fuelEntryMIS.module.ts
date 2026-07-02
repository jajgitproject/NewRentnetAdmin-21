import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';

import { FuelEntryMISComponent } from './fuelEntryMIS.component';
import { FuelEntryMISRoutingModule } from './fuelEntryMIS-routing.module';
import { FuelEntryService } from '../fuelEntry.service';

@NgModule({
  declarations: [FuelEntryMISComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuelEntryMISRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatExpansionModule,
  ],
  providers: [FuelEntryService],
})
export class FuelEntryMISModule {}
