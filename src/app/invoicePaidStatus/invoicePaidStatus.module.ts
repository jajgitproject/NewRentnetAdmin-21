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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InvoicePaidStatusComponent } from './invoicePaidStatus.component';
import { InvoicePaidStatusHistoryDialogComponent } from './invoicePaidStatusHistoryDialog.component';
import { InvoicePaidStatusRoutingModule } from './invoicePaidStatus-routing.module';
import { InvoicePaidStatusService } from './invoicePaidStatus.service';

@NgModule({
  declarations: [InvoicePaidStatusComponent, InvoicePaidStatusHistoryDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InvoicePaidStatusRoutingModule,
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
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  providers: [InvoicePaidStatusService],
})
export class InvoicePaidStatusModule {}
