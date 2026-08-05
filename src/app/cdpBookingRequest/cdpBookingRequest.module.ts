import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { CdpBookingRequestService } from './cdpBookingRequest.service';
import { CdpBookingRequestComponent } from './cdpBookingRequest.component';
import { CdpBookingRequestRoutingModule } from './cdpBookingRequest-routing.module';
import { ClossingOneService } from '../clossingOne/clossingOne.service';

@NgModule({
  declarations: [CdpBookingRequestComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    CdpBookingRequestRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatNativeDateModule
  ],
  providers: [CdpBookingRequestService, ClossingOneService]
})
export class CdpBookingRequestModule {}
