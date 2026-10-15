// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SendVendorClosingDataComponent } from './sendVendorClosingData.component';
import { SendVendorClosingDataRoutingModule } from './sendVendorClosingData-routing.module';
import { SendVendorClosingDataService } from './sendVendorClosingData.service';
import { VendorClosingPayloadDialogComponent } from './vendor-closing-payload-dialog.component';
import { CloseDutyCompareModule } from '../shared/close-duty-compare.module';

@NgModule({
  declarations: [SendVendorClosingDataComponent, VendorClosingPayloadDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    SendVendorClosingDataRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatAutocompleteModule,
    CloseDutyCompareModule
  ],
  providers: [SendVendorClosingDataService]
})
export class SendVendorClosingDataModule {}
