// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorContractLocalRateComponent } from './vendorContractLocalRate.component';
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
import { VendorContractLocalRateService } from './vendorContractLocalRate.service';
import { VendorContractLocalRateRoutingModule } from './vendorContractLocalRate-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { TwoDigitDecimaNumberDirective } from './twodigitdecimalnumber.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VendorLocalFixedDetails } from './dialogs/vendorFixedDetails/vendorFixedDetails.component';
import { RateViewForVendorLocalService } from '../rateViewForVendorLocal/rateViewForVendorLocal.service';


@NgModule({
  declarations: [
    VendorContractLocalRateComponent,
    advanceTableForm,
    DeleteDialogComponent,
    VendorLocalFixedDetails
  ],
  imports: [
    MatAutocompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VendorContractLocalRateRoutingModule,
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
    //TwoDigitDecimaNumberDirective,
    MatTooltipModule
  ],
  providers: [VendorContractLocalRateService,RateViewForVendorLocalService]
})
export class VendorContractLocalRateModule {}



