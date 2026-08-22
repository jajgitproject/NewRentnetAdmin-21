import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MarkReadyForBulkBillingRoutingModule } from './markReadyForBulkBilling-routing.module';
import { MarkReadyForBulkBillingComponent } from './markReadyForBulkBilling.component';
import { BulkInvoiceService } from '../bulkInvoice/bulkInvoice.service';

@NgModule({
  declarations: [MarkReadyForBulkBillingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarkReadyForBulkBillingRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
  ],
  providers: [BulkInvoiceService],
})
export class MarkReadyForBulkBillingModule {}
