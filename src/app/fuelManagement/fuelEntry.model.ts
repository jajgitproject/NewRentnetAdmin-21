// @ts-nocheck

export interface FuelLookupItem {

  id?: number;

  Id?: number;

  code?: string;

  Code?: string;

  name?: string;

  Name?: string;

}



export interface FuelEntryLookupDto {

  petrolPumps?: FuelLookupItem[];

  PetrolPumps?: FuelLookupItem[];

  payModes?: FuelLookupItem[];

  PayModes?: FuelLookupItem[];

  fuelTypes?: FuelLookupItem[];

  FuelTypes?: FuelLookupItem[];

  manualEntryReasons?: FuelLookupItem[];

  ManualEntryReasons?: FuelLookupItem[];

  odometerResetReasons?: FuelLookupItem[];

  OdometerResetReasons?: FuelLookupItem[];

  entrySources?: FuelLookupItem[];

  EntrySources?: FuelLookupItem[];

  statuses?: FuelLookupItem[];

  Statuses?: FuelLookupItem[];

}



export interface FuelDriverOption {

  driverID?: number;

  DriverID?: number;

  driverName?: string;

  DriverName?: string;

  driverMobile?: string;

  DriverMobile?: string;

  driverOfficialIdentityNo?: string;

  DriverOfficialIdentityNo?: string;

}



export interface FuelEntryVehicleContextDto {

  inventoryID?: number;

  InventoryID?: number;

  registrationNumber?: string;

  RegistrationNumber?: string;

  supplierID?: number;

  SupplierID?: number;

  supplierName?: string;

  SupplierName?: string;

  vehicleID?: number;

  VehicleID?: number;

  vehicleName?: string;

  VehicleName?: string;

  vehicleCategory?: string;

  VehicleCategory?: string;

  locationID?: number;

  LocationID?: number;

  locationName?: string;

  LocationName?: string;

  driverID?: number;

  DriverID?: number;

  driverName?: string;

  DriverName?: string;

  driverMobile?: string;

  DriverMobile?: string;

  driverOfficialIdentityNo?: string;

  DriverOfficialIdentityNo?: string;

  fuelTypeID?: number;

  FuelTypeID?: number;

  fuelTypeName?: string;

  FuelTypeName?: string;

  averageMileage?: number;

  AverageMileage?: number;

  fuelCardNo?: string;

  FuelCardNo?: string;

}



export interface FuelEntryCalculationPreviewRequest {

  inventoryID: number;

  fuelDate: string;

  fuelTime: string;

  fuelEntryID?: number;

  currentMeter?: number;

  fuelQuantity?: number;

  amount?: number;

}



export interface FuelEntryCalculationPreviewDto {

  previousMeter?: number;

  PreviousMeter?: number;

  averageMileage?: number;

  AverageMileage?: number;

  currentAverage?: number;

  CurrentAverage?: number;

  eligibility?: number;

  Eligibility?: number;

  fuelShortage?: number;

  FuelShortage?: number;

  fuelRate?: number;

  FuelRate?: number;

  shortageAmount?: number;

  ShortageAmount?: number;

}



export interface FuelEntrySearchCriteria {

  fuelSlipNo?: string;

  registrationNumber?: string;

  inventoryID?: number;

  fuelDate?: string | Date;

  performedBy?: number;

  pageNumber?: number;

  pageSize?: number;

}



export interface FuelEntrySearchRow {

  fuelEntryID?: number;

  FuelEntryID?: number;

  fuelEntryNumber?: string;

  FuelEntryNumber?: string;

  fuelDate?: string;

  FuelDate?: string;

  fuelSlipNo?: string;

  FuelSlipNo?: string;

  registrationNumber?: string;

  RegistrationNumber?: string;

  driverName?: string;

  DriverName?: string;

  statusName?: string;

  StatusName?: string;

  statusCode?: string;

  StatusCode?: string;

  amount?: number;

  Amount?: number;

}



export interface FuelEntrySaveRequest {

  inventoryID: number;

  supplierID?: number;

  driverID?: number;

  locationID?: number;

  fuelTypeID?: number;

  fuelPayModeID?: number;

  fuelDate: string;

  fuelTime: string;

  fuelSlipNo: string;

  fueledByName?: string;

  fuelCardNo?: string;

  currentMeter: number;

  fuelQuantity: number;

  amount: number;

  fuelManualEntryReasonID?: number;

  remarks?: string;

  submitForVerification?: boolean;

}



export interface FuelEntryDocumentDto {

  fuelEntryDocumentID?: number;

  FuelEntryDocumentID?: number;

  documentType?: string;

  DocumentType?: string;

  originalFileName?: string;

  OriginalFileName?: string;

  contentType?: string;

