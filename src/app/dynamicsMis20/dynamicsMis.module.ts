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
import { DynamicsMis20Component } from './dynamicsMis.component';
import { DynamicsMis20RoutingModule } from './dynamicsMis-routing.module';
import { DynamicsMis20Service } from './dynamicsMis.service';

@NgModule({
  declarations: [DynamicsMis20Component],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicsMis20RoutingModule,
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
  providers: [DynamicsMis20Service]
})
export class DynamicsMis20Module {}
