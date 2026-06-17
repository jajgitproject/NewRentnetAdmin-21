// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BulkChangeCustomerCollectionExecutiveComponent } from './bulkChangeCustomerCollectionExecutive.component';
import { ChangeCollectionExecutiveDialogComponent } from './dialogs/change-collection-executive-dialog/change-collection-executive-dialog.component';
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
import { BulkChangeCustomerCollectionExecutiveService } from './bulkChangeCustomerCollectionExecutive.service';
import { BulkChangeCustomerCollectionExecutiveRoutingModule } from './bulkChangeCustomerCollectionExecutive-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    BulkChangeCustomerCollectionExecutiveComponent,
    ChangeCollectionExecutiveDialogComponent
  ],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BulkChangeCustomerCollectionExecutiveRoutingModule,
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
  providers: [BulkChangeCustomerCollectionExecutiveService]
})
export class BulkChangeCustomerCollectionExecutiveModule {}
