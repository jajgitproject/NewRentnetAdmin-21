// @ts-nocheck
import { formatDate } from '@angular/common';
export class InvoiceTemplateDropDown {
  invoiceTemplateID: number;
  invoiceTemplateName: string;

  constructor(invoiceTemplateDropDown) {
    {
      this.invoiceTemplateID = invoiceTemplateDropDown.invoiceTemplateID || '';
      this.invoiceTemplateName = invoiceTemplateDropDown.invoiceTemplateName || '';
     
    }
  }
  
}

