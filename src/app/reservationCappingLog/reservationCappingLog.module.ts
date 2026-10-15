// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationCappingLogComponent } from './reservationCappingLog.component';
import { ReservationCappingLogRoutingModule } from './reservationCappingLog-routing.module';
import { ReservationCappingLogService } from './reservationCappingLog.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ReservationCappingLogComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReservationCappingLogRoutingModule,
    MatTableModule,
    MatButtonModule
  ],
  providers: [ReservationCappingLogService]
})
export class ReservationCappingLogModule {}
