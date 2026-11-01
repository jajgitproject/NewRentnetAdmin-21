// @ts-nocheck
import moment from 'moment';

export class VehicleComplianceSummary {
  mandatory: number;
  complete: number;
  missing: number;
  approvedQC: number;
  rejectedQC: number;
  pendingQC: number;
  expiringSoon: number;

  constructor(raw: any) {
    raw = raw || {};
    this.mandatory = raw.mandatory ?? raw.Mandatory ?? 0;
    this.complete = raw.complete ?? raw.Complete ?? 0;
    this.missing = raw.missing ?? raw.Missing ?? 0;
    this.approvedQC = raw.approvedQC ?? raw.ApprovedQC ?? 0;
    this.rejectedQC = raw.rejectedQC ?? raw.RejectedQC ?? 0;
    this.pendingQC = raw.pendingQC ?? raw.PendingQC ?? 0;
    this.expiringSoon = raw.expiringSoon ?? raw.ExpiringSoon ?? 0;
  }
}

export class VehicleComplianceRow {
  documentID: number;
  documentName: string;
  documentType: string;
  isMandatory: boolean;
  hasApplicableRecord: boolean;
  defaultAction: string;
  inventoryDocumentID: number;
  inventoryID: number;
  documentNumber: string;
  documentIssuingAuthority: string;
  documentImage: string;
  documentImageNonAvailabilityReason: string;
  documentStartDate: Date;
  documentExpiry: Date;
  activationStatus: boolean;
  verified: string;
  verifiedBy: string;
  verificationRemark: string;
  verificationDate: string;
  isComplete: boolean;
  isExpiringSoon: boolean;
  isEditable: boolean;

  constructor(raw: any) {
    raw = raw || {};
    this.documentID = raw.documentID ?? raw.DocumentID;
    this.documentName = raw.documentName ?? raw.DocumentName ?? '';
    this.documentType = raw.documentType ?? raw.DocumentType ?? '';
    this.isMandatory = raw.isMandatory ?? raw.IsMandatory ?? false;
    this.hasApplicableRecord = raw.hasApplicableRecord ?? raw.HasApplicableRecord ?? false;
    this.defaultAction = raw.defaultAction ?? raw.DefaultAction ?? 'AddNewInfo';
    this.inventoryDocumentID = raw.inventoryDocumentID ?? raw.InventoryDocumentID ?? -1;
    this.inventoryID = raw.inventoryID ?? raw.InventoryID;
    this.documentNumber = raw.documentNumber ?? raw.DocumentNumber ?? '';
    this.documentIssuingAuthority = raw.documentIssuingAuthority ?? raw.DocumentIssuingAuthority ?? '';
    this.documentImage = raw.documentImage ?? raw.DocumentImage ?? '';
    this.documentImageNonAvailabilityReason =
      raw.documentImageNonAvailabilityReason ?? raw.DocumentImageNonAvailabilityReason ?? '';
    this.documentStartDate = parseDate(raw.documentStartDate ?? raw.DocumentStartDate);
    this.documentExpiry = parseDate(raw.documentExpiry ?? raw.DocumentExpiry);
    this.activationStatus = raw.activationStatus ?? raw.ActivationStatus ?? true;
    this.verified = raw.verified ?? raw.Verified ?? '';
    this.verifiedBy = raw.verifiedBy ?? raw.VerifiedBy ?? '';
    this.verificationRemark = raw.verificationRemark ?? raw.VerificationRemark ?? '';
    this.verificationDate = raw.verificationDate ?? raw.VerificationDate ?? '';
    this.isComplete = raw.isComplete ?? raw.IsComplete ?? false;
    this.isExpiringSoon = raw.isExpiringSoon ?? raw.IsExpiringSoon ?? false;
    this.isEditable = raw.isEditable ?? raw.IsEditable ?? true;
  }
}

export class VehicleCompliancePage {
  inventoryID: number;
  registrationNumber: string;
  summary: VehicleComplianceSummary;
  rows: VehicleComplianceRow[];

  constructor(raw: any) {
    raw = raw || {};
    this.inventoryID = raw.inventoryID ?? raw.InventoryID;
    this.registrationNumber = raw.registrationNumber ?? raw.RegistrationNumber ?? '';
    this.summary = new VehicleComplianceSummary(raw.summary ?? raw.Summary);
    const rows = raw.rows ?? raw.Rows ?? [];
    this.rows = rows.map((r) => new VehicleComplianceRow(r));
  }
}

function parseDate(value: any): Date | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  const text = String(value).trim();
  if (!text || /^0001-01-01/.test(text)) {
    return null;
  }
  const parsed = moment(
    text,
    [moment.ISO_8601, 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD', 'DD/MM/YYYY', 'DD-MM-YYYY', 'MM/DD/YYYY'],
    true
  );
  if (parsed.isValid()) {
    return parsed.toDate();
  }
  const fallback = moment(text);
  return fallback.isValid() ? fallback.toDate() : null;
}

export const VehicleComplianceActions = {
  addNewInfo: 'AddNewInfo',
  doNotAddInfo: 'DoNotAddInfo',
  editCurrent: 'EditCurrent',
  qc: 'Qc',
};

export const VehicleComplianceActionLabels = [
  { value: VehicleComplianceActions.addNewInfo, label: 'Add' },
  { value: VehicleComplianceActions.doNotAddInfo, label: 'NA' },
  { value: VehicleComplianceActions.editCurrent, label: 'Edit' },
  { value: VehicleComplianceActions.qc, label: 'QC' },
];
