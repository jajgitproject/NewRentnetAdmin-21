// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VendorMisRoutingModule } from './vendorMis-routing.module';
import { VendorMisComponent } from './vendorMis.component';
import { VendorMisService } from './vendorMis.service';

@NgModule({
  declarations: [VendorMisComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VendorMisRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  providers: [VendorMisService]
})
export class VendorMisModule {}
