// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../general/general.service';
import { DriverComplianceService } from './driverCompliance.service';
import {
  DriverComplianceActionLabels,
  DriverComplianceActions,
  DriverCompliancePage,
  DriverComplianceSummary,
} from './driverCompliance.model';
import { DriverComplianceImagePreviewDialogComponent } from './dialogs/image-preview-dialog/image-preview-dialog.component';
import { FormDialogVerificationsComponent } from '../driverDocumentVerification/dialogs/form-dialog-verifications/form-dialog-verifications.component';
import { DriverDocumentService } from '../driverDocument/driverDocument.service';

/** Server-loaded document field values restored on Edit / NA (when a record exists). */
interface DriverComplianceRowDocumentSnapshot {
  driverDocumentID: number;
  documentNumber: string;
  documentIssuingAuthority: string;
  documentImage: string;
  documentImageNonAvailabilityReason: string;
  documentStartDate: Date | null;
  documentExpiry: Date | null;
}

@Component({
  standalone: false,
  selector: 'app-driver-compliance',
  templateUrl: './driverCompliance.component.html',
  styleUrls: ['./driverCompliance.component.sass'],
})
export class DriverComplianceComponent implements OnInit {
  driverID: number;
  driverName: string;
  page: DriverCompliancePage | null = null;
  summary: DriverComplianceSummary | null = null;
  complianceForm: FormGroup;
  actionOptions = DriverComplianceActionLabels;
  saveInProgress = false;
  imagePaths: string[] = [];
  imageBroken: boolean[] = [];
  private rowSnapshots: DriverComplianceRowDocumentSnapshot[] = [];
  private rowLastActions: string[] = [];

