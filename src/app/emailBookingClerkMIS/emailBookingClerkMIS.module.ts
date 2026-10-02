import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EmailBookingClerkMISComponent } from './emailBookingClerkMIS.component';
import { EmailBookingClerkMISRoutingModule } from './emailBookingClerkMIS-routing.module';
import { EmailBookingRequestService } from '../emailBookingRequest/emailBookingRequest.service';

@NgModule({
  declarations: [EmailBookingClerkMISComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmailBookingClerkMISRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [EmailBookingRequestService]
})
export class EmailBookingClerkMISModule {}
