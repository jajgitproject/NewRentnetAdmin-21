// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ComplianceMonitorComponent } from './complianceMonitor.component';
import { ComplianceMonitorRoutingModule } from './complianceMonitor-routing.module';
import { ComplianceMonitorService } from './complianceMonitor.service';
import { DriverDocumentSharedModule } from '../driverDocument/driver-document-shared.module';
import { InventoryDocumentSharedModule } from '../inventoryDocument/inventory-document-shared.module';

@NgModule({
  declarations: [ComplianceMonitorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ComplianceMonitorRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    DriverDocumentSharedModule,
    InventoryDocumentSharedModule,
  ],
  providers: [ComplianceMonitorService],
})
export class ComplianceMonitorModule {}
