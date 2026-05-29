// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { TallyMisComponent } from './tallyMis.component';
import { TallyMisRoutingModule } from './tallyMis-routing.module';
import { TallyMisService } from './tallyMis.service';

@NgModule({
  declarations: [TallyMisComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TallyMisRoutingModule,
    MatAutocompleteModule,
    MatTableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatSortModule
  ],
  providers: [TallyMisService]
})
export class TallyMisModule {}
