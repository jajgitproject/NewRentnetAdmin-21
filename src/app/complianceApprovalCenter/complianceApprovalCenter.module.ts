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
import { ComplianceApprovalCenterComponent } from './complianceApprovalCenter.component';
import { ComplianceApprovalCenterRoutingModule } from './complianceApprovalCenter-routing.module';
import { ComplianceApprovalCenterService } from './complianceApprovalCenter.service';
import { DriverDocumentSharedModule } from '../driverDocument/driver-document-shared.module';
import { InventoryDocumentSharedModule } from '../inventoryDocument/inventory-document-shared.module';
import { DriverDocumentService } from '../driverDocument/driverDocument.service';
import { InventoryDocumentService } from '../inventoryDocument/inventoryDocument.service';

@NgModule({
  declarations: [ComplianceApprovalCenterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ComplianceApprovalCenterRoutingModule,
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
  providers: [ComplianceApprovalCenterService, DriverDocumentService, InventoryDocumentService],
})
export class ComplianceApprovalCenterModule {}
