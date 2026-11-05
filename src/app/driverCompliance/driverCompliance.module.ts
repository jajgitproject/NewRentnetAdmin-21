// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DriverComplianceRoutingModule } from './driverCompliance-routing.module';
import { DriverComplianceComponent } from './driverCompliance.component';
import { DriverComplianceService } from './driverCompliance.service';
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
import { MatDialogModule } from '@angular/material/dialog';
import { StaticImageComponent } from '../shared/static-image/static-image.component';
import { DriverComplianceImagePreviewDialogComponent } from './dialogs/image-preview-dialog/image-preview-dialog.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DriverDocumentSharedModule } from '../driverDocument/driver-document-shared.module';

@NgModule({
  declarations: [DriverComplianceComponent, DriverComplianceImagePreviewDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DriverComplianceRoutingModule,
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
    MatDialogModule,
    StaticImageComponent,
    MyUploadModule,
    DriverDocumentSharedModule,
  ],
  providers: [DriverComplianceService, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class DriverComplianceModule {}
