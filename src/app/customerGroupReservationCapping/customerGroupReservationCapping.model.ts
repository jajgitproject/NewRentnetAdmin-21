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
  vehicleCategoryID:number;
  vehicleCategory:string;
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
      this.customerGroupReservationCappingID = customerGroupReservationCappingModel.customerGroupReservationCappingID || -1;
      this.customerGroupID = customerGroupReservationCappingModel.customerGroupID || '';
      this.customerGroup = customerGroupReservationCappingModel.customerGroup || '';
      this.cityID = customerGroupReservationCappingModel.cityID || '';
      this.packageTypeID = customerGroupReservationCappingModel.packageTypeID || '';
      this.packageType = customerGroupReservationCappingModel.packageType || '';
      this.vehicleCategoryID = customerGroupReservationCappingModel.vehicleCategoryID || '';
      this.vehicleCategory = customerGroupReservationCappingModel.vehicleCategory || '';
      this.mondayCap = customerGroupReservationCappingModel.mondayCap || '';
      this.tuesdayCap = customerGroupReservationCappingModel.tuesdayCap || '';
      this.wednesdayCap = customerGroupReservationCappingModel.wednesdayCap || '';
      this.thursdayCap = customerGroupReservationCappingModel.thursdayCap || '';
      this.fridayCap = customerGroupReservationCappingModel.fridayCap || '';
      this.saturdayCap = customerGroupReservationCappingModel.saturdayCap || '';
      this.sundayCap = customerGroupReservationCappingModel.sundayCap || '';
      this.activationStatus = customerGroupReservationCappingModel.activationStatus || '';
    }
  }
  
}

