// @ts-nocheck
export class DriverDocument {
  driverDocumentID: number;
  driverID: number;
  driverName: string;
  document: string;
  documentID: number;
  addressCity: string;
  documentNumber: string;
  documentIssuingAuthority: string;
  documentImage: string;
  documentImageNonAvailabilityReason: string;
  documentExpiry: Date;
  documentExpiryString: string;
  documentStartDate: Date;
  documentStartDateString: string;
  addressCityID: number;
  address: string;
  pin: string;
  activationStatus: boolean;
  verified: string;
  verifiedData: string;
  verifiedBy: string;
  verificationRemark: string;
  verificationDate: string;
  verificationTime: string;
  documentUploadDate: string;
  documentUploadTime: string;
  documentUploadByID: number;
  documentUploadBy: string;
  userID: number;

  constructor(driverDocument) {
    driverDocument = driverDocument || {};
    this.driverDocumentID = driverDocument.driverDocumentID ?? driverDocument.DriverDocumentID ?? -1;
    this.driverID = driverDocument.driverID ?? driverDocument.DriverID ?? '';
    this.driverName = driverDocument.driverName ?? driverDocument.DriverName ?? '';
    this.document = driverDocument.document ?? driverDocument.Document ?? '';
    this.documentID = driverDocument.documentID ?? driverDocument.DocumentID ?? '';
    this.documentNumber = driverDocument.documentNumber ?? driverDocument.DocumentNumber ?? '';
    this.documentIssuingAuthority =
      driverDocument.documentIssuingAuthority ?? driverDocument.DocumentIssuingAuthority ?? '';
    this.documentImage = driverDocument.documentImage ?? driverDocument.DocumentImage ?? '';
    this.documentImageNonAvailabilityReason =
      driverDocument.documentImageNonAvailabilityReason ??
      driverDocument.DocumentImageNonAvailabilityReason ??
      '';
    this.addressCityID = driverDocument.addressCityID ?? driverDocument.AddressCityID ?? 0;
    this.address = driverDocument.address ?? driverDocument.Address ?? '';
    this.documentExpiryString = driverDocument.documentExpiryString ?? driverDocument.DocumentExpiryString ?? '';
    this.documentStartDateString =
      driverDocument.documentStartDateString ?? driverDocument.DocumentStartDateString ?? '';
    this.pin = driverDocument.pin ?? driverDocument.Pin ?? '';
    this.activationStatus = driverDocument.activationStatus ?? driverDocument.ActivationStatus ?? '';
    this.verified = driverDocument.verified ?? driverDocument.Verified ?? '';
    this.verifiedBy = driverDocument.verifiedBy ?? driverDocument.VerifiedBy ?? '';
    this.verificationRemark = driverDocument.verificationRemark ?? driverDocument.VerificationRemark ?? '';
    this.verificationDate = driverDocument.verificationDate ?? driverDocument.VerificationDate ?? '';
    this.verificationTime = driverDocument.verificationTime ?? driverDocument.VerificationTime ?? '';
    this.documentUploadDate =
      driverDocument.documentUploadDate ?? driverDocument.DocumentUploadDate ?? '';
    this.documentUploadTime =
      driverDocument.documentUploadTime ?? driverDocument.DocumentUploadTime ?? '';
    this.documentUploadByID =
      driverDocument.documentUploadByID ?? driverDocument.DocumentUploadByID ?? null;
    this.documentUploadBy = driverDocument.documentUploadBy ?? driverDocument.DocumentUploadBy ?? '';
    this.documentExpiry = driverDocument.documentExpiry ?? driverDocument.DocumentExpiry ?? null;
    this.documentStartDate = driverDocument.documentStartDate ?? driverDocument.DocumentStartDate ?? null;
  }
}

export class DriverDocumentVerificationModel {
  driverDocumentID: number;
  driverID: number;
  driverName: string;
  document: string;
  documentID: number;
  addressCity: string;
  documentNumber: string;
  documentIssuingAuthority: string;
  documentImage: string;
  documentImageNonAvailabilityReason: string;
  documentExpiry: Date;
  documentExpiryString: string;
  addressCityID: number;
  address: string;
  pin: string;
  activationStatus: boolean;
  verified: string;
  documentVerified: string;
  verifiedBy: string;
  verifiedByID: number;
  verificationRemark: string;
  verificationDate: Date;
  verificationDateString: string;
  verificationTime: string;
  status: string;
  userID: number;

  constructor(raw) {
    raw = raw || {};
    this.driverDocumentID = raw.driverDocumentID ?? raw.DriverDocumentID ?? -1;
    this.driverID = raw.driverID ?? raw.DriverID ?? '';
    this.driverName = raw.driverName ?? raw.DriverName ?? '';
    this.document =
      raw.document ?? raw.Document ?? raw.documentName ?? raw.DocumentName ?? '';
    this.documentID = raw.documentID ?? raw.DocumentID ?? '';
    this.documentNumber = raw.documentNumber ?? raw.DocumentNumber ?? '';
    this.documentIssuingAuthority =
      raw.documentIssuingAuthority ?? raw.DocumentIssuingAuthority ?? '';
    this.documentImage = raw.documentImage ?? raw.DocumentImage ?? '';
    this.documentImageNonAvailabilityReason =
      raw.documentImageNonAvailabilityReason ?? raw.DocumentImageNonAvailabilityReason ?? '';
    this.addressCityID = raw.addressCityID ?? raw.AddressCityID ?? 0;
    this.address = raw.address ?? raw.Address ?? '';
    this.documentExpiryString = raw.documentExpiryString ?? raw.DocumentExpiryString ?? '';
    this.pin = raw.pin ?? raw.Pin ?? '';
    this.activationStatus = raw.activationStatus ?? raw.ActivationStatus ?? '';
    this.verified = raw.verified ?? raw.Verified ?? '';
    this.verifiedBy = raw.verifiedBy ?? raw.VerifiedBy ?? '';
    this.verificationRemark = raw.verificationRemark ?? raw.VerificationRemark ?? '';
    this.verificationDateString = raw.verificationDateString ?? raw.VerificationDateString ?? '';
    this.verificationTime = raw.verificationTime ?? raw.VerificationTime ?? '';
    const verificationDateRaw = raw.verificationDate ?? raw.VerificationDate;
    this.verificationDate = verificationDateRaw || null;
    const documentExpiryRaw = raw.documentExpiry ?? raw.DocumentExpiry;
    this.documentExpiry = documentExpiryRaw ? new Date(documentExpiryRaw) : null;
  }
}
