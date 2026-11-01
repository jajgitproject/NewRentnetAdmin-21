// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerGroupReservationCappingModel {
  customerGroupReservationCappingID:number;
  customerGroupID:number;
  customerGroup:string;
  cityID:number;
  city:string;
  packageTypeID:number;
  packageType:string;
  cappingType:string;
  vehicleID:number;
  vehicle:string;
  mondayCap:number;
  tuesdayCap:number;
  wednesdayCap:number;
  thursdayCap:number;
  fridayCap:number;
  saturdayCap:number;
  sundayCap:number;
  activationStatus: boolean;
  userID:number;

  constructor(customerGroupReservationCappingModel) {
    {
      this.customerGroupReservationCappingID = customerGroupReservationCappingModel.customerGroupReservationCappingID ?? -1;
      this.customerGroupID = customerGroupReservationCappingModel.customerGroupID ?? '';
      this.customerGroup = customerGroupReservationCappingModel.customerGroup ?? '';
      this.cityID = customerGroupReservationCappingModel.cityID ?? '';
      this.packageTypeID = customerGroupReservationCappingModel.packageTypeID ?? '';
      this.packageType = customerGroupReservationCappingModel.packageType ?? '';
      this.cappingType = customerGroupReservationCappingModel.cappingType ?? '';
      this.vehicleID = customerGroupReservationCappingModel.vehicleID ?? '';
      this.vehicle = customerGroupReservationCappingModel.vehicle ?? '';
      this.mondayCap = this.normalizeCap(customerGroupReservationCappingModel.mondayCap);
      this.tuesdayCap = this.normalizeCap(customerGroupReservationCappingModel.tuesdayCap);
      this.wednesdayCap = this.normalizeCap(customerGroupReservationCappingModel.wednesdayCap);
      this.thursdayCap = this.normalizeCap(customerGroupReservationCappingModel.thursdayCap);
      this.fridayCap = this.normalizeCap(customerGroupReservationCappingModel.fridayCap);
      this.saturdayCap = this.normalizeCap(customerGroupReservationCappingModel.saturdayCap);
      this.sundayCap = this.normalizeCap(customerGroupReservationCappingModel.sundayCap);
      this.activationStatus = customerGroupReservationCappingModel.activationStatus ?? '';
    }
  }

  private normalizeCap(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return value;
  }
  
}

export type CappingListStatusFilter = 'Active' | 'Deactive';

export interface BulkUpdateRequest {
  ids: number[];
  mondayCap?: number | null;
  tuesdayCap?: number | null;
  wednesdayCap?: number | null;
  thursdayCap?: number | null;
  fridayCap?: number | null;
  saturdayCap?: number | null;
  sundayCap?: number | null;
}

export interface BulkUpdateResponse {
  updatedCount: number;
}

export interface CappingCombinationDisplay {
  cappingType?: string;
  packageType?: string;
  city?: string;
  vehicle?: string;
}

export interface CappingImportError {
  rowNumber: number;
  field: string;
  message: string;
}

export interface CappingImportResult {
  success?: boolean;
  createdCount: number;
  updatedCount: number;
  totalRows?: number;
  message?: string;
  errors?: CappingImportError[];
}
