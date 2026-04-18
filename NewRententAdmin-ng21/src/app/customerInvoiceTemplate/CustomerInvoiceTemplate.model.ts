// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerInvoiceTemplate {
  customerInvoiceTemplateID:number;
  invoiceTemplateID: number;
  customerID:number;
  startDate:Date;
  endDate:Date;
  startDateString:string;
  endDateString:string;
  invoiceTemplateName: string;
  activationStatus: boolean;
  userID: number;

  constructor(customerInvoiceTemplate) {
    {
      this.customerInvoiceTemplateID = customerInvoiceTemplate.customerInvoiceTemplateID || -1;
      this.invoiceTemplateID = customerInvoiceTemplate.invoiceTemplateID || '';
       this.customerID = customerInvoiceTemplate.customerID || '';
       this.invoiceTemplateName = customerInvoiceTemplate.invoiceTemplateName || '';
       this.startDateString = customerInvoiceTemplate.startDateString || '';
       this.endDateString = customerInvoiceTemplate.endDateString || '';
       this.activationStatus = customerInvoiceTemplate.activationStatus || '';
       this.startDate = new Date();
       this.endDate = new Date();
       
    }
  }
  
}

