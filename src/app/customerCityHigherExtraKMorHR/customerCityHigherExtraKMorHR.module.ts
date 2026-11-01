// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerCityHigherExtraKMorHRComponent } from './customerCityHigherExtraKMorHR.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomerCityHigherExtraKMorHRService } from './customerCityHigherExtraKMorHR.service';
import { CustomerCityHigherExtraKMorHRRoutingModule } from './customerCityHigherExtraKMorHR-routing.module';

@NgModule({
  declarations: [CustomerCityHigherExtraKMorHRComponent, FormDialogComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerCityHigherExtraKMorHRRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ],
  providers: [CustomerCityHigherExtraKMorHRService]
})
export class CustomerCityHigherExtraKMorHRModule {}
