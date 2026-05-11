// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangeCityModel {
  reservationID:number;
  pickupCityID: number;
  pickupCity:string;
  userID:number
  constructor(changeCityModel) {
  {
    this.pickupCityID = changeCityModel.pickupCityID || 0;
    this.pickupCity = changeCityModel.pickupCity || '';
    this.reservationID = changeCityModel.reservationID || 0;         
    }
  }
  
}

export class CitiesDropDown {
  pickupCityID: number;
  pickupCity: string;

  constructor(cityDropDown) {
    {
      this.pickupCityID = cityDropDown.pickupCityID || -1;
      this.pickupCity = cityDropDown.pickupCity || '';
    }
  }
  
}