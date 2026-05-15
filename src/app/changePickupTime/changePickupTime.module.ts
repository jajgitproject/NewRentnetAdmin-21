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
import { MatMenuModule } from '@angular/material/menu';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { AdvanceService } from '../advance/advance.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GeneralService } from '../general/general.service';
import { ChangePickupTimeRoutingModule } from './changePickupTime-routing.module';
import { ChangePickupTimeComponent } from './changePickupTime.component';
import { ChangePickupTimeService } from './changePickupTime.service';
import { editPickupTimeFormDialogComponent } from './dialogs/dialogDetails/dialogDetails.component';

import { GooglePlaceModule } from '@compat/google-places-shim';
@NgModule({
  declarations: [
    editPickupTimeFormDialogComponent,
    ChangePickupTimeComponent
  ],
  imports: [
    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChangePickupTimeRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    MatAutocompleteModule,
    GooglePlaceModule
  ],
  exports: [ChangePickupTimeComponent, editPickupTimeFormDialogComponent],
  providers: [ChangePickupTimeService]
})
export class ChangePickupTimeModule {}


