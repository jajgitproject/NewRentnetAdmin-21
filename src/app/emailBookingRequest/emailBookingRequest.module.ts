import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EmailBookingRequestComponent } from './emailBookingRequest.component';
import { EmailBookingRequestRoutingModule } from './emailBookingRequest-routing.module';
import { EmailBookingRequestService } from './emailBookingRequest.service';

@NgModule({
  declarations: [EmailBookingRequestComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailBookingRequestRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [EmailBookingRequestService]
})
export class EmailBookingRequestModule {}
