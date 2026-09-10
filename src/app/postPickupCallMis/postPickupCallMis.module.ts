// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostPickupCallMisComponent } from './postPickupCallMis.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { PostPickupCallMisService } from './postPickupCallMis.service';
import { PostPickupCallMisRoutingModule } from './postPickupCallMis-routing.module';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [PostPickupCallMisComponent],
  imports: [
    CommonModule,
    FormsModule,
    PostPickupCallMisRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatSelectModule
  ],
  providers: [
    PostPickupCallMisService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class PostPickupCallMisModule {}
