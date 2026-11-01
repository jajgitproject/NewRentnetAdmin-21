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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { KamAddressCorrectionRoutingModule } from './kamAddressCorrection-routing.module';
import { KamAddressCorrectionService } from './kamAddressCorrection.service';
import { KamAddressCorrectionComponent } from './kamAddressCorrection.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { KamAddressCorrectionDialogComponent } from './dialogs/kam-address-correction-dialog/kam-address-correction-dialog.component';
import { ReservationModule } from '../reservation/reservation.module';
import { ReservationGroupDetailsService } from '../reservationGroupDetails/reservationGroupDetails.service';

@NgModule({
  declarations: [
    KamAddressCorrectionComponent,
    KamAddressCorrectionDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    KamAddressCorrectionRoutingModule,
    MatDialogModule,
    MatCardModule,
    ReservationModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatNativeDateModule
  ],
  providers: [KamAddressCorrectionService, ReservationGroupDetailsService]
})
export class KamAddressCorrectionModule {}
