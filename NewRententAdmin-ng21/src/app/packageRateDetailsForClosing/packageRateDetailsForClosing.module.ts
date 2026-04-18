// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from '@compat/material-file-input-shim';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PackageRateDetailsForClosingComponent } from './packageRateDetailsForClosing.component';
import { PackageRateDetailsForClosingRoutingModule } from './packageRateDetailsForClosing-routing.module';
import { PackageRateDetailsForClosingService } from './packageRateDetailsForClosing.service';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    PackageRateDetailsForClosingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MaterialFileInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    PackageRateDetailsForClosingRoutingModule,
    MatSnackBarModule,
    MatExpansionModule
  ],
  exports:[PackageRateDetailsForClosingComponent],
  providers: [PackageRateDetailsForClosingService]
})

export class PackageRateDetailsForClosingModule {}


