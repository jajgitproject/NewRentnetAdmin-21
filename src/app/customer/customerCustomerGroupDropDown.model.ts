// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCustomerGroupDropDown {
 
  customerID: number;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;
  customerTypeID: number;
  customerType: string;
  cityName: string;
  stateName:string;
  tallyCustomerID: number;
  isBookerAllowedToBeCreatedFromReservation: boolean;

  constructor(customerCustomerGroupDropDown) {
    {
      this.customerID = customerCustomerGroupDropDown.customerID || '';
      this.customerName = customerCustomerGroupDropDown.customerName || '';
      this.customerGroupID = customerCustomerGroupDropDown.customerGroupID || '';
      this.customerGroup = customerCustomerGroupDropDown.customerGroup || '';
      this.customerTypeID = customerCustomerGroupDropDown.customerTypeID || '';
      this.customerType = customerCustomerGroupDropDown.customerType || '';
      this.cityName = customerCustomerGroupDropDown.cityName || '';
      this.stateName = customerCustomerGroupDropDown.stateName || '';
      this.tallyCustomerID = customerCustomerGroupDropDown.tallyCustomerID || '';
      const bookerAllowed =
        customerCustomerGroupDropDown.isBookerAllowedToBeCreatedFromReservation ??
        customerCustomerGroupDropDown.IsBookerAllowedToBeCreatedFromReservation;
      this.isBookerAllowedToBeCreatedFromReservation = bookerAllowed === true;
    }
  }
  
}

