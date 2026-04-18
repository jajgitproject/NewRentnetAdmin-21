// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerQCModel {
  customerQCID: number;
  customerID:number;
  userID:number;
  startDateString: string;
  startDate: Date;
  endDateString: string;
  endDate: Date;
  isQCRequiredBeforeDispatch: boolean;
  activationStatus: boolean;

  constructor(customerQCModel) {
    {
      this.customerQCID = customerQCModel.customerQCID || -1;
      this.customerID = customerQCModel.customerID || '';
      this.startDateString = customerQCModel.startDateString || '';
      this.endDateString = customerQCModel.endDateString || '';
      this.customerID = customerQCModel.customerID || '';
      this.isQCRequiredBeforeDispatch = customerQCModel.isQCRequiredBeforeDispatch || '';
      this.activationStatus = customerQCModel.activationStatus || '';

      this.startDate = new Date();
    }
  }
  
}

