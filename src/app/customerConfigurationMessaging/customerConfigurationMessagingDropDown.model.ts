// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationMessagingDropDown {
 
   customerConfigurationMessagingID: number;
   customerConfigurationMessaging: string;

  constructor(customerConfigurationMessagingDropDown) {
    {
       this.customerConfigurationMessagingID = customerConfigurationMessagingDropDown.customerConfigurationMessagingID || -1;
       this.customerConfigurationMessaging = customerConfigurationMessagingDropDown.customerConfigurationMessaging || '';
    }
  }
  
}

