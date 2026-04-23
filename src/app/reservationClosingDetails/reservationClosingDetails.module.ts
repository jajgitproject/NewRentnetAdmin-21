// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationClosingDetailsComponent } from './reservationClosingDetails.component';
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
import { ReservationClosingDetailsService } from './reservationClosingDetails.service';
import { ReservationClosingDetailsRoutingModule } from './reservationClosingDetails-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { AdvanceService } from '../advance/advance.service';
import { FormDialogRDComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReservationModule } from '../reservation/reservation.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { LocationDetailsDialogComponent } from './dialogs/locationDetails-dialog/locationDetails-dialog.component';

@NgModule({
  declarations: [
    ReservationClosingDetailsComponent,
    advanceTableForm,
    DeleteDialogComponent,
    LocationDetailsDialogComponent
  ],
  imports: [
    MatExpansionModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReservationClosingDetailsRoutingModule,
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
    ReservationModule
  ],
  exports:[ReservationClosingDetailsComponent],
  providers: [ReservationClosingDetailsService]
})
export class ReservationClosingDetailsModule {}


