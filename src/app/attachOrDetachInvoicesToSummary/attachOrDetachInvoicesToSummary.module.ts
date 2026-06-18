// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttachOrDetachInvoicesToSummaryComponent } from './attachOrDetachInvoicesToSummary.component';
import { AttachOrDetachInvoicesToSummaryRoutingModule } from './attachOrDetachInvoicesToSummary-routing.module';
import { AttachOrDetachInvoicesToSummaryService } from './attachOrDetachInvoicesToSummary.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [AttachOrDetachInvoicesToSummaryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AttachOrDetachInvoicesToSummaryRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule
  ],
  providers: [AttachOrDetachInvoicesToSummaryService]
})
export class AttachOrDetachInvoicesToSummaryModule {}
