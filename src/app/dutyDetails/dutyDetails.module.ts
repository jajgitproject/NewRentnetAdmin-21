// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DutyDetailsComponent } from './dutyDetails.component';

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
import { DutyDetailsService } from './dutyDetails.service';
import { DutyDetailsRoutingModule } from './dutyDetails-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { AddPassengersService } from '../addPassengers/addPassengers.service';
import { StopsPopupService } from '../stopsPopup/stopsPopup.service';
import { AddStopService } from '../addStop/addStop.service';
import { PickupDetailsService } from '../pickupDetails/pickupDetails.service';
import { DropOffDetailsService } from '../dropOffDetails/dropOffDetails.service';
@NgModule({
  declarations: [
    DutyDetailsComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DutyDetailsRoutingModule,
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
    MyUploadModule
  ],
  exports:[DutyDetailsComponent],
  providers: [DutyDetailsService,AddPassengersService,StopsPopupService,AddStopService,PickupDetailsService,DropOffDetailsService]
})
export class DutyDetailsModule {}


