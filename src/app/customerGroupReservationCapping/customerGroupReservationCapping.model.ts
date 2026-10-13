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
