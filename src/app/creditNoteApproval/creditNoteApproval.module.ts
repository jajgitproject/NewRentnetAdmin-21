// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditNoteApprovalComponent } from './creditNoteApproval.component';
import { FormDialogCreditVerificationsComponent } from './dialogs/form-dialog-verifications/form-dialog-verifications.component';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MyUploadModule } from '../myupload/myupload.module';
import { CurrentDesginationModule } from '../currentDesgination/currentDesgination.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreditNoteApprovalService } from './creditNoteApproval.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreditNoteApprovalRoutingModule } from './creditNoteApproval-routing.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@NgModule({
  declarations: [
    CreditNoteApprovalComponent,
    FormDialogCreditVerificationsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
     OwlDateTimeModule,
        OwlNativeDateTimeModule,
    MatTooltipModule,
    ReactiveFormsModule,
    CreditNoteApprovalRoutingModule,
    MatAutocompleteModule,
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
    MatNativeDateModule,
    MatDialogModule,
    MatDividerModule,
    MatSortModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    CurrentDesginationModule
  ],
  providers: [CreditNoteApprovalService],
  exports: [FormDialogCreditVerificationsComponent]   // ✅ export kiya
})
export class CreditNoteApprovalModule {}



