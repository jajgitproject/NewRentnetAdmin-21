// @ts-nocheck
import { formatDate } from '@angular/common';
export class InvoiceTemplate {
  invoiceTemplateID: number;
  invoiceTemplateName: string;
  address: string;
  templateType: string;
  activationStatus: boolean;
  userID: number;

  constructor(invoiceTemplate) {
    {
       this.invoiceTemplateID = invoiceTemplate.invoiceTemplateID || -1;
       this.invoiceTemplateName = invoiceTemplate.invoiceTemplateName || '';
       this.address = invoiceTemplate.address || '';
       this.templateType = invoiceTemplate.templateType || '';
       this.activationStatus = invoiceTemplate.activationStatus || '';
    }
  }
  
}

