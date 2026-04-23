// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDialogGIComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { GooglePlaceModule } from '@compat/google-places-shim';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DispatchFetchDataService } from '../dispatchFetchData/dispatchFetchData.service';
import { FetchDataFromGPSComponent } from './dialogs/fetch-data-from-gps/fetch-data-from-gps.component';
import { GarageInRoutingModule } from './garageIn-routing.module';
import { GarageInService } from './garageIn.service';
import { GarageInComponent } from './garageIn.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FetchGarageInAppDataDialogComponent } from './dialogs/fetch-garageIn-app-data/fetch-garageIn-app-data.component';

@NgModule({
  declarations: [
    GarageInComponent,
    advanceTableForm,
    DeleteDialogComponent,
    FetchDataFromGPSComponent,
    FetchGarageInAppDataDialogComponent,
  ],
  imports: [
    GooglePlaceModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    GarageInRoutingModule,
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
    
  ],
  exports: [advanceTableForm],
  providers: [GarageInService]
})
export class GarageInModule {}



