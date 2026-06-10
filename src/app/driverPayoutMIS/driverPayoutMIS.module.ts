// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DriverPayoutMISComponent } from './driverPayoutMIS.component';
import { DriverPayoutMISRoutingModule } from './driverPayoutMIS-routing.module';
import { DriverPayoutMISService } from './driverPayoutMIS.service';

@NgModule({
  declarations: [DriverPayoutMISComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DriverPayoutMISRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSortModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  providers: [DriverPayoutMISService]
})
export class DriverPayoutMISModule {}
