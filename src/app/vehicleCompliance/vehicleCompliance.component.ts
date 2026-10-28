// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from '../general/general.service';
import { VehicleComplianceService } from './vehicleCompliance.service';
import {
  VehicleComplianceActionLabels,
  VehicleComplianceActions,
  VehicleCompliancePage,
  VehicleComplianceSummary,
} from './vehicleCompliance.model';

@Component({
  standalone: false,
  selector: 'app-vehicle-compliance',
  templateUrl: './vehicleCompliance.component.html',
  styleUrls: ['./vehicleCompliance.component.sass'],
})
export class VehicleComplianceComponent implements OnInit {
  inventoryID: number;
  inventoryName: string;
  page: VehicleCompliancePage | null = null;
  summary: VehicleComplianceSummary | null = null;
  complianceForm: FormGroup;
  actionOptions = VehicleComplianceActionLabels;
  saveInProgress = false;
  imagePaths: string[] = [];

  summaryCards: { key: string; label: string; value: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private vehicleComplianceService: VehicleComplianceService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {
    this.complianceForm = this.fb.group({ rows: this.fb.array([]) });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const encryptedInventoryID = params.InventoryID;
      const encryptedInventoryName = params.RegNo;
      this.inventoryID = Number(this.generalService.decrypt(decodeURIComponent(encryptedInventoryID)));
      this.inventoryName = this.generalService.decrypt(decodeURIComponent(encryptedInventoryName));
      this.loadPage();
    });
  }

  get rows(): FormArray {
    return this.complianceForm.get('rows') as FormArray;
  }

  loadPage(): void {
    if (!this.inventoryID) {
      return;
    }
    this.vehicleComplianceService.getPage(this.inventoryID).subscribe(
      (data) => {
        this.bindPage(new VehicleCompliancePage(data));
      },
      () => {
        this.page = null;
        this.summary = null;
        this.rows.clear();
        this.showNotification('snackbar-danger', 'Failed to load vehicle compliance.', 'bottom', 'center');
      }
    );
  }

  bindPage(page: VehicleCompliancePage): void {
    this.page = page;
    this.summary = page.summary;
    this.updateSummaryCards();
    this.rows.clear();
    this.imagePaths = [];
    page.rows.forEach((row, index) => {
      this.rows.push(this.createRowGroup(row));
      this.imagePaths[index] = row.documentImage || '';
      this.syncRowState(this.rows.at(index) as FormGroup);
    });
  }

  updateSummaryCards(): void {
    const s = this.summary;
    this.summaryCards = [
      { key: 'mandatory', label: 'Mandatory', value: s?.mandatory ?? 0 },
      { key: 'complete', label: 'Complete', value: s?.complete ?? 0 },
      { key: 'missing', label: 'Missing', value: s?.missing ?? 0 },
      { key: 'approvedQC', label: 'Approved QC', value: s?.approvedQC ?? 0 },
      { key: 'rejectedQC', label: 'Rejected QC', value: s?.rejectedQC ?? 0 },
      { key: 'pendingQC', label: 'Pending QC', value: s?.pendingQC ?? 0 },
      { key: 'expiringSoon', label: 'Expiring soon', value: s?.expiringSoon ?? 0 },
    ];
  }

  createRowGroup(row: any): FormGroup {
    const defaultAction =
      row.defaultAction ||
      (row.hasApplicableRecord ? VehicleComplianceActions.editCurrent : VehicleComplianceActions.addNewInfo);
    return this.fb.group({
      action: [defaultAction],
      documentID: [row.documentID],
      documentName: [row.documentName],
      documentType: [row.documentType],
      isMandatory: [row.isMandatory],
      hasApplicableRecord: [row.hasApplicableRecord],
      isEditable: [row.isEditable !== false],
      inventoryDocumentID: [row.inventoryDocumentID ?? -1],
      documentNumber: [row.documentNumber ?? ''],
      documentIssuingAuthority: [row.documentIssuingAuthority ?? ''],
      documentImage: [row.documentImage ?? ''],
      documentImageNonAvailabilityReason: [row.documentImageNonAvailabilityReason ?? ''],
      documentStartDate: [row.documentStartDate ?? null],
      documentExpiry: [row.documentExpiry ?? null, Validators.required],
      activationStatus: [row.activationStatus ?? true],
      verified: [row.verified ?? ''],
      verifiedBy: [row.verifiedBy ?? ''],
      verificationRemark: [row.verificationRemark ?? ''],
      verificationDate: [row.verificationDate ?? ''],
    });
  }

  onActionChange(index: number): void {
    const group = this.rows.at(index) as FormGroup;
    this.syncRowState(group);
    this.syncReasonValidators(group);
  }

  syncRowState(group: FormGroup): void {
    const action = group.get('action')?.value;
    const skip = action === VehicleComplianceActions.doNotAddInfo;
    const editLocked =
      action === VehicleComplianceActions.editCurrent && group.get('isEditable')?.value === false;
    const readOnly = skip || editLocked;
    const fieldNames = [
      'documentNumber',
      'documentIssuingAuthority',
      'documentImage',
      'documentImageNonAvailabilityReason',
      'documentStartDate',
      'documentExpiry',
    ];
    fieldNames.forEach((name) => {
      const control = group.get(name);
      if (!control) {
        return;
      }
      if (readOnly) {
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }
    });
    if (skip) {
      group.get('documentExpiry')?.clearValidators();
    } else {
      group.get('documentExpiry')?.setValidators([Validators.required]);
    }
    group.get('documentExpiry')?.updateValueAndValidity({ emitEvent: false });
  }

  syncReasonValidators(group: FormGroup): void {
    const action = group.get('action')?.value;
    if (action === VehicleComplianceActions.doNotAddInfo) {
      group.get('documentImageNonAvailabilityReason')?.clearValidators();
      group.get('documentImageNonAvailabilityReason')?.updateValueAndValidity({ emitEvent: false });
      return;
    }
    const image = group.get('documentImage')?.value;
    const reasonControl = group.get('documentImageNonAvailabilityReason');
    if (!image?.trim()) {
      reasonControl?.setValidators([Validators.required]);
    } else {
      reasonControl?.clearValidators();
    }
    reasonControl?.updateValueAndValidity({ emitEvent: false });
  }

  uploadFinished(index: number, event: any): void {
    const path = this.generalService.getImageURL() + event.dbPath;
    this.imagePaths[index] = path;
    const group = this.rows.at(index) as FormGroup;
    group.patchValue({ documentImage: path });
    this.syncReasonValidators(group);
  }

  onReasonChange(index: number): void {
    this.syncReasonValidators(this.rows.at(index) as FormGroup);
  }

  saveAll(): void {
    if (this.saveInProgress) {
      return;
    }

    let invalid = false;
    this.rows.controls.forEach((control) => {
      const group = control as FormGroup;
      this.syncReasonValidators(group);
      const action = group.get('action')?.value;
      if (action === VehicleComplianceActions.doNotAddInfo) {
        return;
      }
      group.markAllAsTouched();
      if (group.invalid) {
        invalid = true;
      }
    });

    if (invalid) {
      this.showNotification('snackbar-danger', 'Fix validation errors before saving.', 'bottom', 'center');
      return;
    }

    const payloadRows = this.rows.controls
      .map((control) => {
        const group = control as FormGroup;
        const raw = group.getRawValue();
        const action = raw.action;
        if (action === VehicleComplianceActions.doNotAddInfo) {
          return null;
        }
        const document = {
          inventoryDocumentID:
            action === VehicleComplianceActions.addNewInfo ? -1 : raw.inventoryDocumentID,
          inventoryID: this.inventoryID,
          documentID: raw.documentID,
          documentNumber: raw.documentNumber,
          documentIssuingAuthority: raw.documentIssuingAuthority,
          documentImage: raw.documentImage,
          documentImageNonAvailabilityReason: raw.documentImageNonAvailabilityReason,
          documentStartDate: raw.documentStartDate,
          documentExpiry: raw.documentExpiry,
          activationStatus: raw.activationStatus,
          verified: raw.verified || 'true',
        };
        return { action, document };
      })
      .filter(Boolean);

    if (payloadRows.length === 0) {
      this.showNotification('snackbar-danger', 'Nothing to save.', 'bottom', 'center');
      return;
    }

    this.saveInProgress = true;
    this.vehicleComplianceService.saveBulk(this.inventoryID, payloadRows).subscribe(
      (response) => {
        this.saveInProgress = false;
        const pageData = response?.page ?? response?.Page;
        if (pageData) {
          this.bindPage(new VehicleCompliancePage(pageData));
        } else {
          this.loadPage();
        }
        const success = response?.success ?? response?.Success;
        const message = response?.message ?? response?.Message;
        if (success) {
          this.showNotification('snackbar-success', message || 'Saved successfully.', 'bottom', 'center');
        } else {
          this.showNotification('snackbar-danger', message || 'Some rows could not be saved.', 'bottom', 'center');
        }
      },
      () => {
        this.saveInProgress = false;
        this.showNotification('snackbar-danger', 'Save failed.', 'bottom', 'center');
      }
    );
  }

  qcStatusLabel(row: FormGroup): string {
    return this.qcStatusText(this.qcStatusKey(row));
  }

  qcStatusIcon(row: FormGroup): string {
    switch (this.qcStatusKey(row)) {
      case 'approved':
        return 'check_circle';
      case 'rejected':
        return 'cancel';
      case 'pending':
        return 'schedule';
      default:
        return 'radio_button_unchecked';
    }
  }

  qcStatusClass(row: FormGroup): string {
    return 'qc-icon qc-icon--' + this.qcStatusKey(row);
  }

  private qcStatusKey(row: FormGroup): string {
    const verified = (row.get('verified')?.value || '').toString();
    if (verified === 'Verified' || verified === 'true') {
      return 'approved';
    }
    if (verified === 'Rejected' || verified === 'false') {
      return 'rejected';
    }
    if (row.get('hasApplicableRecord')?.value) {
      return 'pending';
    }
    return 'na';
  }

  private qcStatusText(key: string): string {
    switch (key) {
      case 'approved':
        return 'Approved QC';
      case 'rejected':
        return 'Rejected QC';
      case 'pending':
        return 'Pending QC';
      default:
        return 'No applicable document';
    }
  }

  showNotification(colorName, text, placementFrom, placementAlign): void {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
