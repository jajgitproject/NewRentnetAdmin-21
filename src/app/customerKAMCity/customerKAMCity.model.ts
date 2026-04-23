// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerKAMCity {
  customerKAMCityID: number;
  cityID: number;
  city:string;
  customerKeyAccountManagerID:number;
   activationStatus: boolean;
  userID: number;

  constructor(customerKAMCity) {
    {
       this.customerKAMCityID = customerKAMCity.customerKAMCityID || -1;
       this.cityID = customerKAMCity.cityID || '';
       this.city = customerKAMCity.city || '';
       this.customerKeyAccountManagerID = customerKAMCity.customerKeyAccountManagerID || '';
       this.activationStatus = customerKAMCity.activationStatus || '';
    }
  }
  
}

