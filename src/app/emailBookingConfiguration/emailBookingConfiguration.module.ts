import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import {
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';

const EMAIL_BOOKING_OWL_FORMATS = {
  parseInput: null,
  fullPickerInput: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  datePickerInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
  timePickerInput: { hour: '2-digit', minute: '2-digit', hour12: false },
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' }
};

import { GooglePlaceModule } from '@compat/google-places-shim';
import { EmailBookingConfigurationComponent } from './emailBookingConfiguration.component';
import { EmailBookingConfigurationRoutingModule } from './emailBookingConfiguration-routing.module';
import { EmailBookingRequestService } from '../emailBookingRequest/emailBookingRequest.service';
import { ReservationService } from '../reservation/reservation.service';
import { FormDialogComponentCustomerPerson } from '../customerPerson/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponentCustomerDepartment } from '../customerDepartment/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponentCustomerDesignation } from '../customerDesignation/dialogs/form-dialog/form-dialog.component';
import { CustomerPersonService } from '../customerPerson/customerPerson.service';
import { CustomerDepartmentService } from '../customerDepartment/customerDepartment.service';
import { CustomerDesignationService } from '../customerDesignation/customerDesignation.service';

@NgModule({
  declarations: [EmailBookingConfigurationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailBookingConfigurationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatDialogModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GooglePlaceModule,
    FormDialogComponentCustomerPerson,
    FormDialogComponentCustomerDepartment,
    FormDialogComponentCustomerDesignation
  ],
  providers: [
    EmailBookingRequestService,
    ReservationService,
    CustomerPersonService,
    CustomerDepartmentService,
    CustomerDesignationService,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
    { provide: OWL_DATE_TIME_FORMATS, useValue: EMAIL_BOOKING_OWL_FORMATS }
  ]
})
export class EmailBookingConfigurationModule {}
