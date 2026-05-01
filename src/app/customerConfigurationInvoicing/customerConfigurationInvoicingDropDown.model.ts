// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationInvoicingDropDown {
   customerConfigurationInvoicingID: number;
   supplierContractID: string;

  constructor(customerConfigurationInvoicingDropDown) {
    {
       this.customerConfigurationInvoicingID = customerConfigurationInvoicingDropDown.customerConfigurationInvoicingID || -1;
       this.supplierContractID = customerConfigurationInvoicingDropDown.supplierContractID || '';
    }
  }
  
}

export class CustomerCityModel {
   geoPointID: number;
   geoPointName: string;
   billingAddress: string;
   billingPin: string;

  constructor(customerCityModel) {
    {
       this.geoPointID = customerCityModel.geoPointID || '';
       this.geoPointName = customerCityModel.geoPointName || '';
       this.billingAddress = customerCityModel.billingAddress || '';
       this.billingPin = customerCityModel.billingPin || '';
    }
  }
  
}



