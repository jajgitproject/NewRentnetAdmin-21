// @ts-nocheck
export class ComplianceMonitorMetrics {
  dueWithin30Days: number;
  dueWithin15Days: number;
  criticalWithin7Days: number;
  expiredBlocking: number;
  renewalsPendingApproval: number;

  constructor(raw: any = {}) {
    this.dueWithin30Days = raw.dueWithin30Days ?? raw.DueWithin30Days ?? 0;
    this.dueWithin15Days = raw.dueWithin15Days ?? raw.DueWithin15Days ?? 0;
    this.criticalWithin7Days = raw.criticalWithin7Days ?? raw.CriticalWithin7Days ?? 0;
    this.expiredBlocking = raw.expiredBlocking ?? raw.ExpiredBlocking ?? 0;
    this.renewalsPendingApproval = raw.renewalsPendingApproval ?? raw.RenewalsPendingApproval ?? 0;
  }
}

export class ComplianceMonitorRow {
  resourceType: string;
  resourceID: number;
  resourceIdentifier: string;
  documentName: string;
  documentID: number;
  documentRecordID: number;
  validUpto: string;
  expiryStatus: string;
  expiryStatusClass: string;
  deploymentEffect: string;
  deploymentEffectClass: string;
  owner: string;
  branchName: string;
  locationName: string;
  daysRemaining: number;
  verificationStatus: string;

  constructor(raw: any = {}) {
    this.resourceType = raw.resourceType ?? raw.ResourceType ?? '';
    this.resourceID = raw.resourceID ?? raw.ResourceID ?? 0;
    this.resourceIdentifier = raw.resourceIdentifier ?? raw.ResourceIdentifier ?? '';
    this.documentName = raw.documentName ?? raw.DocumentName ?? '';
    this.documentID = raw.documentID ?? raw.DocumentID ?? 0;
    this.documentRecordID = raw.documentRecordID ?? raw.DocumentRecordID ?? -1;
    this.validUpto = raw.validUpto ?? raw.ValidUpto ?? '';
    this.expiryStatus = raw.expiryStatus ?? raw.ExpiryStatus ?? '';
    this.expiryStatusClass = raw.expiryStatusClass ?? raw.ExpiryStatusClass ?? '';
    this.deploymentEffect = raw.deploymentEffect ?? raw.DeploymentEffect ?? '';
    this.deploymentEffectClass = raw.deploymentEffectClass ?? raw.DeploymentEffectClass ?? '';
    this.owner = raw.owner ?? raw.Owner ?? '';
    this.branchName = raw.branchName ?? raw.BranchName ?? '';
    this.locationName = raw.locationName ?? raw.LocationName ?? '';
    this.daysRemaining = raw.daysRemaining ?? raw.DaysRemaining ?? 0;
    this.verificationStatus = raw.verificationStatus ?? raw.VerificationStatus ?? '';
  }
}

export class ComplianceMonitorResponse {
  metrics: ComplianceMonitorMetrics;
  rows: ComplianceMonitorRow[];

  constructor(raw: any = {}) {
    this.metrics = new ComplianceMonitorMetrics(raw.metrics ?? raw.Metrics ?? {});
    const rowList = raw.rows ?? raw.Rows ?? [];
    this.rows = rowList.map((item) => new ComplianceMonitorRow(item));
  }
}

export class ComplianceMonitorLocationOption {
  organizationalEntityID: number;
  organizationalEntityName: string;

  constructor(raw: any = {}) {
    this.organizationalEntityID = raw.organizationalEntityID ?? raw.OrganizationalEntityID ?? 0;
    this.organizationalEntityName = raw.organizationalEntityName ?? raw.OrganizationalEntityName ?? '';
  }
}
