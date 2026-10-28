// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleComplianceRoutingModule } from './vehicleCompliance-routing.module';
import { VehicleComplianceComponent } from './vehicleCompliance.component';
import { VehicleComplianceService } from './vehicleCompliance.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyUploadModule } from '../myupload/myupload.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [VehicleComplianceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VehicleComplianceRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
    MyUploadModule,
  ],
  providers: [VehicleComplianceService, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class VehicleComplianceModule {}