  ContentType?: string;

  fileSize?: number;

  FileSize?: number;

  uploadedDate?: string;

  UploadedDate?: string;

  downloadUrl?: string;

  DownloadUrl?: string;

}



export interface FuelEntryDetailDto {

  fuelEntryID?: number;

  FuelEntryID?: number;

  fuelEntryNumber?: string;

  FuelEntryNumber?: string;

  entrySourceCode?: string;

  EntrySourceCode?: string;

  entrySourceName?: string;

  EntrySourceName?: string;

  inventoryID?: number;

  InventoryID?: number;

  registrationNumber?: string;

  RegistrationNumber?: string;

  supplierID?: number;

  SupplierID?: number;

  supplierName?: string;

  SupplierName?: string;

  driverID?: number;

  DriverID?: number;

  driverName?: string;

  DriverName?: string;

  fueledByName?: string;

  FueledByName?: string;

  locationID?: number;

  LocationID?: number;

  locationName?: string;

  LocationName?: string;

  fuelTypeID?: number;

  FuelTypeID?: number;

  fuelTypeName?: string;

  FuelTypeName?: string;

  fuelPayModeID?: number;

  FuelPayModeID?: number;

  payModeName?: string;

  PayModeName?: string;

  fuelDate?: string;

  FuelDate?: string;

  fuelTime?: string;

  FuelTime?: string;

  fuelSlipNo?: string;

  FuelSlipNo?: string;

  fuelCardNo?: string;

  FuelCardNo?: string;

  currentMeter?: number;

  CurrentMeter?: number;

  previousMeter?: number;

  PreviousMeter?: number;

  fuelQuantity?: number;

  FuelQuantity?: number;

  amount?: number;

  Amount?: number;

  averageKMPerLitre?: number;

  AverageKMPerLitre?: number;

  currentAverage?: number;

  CurrentAverage?: number;

  eligibility?: number;

  Eligibility?: number;

  fuelShortage?: number;

  FuelShortage?: number;

  fuelRate?: number;

  FuelRate?: number;

  shortageAmount?: number;

  ShortageAmount?: number;

  fuelManualEntryReasonID?: number;

  FuelManualEntryReasonID?: number;

  manualEntryReasonName?: string;

  ManualEntryReasonName?: string;

  remarks?: string;

  Remarks?: string;

  statusCode?: string;

  StatusCode?: string;

  statusName?: string;

  StatusName?: string;

  isEditable?: boolean;

  IsEditable?: boolean;

  documents?: FuelEntryDocumentDto[];

  Documents?: FuelEntryDocumentDto[];

}

export interface FuelEntryVerificationSearchCriteria {
  fromDate?: string;
  FromDate?: string;
  toDate?: string;
  ToDate?: string;
  locationID?: number;
  LocationID?: number;
  statusID?: number;
  StatusID?: number;
  statusCode?: string;
  StatusCode?: string;
  registrationNumber?: string;
  RegistrationNumber?: string;
  driverName?: string;
  DriverName?: string;
  entrySourceID?: number;
  EntrySourceID?: number;
  pageNumber?: number;
  PageNumber?: number;
  pageSize?: number;
  PageSize?: number;
}

export interface FuelEntryVerificationRow {
  fuelEntryID?: number;
  FuelEntryID?: number;
  fuelEntryNumber?: string;
  FuelEntryNumber?: string;
  fuelDate?: string;
  FuelDate?: string;
  fuelTime?: string;
  FuelTime?: string;
  fuelSlipNo?: string;
  FuelSlipNo?: string;
  registrationNumber?: string;
  RegistrationNumber?: string;
  driverName?: string;
  DriverName?: string;
  entrySourceName?: string;
  EntrySourceName?: string;
  locationName?: string;
  LocationName?: string;
  fuelQuantity?: number;
  FuelQuantity?: number;
  amount?: number;
  Amount?: number;
  currentMeter?: number;
  CurrentMeter?: number;
  statusCode?: string;
  StatusCode?: string;
  statusName?: string;
  StatusName?: string;
  fuelSlipDocumentID?: number;
  FuelSlipDocumentID?: number;
  odometerDocumentID?: number;
  OdometerDocumentID?: number;
  fuelSlipContentType?: string;
  FuelSlipContentType?: string;
  odometerContentType?: string;
  OdometerContentType?: string;
}

export interface FuelEntryVerificationPagedResult {
  rows?: FuelEntryVerificationRow[];
  Rows?: FuelEntryVerificationRow[];
  totalCount?: number;
  TotalCount?: number;
  pageNumber?: number;
  PageNumber?: number;
  pageSize?: number;
  PageSize?: number;
}