  summaryCards: { key: string; label: string; value: number; icon: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private driverComplianceService: DriverComplianceService,
    private driverDocumentService: DriverDocumentService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.complianceForm = this.fb.group({ rows: this.fb.array([]) });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const encryptedDriverID = params.DriverID;
      const encryptedDriverName = params.DriverName;
      this.driverID = Number(this.generalService.decrypt(decodeURIComponent(encryptedDriverID)));
      this.driverName = this.generalService.decrypt(decodeURIComponent(encryptedDriverName));
      this.loadPage();
    });
  }

  get rows(): FormArray {
    return this.complianceForm.get('rows') as FormArray;
  }

  loadPage(): void {
    if (!this.driverID) {
      return;
    }
    this.driverComplianceService.getPage(this.driverID).subscribe(
      (data) => {
        this.bindPage(new DriverCompliancePage(data));
      },
      () => {
        this.page = null;
        this.summary = null;
        this.rows.clear();
        this.rowSnapshots = [];
        this.showNotification('snackbar-danger', 'Failed to load vehicle compliance.', 'bottom', 'center');
      }
    );
  }

  bindPage(page: DriverCompliancePage): void {
    this.page = page;
    this.summary = page.summary;
    this.updateSummaryCards();
    this.rows.clear();
    this.imagePaths = [];
    this.imageBroken = [];
    this.rowSnapshots = [];
    this.rowLastActions = [];
    page.rows.forEach((row, index) => {
      this.rowSnapshots.push(this.snapshotFromRow(row));
      this.rowLastActions.push(DriverComplianceActions.doNotAddInfo);
      this.rows.push(this.createRowGroup(row));
      this.imagePaths[index] = row.documentImage || '';
      this.imageBroken[index] = false;
      this.syncRowState(this.rows.at(index) as FormGroup);
    });
  }

  hasDocumentImage(index: number): boolean {
    return !!(this.imagePaths[index] || '').toString().trim();
  }

  isDocumentImageBroken(index: number): boolean {
    return !!this.imageBroken[index];
  }

  onDocumentImageError(index: number): void {
    this.imageBroken[index] = true;
  }

  onDocumentImageLoad(index: number): void {
    this.imageBroken[index] = false;
  }

  updateSummaryCards(): void {
    const s = this.summary;
    this.summaryCards = [
      { key: 'mandatory', label: 'Mandatory', value: s?.mandatory ?? 0, icon: 'assignment_late' },
      { key: 'complete', label: 'Complete', value: s?.complete ?? 0, icon: 'task_alt' },
      { key: 'missing', label: 'Missing', value: s?.missing ?? 0, icon: 'report_problem' },
      { key: 'approvedQC', label: 'Approved QC', value: s?.approvedQC ?? 0, icon: 'verified' },
      { key: 'rejectedQC', label: 'Rejected QC', value: s?.rejectedQC ?? 0, icon: 'block' },
      { key: 'pendingQC', label: 'Pending QC', value: s?.pendingQC ?? 0, icon: 'pending_actions' },
      { key: 'expiringSoon', label: 'Expiring in 10 Days', value: s?.expiringSoon ?? 0, icon: 'event_busy' },
    ];
  }

  createRowGroup(row: any): FormGroup {
    return this.fb.group({
      action: [DriverComplianceActions.doNotAddInfo],
      documentID: [row.documentID],
      documentName: [row.documentName],
      documentType: [row.documentType],
      isMandatory: [row.isMandatory],
      hasApplicableRecord: [row.hasApplicableRecord],
      isEditable: [row.isEditable !== false],
      driverDocumentID: [row.driverDocumentID ?? -1],
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
    const action = group.get('action')?.value;
    const hasApplicableRecord = !!group.get('hasApplicableRecord')?.value;

    if (action === DriverComplianceActions.qc) {
      const restore =
        this.rowLastActions[index] ?? DriverComplianceActions.doNotAddInfo;
      group.patchValue({ action: restore }, { emitEvent: false });
      if (hasApplicableRecord) {
        this.openDriverDocumentQc(index);
      }
      return;
    }

    this.rowLastActions[index] = action;

    if (action === DriverComplianceActions.addNewInfo) {
      this.applyRowDocumentValues(index, this.getEmptyAddPatch());
    } else if (action === DriverComplianceActions.doNotAddInfo) {
      if (hasApplicableRecord) {
        this.applyRowDocumentValues(index, this.rowSnapshots[index]);
      } else {
        this.applyRowDocumentValues(index, this.getEmptyAddPatch());
      }
    } else if (action === DriverComplianceActions.editCurrent) {
      if (!hasApplicableRecord) {
        group.patchValue({ action: DriverComplianceActions.addNewInfo }, { emitEvent: false });
        this.applyRowDocumentValues(index, this.getEmptyAddPatch());
      } else {
        this.applyRowDocumentValues(index, this.rowSnapshots[index]);
      }
    }

    this.syncRowState(group);
    this.syncReasonValidators(group);
  }

  private snapshotFromRow(row: any): DriverComplianceRowDocumentSnapshot {
    return {
      driverDocumentID: row.driverDocumentID ?? -1,
      documentNumber: row.documentNumber ?? '',
      documentIssuingAuthority: row.documentIssuingAuthority ?? '',
      documentImage: row.documentImage ?? '',
      documentImageNonAvailabilityReason: row.documentImageNonAvailabilityReason ?? '',
      documentStartDate: row.documentStartDate ?? null,
      documentExpiry: row.documentExpiry ?? null,
    };
  }

  private getEmptyAddPatch(): DriverComplianceRowDocumentSnapshot {
    return {
      driverDocumentID: -1,
      documentNumber: '',
      documentIssuingAuthority: '',
      documentImage: '',
      documentImageNonAvailabilityReason: '',
      documentStartDate: null,
      documentExpiry: null,
    };
  }

  openDriverDocumentQc(index: number): void {
    const group = this.rows.at(index) as FormGroup;
    const driverDocumentID = Number(group.get('driverDocumentID')?.value);
    if (!driverDocumentID || driverDocumentID <= 0) {
      return;
    }

    this.driverDocumentService.getById(driverDocumentID).subscribe(
      (row) => {
        const dialogRef = this.dialog.open(FormDialogVerificationsComponent, {
          width: '900px',
          maxWidth: '95vw',
          data: {
            advanceTable: row,
            driverID: this.driverID,
            DriverID: this.driverID,
            DriverName: this.driverName,
          },
        });
        dialogRef.afterClosed().subscribe(() => this.loadPage());
      },
      () => {
        this.showNotification(
          'snackbar-danger',
          'Could not load driver document for QC.',
          'bottom',
          'center'
        );
      }
    );
  }

  isActionOptionDisabled(optValue: string, row: FormGroup): boolean {
    if (
      optValue !== DriverComplianceActions.editCurrent &&
      optValue !== DriverComplianceActions.qc
    ) {
      return false;
    }
    return !row.get('hasApplicableRecord')?.value;
  }

  private applyRowDocumentValues(
    index: number,
    patch: DriverComplianceRowDocumentSnapshot
  ): void {
    const group = this.rows.at(index) as FormGroup;
    group.patchValue(patch, { emitEvent: false });
    this.imagePaths[index] = patch.documentImage || '';
    this.imageBroken[index] = false;
  }

  syncRowState(group: FormGroup): void {
    const action = group.get('action')?.value;
    const skip = action === DriverComplianceActions.doNotAddInfo;
    const editLocked =
      action === DriverComplianceActions.editCurrent && group.get('isEditable')?.value === false;
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
    if (action === DriverComplianceActions.doNotAddInfo) {
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
    this.imageBroken[index] = false;
    const group = this.rows.at(index) as FormGroup;
    group.patchValue({ documentImage: path });
    this.syncReasonValidators(group);
  }

  openImagePreview(index: number, row: FormGroup): void {
    const url = this.imagePaths[index] || row.get('documentImage')?.value;
    if (!url) {
      return;
    }
    const title = row.get('documentName')?.value || 'Document image';
    this.dialog.open(DriverComplianceImagePreviewDialogComponent, {
      width: '860px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'vehicle-compliance-image-preview-panel',
      data: { title, imageUrl: url },
    });
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
      if (action === DriverComplianceActions.doNotAddInfo) {
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
        if (action === DriverComplianceActions.doNotAddInfo) {
          return null;
        }
        const document = {
          driverDocumentID:
            action === DriverComplianceActions.addNewInfo ? -1 : raw.driverDocumentID,
          driverID: this.driverID,
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
    this.driverComplianceService.saveBulk(this.driverID, payloadRows).subscribe(
      (response) => {
        this.saveInProgress = false;
        const pageData = response?.page ?? response?.Page;
        if (pageData) {
          this.bindPage(new DriverCompliancePage(pageData));
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
