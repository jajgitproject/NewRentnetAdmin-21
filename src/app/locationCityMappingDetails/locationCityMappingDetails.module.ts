// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationCityMappingDetailsComponent } from './locationCityMappingDetails.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { UnmapDialogComponent } from './dialogs/unmap/unmap.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocationCityMappingService } from '../locationCityMapping/locationCityMapping.service';
import { LocationCityMappingDetailsRoutingModule } from './locationCityMappingDetails-routing.module';

@NgModule({
  declarations: [
    LocationCityMappingDetailsComponent,
    FormDialogComponent,
    UnmapDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LocationCityMappingDetailsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  providers: [LocationCityMappingService]
})
export class LocationCityMappingDetailsModule {}
