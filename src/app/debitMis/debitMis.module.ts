// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebitMisComponent } from './debitMis.component';
import { DebitMisRoutingModule } from './debitMis-routing.module';
import { DebitMisService } from './debitMis.service';
import { DebitService } from '../debit/debit.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [DebitMisComponent],
  imports: [
    CommonModule,
    FormsModule,
    DebitMisRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSortModule,
    MatTooltipModule,
  ],
  providers: [DebitMisService, DebitService, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class DebitMisModule {}