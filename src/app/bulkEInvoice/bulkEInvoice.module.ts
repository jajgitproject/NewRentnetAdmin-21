// @ts-nocheck

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatNativeDateModule } from '@angular/material/core';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { BulkEInvoiceRoutingModule } from './bulkEInvoice-routing.module';

import { BulkEInvoiceComponent } from './bulkEInvoice.component';

import { BulkEInvoiceService } from './bulkEInvoice.service';



@NgModule({

  declarations: [BulkEInvoiceComponent],

  imports: [

    CommonModule,

    FormsModule,

    ReactiveFormsModule,

    BulkEInvoiceRoutingModule,

    MatTableModule,

    MatFormFieldModule,

    MatInputModule,

    MatButtonModule,

    MatDatepickerModule,

    MatNativeDateModule,

    MatSnackBarModule,

    MatProgressBarModule,

    MatAutocompleteModule,

  ],

  providers: [BulkEInvoiceService],

})

export class BulkEInvoiceModule {}

