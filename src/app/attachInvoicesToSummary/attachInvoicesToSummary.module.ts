// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttachInvoicesToSummaryComponent } from './attachInvoicesToSummary.component';
import { AttachInvoicesToSummaryRoutingModule } from './attachInvoicesToSummary-routing.module';
import { AttachInvoicesToSummaryService } from './attachInvoicesToSummary.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [AttachInvoicesToSummaryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AttachInvoicesToSummaryRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule
  ],
  providers: [AttachInvoicesToSummaryService]
})
export class AttachInvoicesToSummaryModule {}