export interface FuelEntryVerificationActionRequest {
  fuelEntryIDs?: number[];
  FuelEntryIDs?: number[];
  reason?: string;
  Reason?: string;
  remarks?: string;
  Remarks?: string;
}

export interface FuelEntryVerificationActionResult {
  succeeded?: number;
  Succeeded?: number;
  failed?: number;
  Failed?: number;
  messages?: string[];
  Messages?: string[];
}

export interface FuelEntryStatusHistoryItem {
  fuelEntryStatusHistoryID?: number;
  FuelEntryStatusHistoryID?: number;
  statusCode?: string;
  StatusCode?: string;
  statusName?: string;
  StatusName?: string;
  actionType?: string;
  ActionType?: string;
  actionBy?: number;
  ActionBy?: number;
  actionByName?: string;
  ActionByName?: string;
  actionDate?: string;
  ActionDate?: string;
  reason?: string;
  Reason?: string;
  remarks?: string;
  Remarks?: string;
}

export interface OdometerResetDto {
  resetID?: number;
  ResetID?: number;
  inventoryID?: number;
  InventoryID?: number;
  registrationNumber?: string;
  RegistrationNumber?: string;
  resetDate?: string;
  ResetDate?: string;
  resetTime?: string;
  ResetTime?: string;
  newOdometerReading?: number;
  NewOdometerReading?: number;
  odometerResetReasonID?: number;
  OdometerResetReasonID?: number;
  reason?: string;
  Reason?: string;
  resetBy?: number;
  ResetBy?: number;
  resetByName?: string;
  ResetByName?: string;
  createdDate?: string;
  CreatedDate?: string;
  createdBy?: number;
  CreatedBy?: number;
  createdByName?: string;
  CreatedByName?: string;
  modifiedDate?: string;
  ModifiedDate?: string;
  modifiedBy?: number;
  ModifiedBy?: number;
  modifiedByName?: string;
  ModifiedByName?: string;
  isActive?: boolean;
  IsActive?: boolean;
  hasPostResetFuelEntries?: boolean;
  HasPostResetFuelEntries?: boolean;
  canEdit?: boolean;
  CanEdit?: boolean;
  canDelete?: boolean;
  CanDelete?: boolean;
}

export interface OdometerResetSaveRequest {
  inventoryID: number;
  resetDate: string;
  resetTime: string;
  newOdometerReading: number;
  odometerResetReasonID: number;
}

export interface OdometerResetContextDto {
  inventoryID?: number;
  InventoryID?: number;
  registrationNumber?: string;
  RegistrationNumber?: string;
  latestFuelEntryDate?: string;
  LatestFuelEntryDate?: string;
  latestFuelEntryTime?: string;
  LatestFuelEntryTime?: string;
  latestCurrentMeter?: number;
  LatestCurrentMeter?: number;
  existingResets?: OdometerResetDto[];
  ExistingResets?: OdometerResetDto[];
}

export interface FuelEntryMisSearchCriteria {
  fromDate?: string;
  toDate?: string;
  inventoryID?: number;
  registrationNumber?: string;
  driverID?: number;
  driverName?: string;
  fuelPetrolPumpID?: number;
  fuelTypeID?: number;
  locationID?: number;
  statusCode?: string;
  pageNumber?: number;
  pageSize?: number;
  exportAll?: boolean;
}

export interface FuelEntryMisRow {
  serialNo?: number;
  fuelEntryID?: number;
  carNo?: string;
  carName?: string;
  location?: string;
  ownSupplied?: string;
  vendorName?: string;
  vendorID?: string;
  fuelType?: string;
  requiredAverage?: number;
  previousMeter?: number;
  billDate?: string;
  slipDate?: string;
  slipTime?: string;
  fuelSlipNo?: string;
  currentMeter?: number;
  quantity?: number;
  amount?: number;
  eligibleFuelInLitre?: number;
  givenAverage?: number;
  driverType?: string;
  driver?: string;
  driverCode?: string;
  shortageExcessLitres?: number;
  perLitreRate?: number;
  shortageAmount?: number;
  driverChargeStatus?: string;
  isFirstEntryAfterReset?: boolean;
  fuelSlipNoStatus?: string;
  invalidCount?: number;
  petrolPump?: string;
  billNo?: string;
  remark?: string;
  status?: string;
}

export interface FuelEntryMisPagedResult {
  rows?: FuelEntryMisRow[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface VehicleFuelHistoryEventDto {
  eventType?: string;
  EventType?: string;
  fuelEntryID?: number;
  FuelEntryID?: number;
  resetID?: number;
  ResetID?: number;
  eventDate?: string;
  EventDate?: string;
  title?: string;
  Title?: string;
  detail?: string;
  Detail?: string;
  odometerReading?: number;
  OdometerReading?: number;
}

