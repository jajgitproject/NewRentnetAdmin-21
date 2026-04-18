// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DispatchByExecutiveComponent } from './dispatchByExecutive.component';
import { FormDialogDBEComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
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
import { DispatchByExecutiveService } from './dispatchByExecutive.service';
import { DispatchByExecutiveRoutingModule } from './dispatchByExecutive-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DispatchFetchDataService } from '../dispatchFetchData/dispatchFetchData.service';
import { FetchDataFromGPSComponent } from './dialogs/fetch-data-from-gps/fetch-data-from-gps.component';
@NgModule({
  declarations: [
    DispatchByExecutiveComponent,
    advanceTableForm,
    DeleteDialogComponent,
    FetchDataFromGPSComponent
  ],
  imports: [
    GooglePlaceModule,
    MatAutocompleteModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DispatchByExecutiveRoutingModule,
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
    MaterialFileInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    MatAutocompleteModule,
    
  ],
  exports: [advanceTableForm],
  providers: [DispatchByExecutiveService,DispatchFetchDataService]
})
export class DispatchByExecutiveModule {}



