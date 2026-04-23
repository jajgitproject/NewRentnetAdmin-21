// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClosingDetailShowComponent } from './closingDetailShow.component';

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
import { ClosingDetailShowService } from './closingDetailShow.service';
import { ClosingDetailShowRoutingModule } from './closingDetailShow-routing.module';
import { ImageUploaderComponent } from '../imageUploader/imageUploader.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AddPassengersService } from '../addPassengers/addPassengers.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CurrentDutyService } from '../currentDuty/currentDuty.service';
import { CurrentDutyComponent } from '../currentDuty/currentDuty.component';
import { CurrentDutyModule } from '../currentDuty/currentDuty.module';
import { CustomerInfoComponent } from '../customerInfo/customerInfo.component';
import { CustomerInfoModule } from '../customerInfo/customerInfo.module';
import { CustomerInfoService } from '../customerInfo/customerInfo.service';
import { ReservationClosingDetailsComponent } from '../reservationClosingDetails/reservationClosingDetails.component';
import { ReservationDetailsModule } from '../reservationDetails/reservationDetails.module';
import { ReservationClosingDetailsModule } from '../reservationClosingDetails/reservationClosingDetails.module';
import { ReservationClosingDetailsService } from '../reservationClosingDetails/reservationClosingDetails.service';


@NgModule({
  declarations: [
    ClosingDetailShowComponent,

  ],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClosingDetailShowRoutingModule,
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
    ImageUploaderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CurrentDutyModule,
    CustomerInfoModule,
    ReservationClosingDetailsModule
  
  ],
  exports:[ClosingDetailShowComponent],
  providers: [ClosingDetailShowService]
})
export class ClosingDetailShowModule {}



