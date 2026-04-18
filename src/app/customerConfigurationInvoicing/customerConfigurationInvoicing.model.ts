// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationInvoicing {
  customerConfigurationInvoicingID: number;
  customerID : number;
  gstNumber : string;
  gstRate:string;
  billingName:string;
  billingAddress:string;
  billingStartName:string;
  billingCityID:number;
  billingStateID:number;
  billingPin:string;
  eInvoiceAddress:string;
  startDate :Date;
  endDate :Date | null;
  endDateString:string;
  startDateString:string;
   activationStatus: Boolean;
   billingCityName:string;
   billingStateName:string;
   customerName:string;
  userID: number;
  isBaseForInvoicing:Boolean;
  isSEZ:Boolean;
  sezStartDate: Date | null;
  sezEndDate:Date | null;
  sezStartDateString:string;
  sezEndDateString:string;  

  constructor(customerConfigurationInvoicing) {
    {
       this.customerConfigurationInvoicingID = customerConfigurationInvoicing.customerConfigurationInvoicingID || -1;
       this.customerID = customerConfigurationInvoicing.customerID || '';
       this.gstNumber = customerConfigurationInvoicing.gstNumber || '';
       this.gstRate = customerConfigurationInvoicing.gstRate || '';
       this.billingName = customerConfigurationInvoicing.billingName || '';
       this.billingAddress = customerConfigurationInvoicing.billingAddress || '';
       this.billingCityID = customerConfigurationInvoicing.billingCityID || '';
       this.billingStateID = customerConfigurationInvoicing.billingStateID || '';
       this.billingPin = customerConfigurationInvoicing.billingPin || '';
       this.eInvoiceAddress = customerConfigurationInvoicing.eInvoiceAddress || '';
       this.startDateString = customerConfigurationInvoicing.startDateString || '';
       this.endDateString = customerConfigurationInvoicing.endDateString || '';
       this.activationStatus = customerConfigurationInvoicing.activationStatus || '';
       this.customerName = customerConfigurationInvoicing.customerName || '';
       this.isBaseForInvoicing = customerConfigurationInvoicing.isBaseForInvoicing || '';
       this.isSEZ = customerConfigurationInvoicing.isSEZ || '';
       this.sezStartDate = customerConfigurationInvoicing.sezStartDate ? new Date(customerConfigurationInvoicing.sezStartDate) : null;
       this.sezEndDate = customerConfigurationInvoicing.sezEndDate ? new Date(customerConfigurationInvoicing.sezEndDate) : null;
       this.startDate=new Date();
       //this.endDate=new Date();
      //  this.sezStartDate=new Date();
      //  this.sezEndDate=new Date();
    }
  }
  
}

