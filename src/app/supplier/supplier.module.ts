// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierComponent } from './supplier.component';
import { FormDialogComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { SupplierService } from './supplier.service';
import { SupplierRoutingModule } from './supplier-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { SupplierStatusComponent } from './dialogs/supplier-status/supplier-status.component';
import { SupplierActivationStatusHistoryService } from '../supplierActivationStatusHistory/supplierActivationStatusHistory.service';
//import { SupplierVerificationStatusHistory } from '../supplierVerificationStatusHistory/supplierVerificationStatusHistory.model';
import { SupplierVerificationStatusHistoryService } from '../supplierVerificationStatusHistory/supplierVerificationStatusHistory.service';
import { VerificationstatusComponent } from './dialogs/verification-status/verification-status.component';
// import { TwoDigitDecimaNumberDirective } from './twodigitdecimalnumber.directive';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SupplierComponent,
    advanceTableForm,
    DeleteDialogComponent,
    SupplierStatusComponent,
    VerificationstatusComponent
  ],
  imports: [
    MatTooltipModule,
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    SupplierRoutingModule,
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
    MyUploadModule,
    //TwoDigitDecimaNumberDirective
  ],
  providers: [SupplierService,SupplierActivationStatusHistoryService,SupplierVerificationStatusHistoryService]
})
export class SupplierModule {}


