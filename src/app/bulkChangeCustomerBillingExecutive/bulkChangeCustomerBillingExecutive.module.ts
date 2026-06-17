// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BulkChangeCustomerBillingExecutiveComponent } from './bulkChangeCustomerBillingExecutive.component';
import { ChangeBillingExecutiveDialogComponent } from './dialogs/change-billing-executive-dialog/change-billing-executive-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { BulkChangeCustomerBillingExecutiveService } from './bulkChangeCustomerBillingExecutive.service';
import { BulkChangeCustomerBillingExecutiveRoutingModule } from './bulkChangeCustomerBillingExecutive-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    BulkChangeCustomerBillingExecutiveComponent,
    ChangeBillingExecutiveDialogComponent
  ],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BulkChangeCustomerBillingExecutiveRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatSortModule,
    MatMenuModule
  ],
  providers: [BulkChangeCustomerBillingExecutiveService]
})
export class BulkChangeCustomerBillingExecutiveModule {}
