// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDialogComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
import { FormDialogVerificationsComponent } from '../driverDocumentVerification/dialogs/form-dialog-verifications/form-dialog-verifications.component';
import { MatTableModule } from '@angular/material/table';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MyUploadModule } from '../myupload/myupload.module';
import { DriverDocumentService } from './driverDocument.service';
import { DriverDocumentVerificationService } from '../driverDocumentVerification/driverDocumentVerification.service';

/** Dialogs opened from driver document (and related features) with full Material + modal styles. */
@NgModule({
  declarations: [advanceTableForm, FormDialogVerificationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
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
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MyUploadModule,
  ],
  providers: [DriverDocumentService, DriverDocumentVerificationService],
  exports: [advanceTableForm, FormDialogVerificationsComponent],
})
export class DriverDocumentSharedModule {}
