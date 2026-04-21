// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierVerificationStatusHistoryComponent } from './supplierVerificationStatusHistory.component';
import { FormDialogComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
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
import { SupplierVerificationStatusHistoryService } from './supplierVerificationStatusHistory.service';
import { SupplierVerificationStatusHistoryRoutingModule } from './supplierVerificationStatusHistory-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewRequiredDocumentsComponent } from './dialogs/viewRequiredDocuments/viewRequiredDocuments.component';
import { SupplierRequiredDocumentService } from '../supplierRequiredDocument/supplierRequiredDocument.service';
import { SupplierRequiredDocumentComponent } from '../supplierRequiredDocument/supplierRequiredDocument.component';
import { ViewUploadedDocumentsComponent } from './dialogs/viewUploadedDocuments/viewUploadedDocuments.component';
import { SupplierVerificationDocumentsService } from '../supplierVerificationDocuments/supplierVerificationDocuments.service';
@NgModule({
  declarations: [
    SupplierVerificationStatusHistoryComponent,
    advanceTableForm,
    DeleteDialogComponent,
    ViewRequiredDocumentsComponent,
    ViewUploadedDocumentsComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    SupplierVerificationStatusHistoryRoutingModule,
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
  providers: [SupplierVerificationStatusHistoryService,SupplierRequiredDocumentService,SupplierVerificationDocumentsService]
})
export class SupplierVerificationStatusHistoryModule {}


