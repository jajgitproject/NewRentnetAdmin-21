// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingScreenComponent } from './bookingScreen.component';
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
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from '@compat/material-file-input-shim';
import { MatMenuModule } from '@angular/material/menu';
import { BookingScreenService } from './bookingScreen.service';
import { BookingScreenRoutingModule } from './bookingScreen-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReservationModule } from '../reservation/reservation.module';
import { ReservationComponent } from '../reservation/reservation.component';
import { CustomerDepartmentService } from '../customerDepartment/customerDepartment.service';
import { CustomerDesignationService } from '../customerDesignation/customerDesignation.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
//import { CustomerSpecificDialogComponent } from '../customerSpecificFields/dialogs/customer-specific-dialog/customer-specific-dialog.component';

@NgModule({
  declarations: [
    BookingScreenComponent
  ],
  imports: [  
    MatAutocompleteModule,
    MatExpansionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookingScreenRoutingModule,
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
    ReservationModule,
    MatDialogModule
  ],
  providers: [BookingScreenService,CustomerDepartmentService,CustomerDesignationService,
    {
      provide: MatDialogRef,
      useValue: {}
    },]
})
export class BookingScreenModule {}


