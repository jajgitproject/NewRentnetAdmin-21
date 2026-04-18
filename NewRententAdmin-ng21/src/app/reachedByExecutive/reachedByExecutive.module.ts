// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReachedByExecutiveComponent } from './reachedByExecutive.component';
import { FormDialogComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
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
import { ReachedByExecutiveService } from './reachedByExecutive.service';
import { ReachedByExecutiveRoutingModule } from './reachedByExecutive-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FetchDataRBEService } from '../fetchDataRBE/fetchDataRBE.service';
import { FetchDataFromGPSComponent } from './dialogs/fetch-data-from-gps/fetch-data-from-gps.component';
import { GooglePlacesOverlayDirective } from './GooglePlacesOverlayDirective';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    ReachedByExecutiveComponent,
    advanceTableForm,
    DeleteDialogComponent,
    FetchDataFromGPSComponent,
    GooglePlacesOverlayDirective
  ],
  imports: [
    GooglePlaceModule,
    OwlDateTimeModule,
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    ReachedByExecutiveRoutingModule,
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
    MyUploadModule
  ],
  exports: [advanceTableForm],
  providers: [ReachedByExecutiveService,FetchDataRBEService]
})
export class ReachedByExecutiveModule {}



