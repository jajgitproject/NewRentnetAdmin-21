// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerServiceExecutive {
  customerServiceExecutiveID: number;
  customerID: number;
  salesPersonID: number;
  reservationExecutiveID: number;
  collectionExecutiveID: number;
  startDate: Date;
  endDate: Date;
  endDateString: string;
  startDateString: string;
  activationStatus: Boolean;
  salesPerson:string;
  reservationExecutive:string;
  collectionExecutive:string;

  constructor(customerServiceExecutive) {
    {
      this.customerServiceExecutiveID = customerServiceExecutive.customerServiceExecutiveID || -1;
      this.customerID = customerServiceExecutive.customerID || '';
      this.salesPersonID = customerServiceExecutive.salesPersonID || '';
      this.reservationExecutiveID = customerServiceExecutive.reservationExecutiveID || '';
      this.collectionExecutiveID = customerServiceExecutive.collectionExecutiveID || '';
      this.startDateString = customerServiceExecutive.startDateString || '';
      this.endDateString = customerServiceExecutive.endDateString || '';
      this.activationStatus = customerServiceExecutive.activationStatus || '';
      this.startDate = new Date();
      this.endDate = new Date();
    }
  }

}

