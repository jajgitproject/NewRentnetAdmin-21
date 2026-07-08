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
import { TallyMis20Component } from './tallyMis.component';
import { TallyMis20RoutingModule } from './tallyMis-routing.module';
import { TallyMis20Service } from './tallyMis.service';

@NgModule({
  declarations: [TallyMis20Component],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TallyMis20RoutingModule,
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
  providers: [TallyMis20Service]
})
export class TallyMis20Module {}
