// @ts-nocheck
import { formatDate } from '@angular/common';
export class FuelRateModel {
  fuelRateID: number;
  fuelTypeID: number;
  fuelType: string;
  userID:number;
  stateID: number;
  stateName: string;
  fuelRateStartDateString: string;
  fuelRateStartDate:Date
  fuelRateEndDateString: string;
  fuelRateEndDate:Date
  fuelRate:number;
  activationStatus: boolean;

  constructor(fuelRateModel) {
    {
      this.fuelRateID = fuelRateModel.fuelRateID || -1;
      this.fuelTypeID = fuelRateModel.fuelTypeID || '';
      this.fuelType = fuelRateModel.fuelType || '';
      this.stateID = fuelRateModel.stateID || '';
      this.stateName = fuelRateModel.stateName || '';
      this.fuelRateStartDateString = fuelRateModel.fuelRateStartDateString || '';
      this.fuelRateEndDateString = fuelRateModel.fuelRateEndDateString || '';
      this.fuelRate = fuelRateModel.fuelRate || 0;
      this.userID = fuelRateModel.userID || '';
      this.activationStatus = fuelRateModel.activationStatus || '';

      this.fuelRateStartDate=new Date();
      this.fuelRateEndDate=new Date();
    }
  }
  
}


export class FuelTypeDropDwonModel {
  fuelTypeID: number;
  fuelType: string;

  constructor(fuelTypeDropDwonModel) {
    {
      this.fuelTypeID = fuelTypeDropDwonModel.fuelTypeID || '';
      this.fuelType = fuelTypeDropDwonModel.fuelType || '';
    }
  }
  
}

