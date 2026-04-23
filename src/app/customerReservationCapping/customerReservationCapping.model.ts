// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerReservationCappingModel {
  customerReservationCappingID:number;
  customerID:number;
  customerName:string;
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

  constructor(customerReservationCappingModel) {
    {
      this.customerReservationCappingID = customerReservationCappingModel.customerReservationCappingID || -1;
      this.customerID = customerReservationCappingModel.customerID || '';
      this.customerName = customerReservationCappingModel.customerName || '';
      this.cityID = customerReservationCappingModel.cityID || '';
      this.packageTypeID = customerReservationCappingModel.packageTypeID || '';
      this.packageType = customerReservationCappingModel.packageType || '';
      this.vehicleCategoryID = customerReservationCappingModel.vehicleCategoryID || '';
      this.vehicleCategory = customerReservationCappingModel.vehicleCategory || '';
      this.mondayCap = customerReservationCappingModel.mondayCap || '';
      this.tuesdayCap = customerReservationCappingModel.tuesdayCap || '';
      this.wednesdayCap = customerReservationCappingModel.wednesdayCap || '';
      this.thursdayCap = customerReservationCappingModel.thursdayCap || '';
      this.fridayCap = customerReservationCappingModel.fridayCap || '';
      this.saturdayCap = customerReservationCappingModel.saturdayCap || '';
      this.sundayCap = customerReservationCappingModel.sundayCap || '';
      this.activationStatus = customerReservationCappingModel.activationStatus || '';
    }
  }
  
}

