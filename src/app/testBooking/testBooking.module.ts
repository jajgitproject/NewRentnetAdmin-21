// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestBookingComponent } from './testBooking.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TestBookingService } from './testBooking.service';
import { TestBookingRoutingModule } from './testBooking-routing.module';
import { ReservationModule } from '../reservation/reservation.module';
import { ReservationGroupService } from '../reservationGroup/reservationGroup.service';
import { ReservationGroupDetailsService } from '../reservationGroupDetails/reservationGroupDetails.service';
import { AllotCarAndDriverService } from '../allotCarAndDriver/allotCarAndDriver.service';
import { DriverService } from '../driver/driver.service';
import { DriverInventoryAssociationService } from '../driverInventoryAssociation/driverInventoryAssociation.service';

@NgModule({
  declarations: [
    TestBookingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestBookingRoutingModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReservationModule
  ],
  providers: [
    TestBookingService,
    ReservationGroupService,
    ReservationGroupDetailsService,
    AllotCarAndDriverService,
    DriverService,
    DriverInventoryAssociationService,
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ]
})
export class TestBookingModule {}
