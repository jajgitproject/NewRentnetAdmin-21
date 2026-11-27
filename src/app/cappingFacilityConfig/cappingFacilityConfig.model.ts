// @ts-nocheck
export class CappingFacilityDateConfigModel {
  cappingFacilityDateConfigID: number;
  configDate: string | Date;
  configDateDisplay: string;
  isCappingEnabled: boolean;
  activationStatus: boolean;
  userID: number;
}

export class CappingFacilityDateConfigSaveRequest {
  dates: string[];
  isCappingEnabled: boolean;
  userID: number;
}

export class CappingFacilityDateConfigSaveResult {
  result: string;
  savedCount: number;
  items: CappingFacilityDateConfigModel[];
}
