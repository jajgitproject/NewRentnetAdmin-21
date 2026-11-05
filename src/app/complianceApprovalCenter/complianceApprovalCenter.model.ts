// @ts-nocheck
export class ComplianceApprovalCenterMetrics {
  pendingVerification: number;
  rejectedCorrection: number;
  pendingOver24Hours: number;
  approvedToday: number;

  constructor(raw: any = {}) {
    this.pendingVerification = raw.pendingVerification ?? raw.PendingVerification ?? 0;
    this.rejectedCorrection = raw.rejectedCorrection ?? raw.RejectedCorrection ?? 0;
    this.pendingOver24Hours = raw.pendingOver24Hours ?? raw.PendingOver24Hours ?? 0;
    this.approvedToday = raw.approvedToday ?? raw.ApprovedToday ?? 0;
  }
}

export class ComplianceApprovalCenterRow {
  resourceType: string;
  documentRecordID: number;
  resourceID: number;
  resourceName: string;
  mobileNumber: string;
  registrationNumber: string;
  resourceContext: string;
  documentID: number;
  documentName: string;
  documentNumber: string;
  verificationStatus: string;
  documentStartDate: string;
  documentValidUpto: string;
  uploadedByEmployee: string;
  submittedAt: string;
  aging: string;
  resourceStatus: string;
  resourceStatusAlert: boolean;

  constructor(raw: any = {}) {
    this.resourceType = raw.resourceType ?? raw.ResourceType ?? '';
    this.documentRecordID = raw.documentRecordID ?? raw.DocumentRecordID ?? -1;
    this.resourceID = raw.resourceID ?? raw.ResourceID ?? 0;
    this.resourceName = raw.resourceName ?? raw.ResourceName ?? '';
    this.mobileNumber = raw.mobileNumber ?? raw.MobileNumber ?? '';
    this.registrationNumber = raw.registrationNumber ?? raw.RegistrationNumber ?? '';
    this.resourceContext = raw.resourceContext ?? raw.ResourceContext ?? '';
    this.documentID = raw.documentID ?? raw.DocumentID ?? 0;
    this.documentName = raw.documentName ?? raw.DocumentName ?? '';
    this.documentNumber = raw.documentNumber ?? raw.DocumentNumber ?? '';
    this.verificationStatus = raw.verificationStatus ?? raw.VerificationStatus ?? '';
    this.documentStartDate = raw.documentStartDate ?? raw.DocumentStartDate ?? '';
    this.documentValidUpto = raw.documentValidUpto ?? raw.DocumentValidUpto ?? '';
    this.uploadedByEmployee = raw.uploadedByEmployee ?? raw.UploadedByEmployee ?? '';
    this.submittedAt = raw.submittedAt ?? raw.SubmittedAt ?? '';
    this.aging = raw.aging ?? raw.Aging ?? '';
    this.resourceStatus = raw.resourceStatus ?? raw.ResourceStatus ?? '';
    this.resourceStatusAlert = raw.resourceStatusAlert ?? raw.ResourceStatusAlert ?? false;
  }
}

export class ComplianceApprovalCenterResponse {
  metrics: ComplianceApprovalCenterMetrics;
  rows: ComplianceApprovalCenterRow[];

  constructor(raw: any = {}) {
    this.metrics = new ComplianceApprovalCenterMetrics(raw.metrics ?? raw.Metrics ?? {});
    const rowList = raw.rows ?? raw.Rows ?? [];
    this.rows = rowList.map((item) => new ComplianceApprovalCenterRow(item));
  }
}
