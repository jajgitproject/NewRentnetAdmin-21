// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QcMisCSTComponent } from './qcMisCst.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StoredMisExportsComponent } from '../general/stored-mis-exports.component';
import { QcMisCSTService } from './qcMisCst.service';
import { QcMisCSTRoutingModule } from './qcMisCst-routing.module';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [QcMisCSTComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QcMisCSTRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatTooltipModule,
    MatProgressBarModule,
    StoredMisExportsComponent
  ],
  providers: [
    QcMisCSTService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class QcMisCSTModule {}
