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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SupplierPayoutComponent } from './supplierPayout.component';
import { SupplierPayoutRoutingModule } from './supplierPayout-routing.module';
import { SupplierPayoutService } from './supplierPayout.service';

@NgModule({
  declarations: [SupplierPayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SupplierPayoutRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [SupplierPayoutService],
})
export class SupplierPayoutModule {}
