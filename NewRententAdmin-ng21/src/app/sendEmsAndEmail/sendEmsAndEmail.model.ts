// @ts-nocheck
import { formatDate } from '@angular/common';
export class SendEmsAndEmail {
  pickupDateString:string;
  pickupDate:Date;
  pickupTimeString:string;
  pickupTime:Date;
  bookingNo:string;
  geoPointName:string; 
  carNo:string;
  carSend:string;
  serviceStaffName:string;
  serviceStaffMobile:string;
  primaryEmail:string;
  primarymobile:string;
  customerPerson:any;
  reservationStatusText:string;
  reservationsend:string;
  additionNo:string;
  reasonToResend:string;
  sendSMSWhatsApp:boolean;
  employeeID:number;
  constructor(object) {
    {
       this.pickupDateString = object.pickupDateString || '';
       this.pickupTimeString = object.pickupTimeString || '';
       this.bookingNo = object.bookingNo || '';
       this.primaryEmail = object.primaryEmail || '';
       this.geoPointName = object.geoPointName || '';
       this.carNo = object.carNo || '';
       this.primarymobile = object.primarymobile || '';
       this.carSend = object.carSend || '';
       this.serviceStaffName = object.serviceStaffName || '';
       this.serviceStaffMobile = object.serviceStaffMobile || '';
       this.customerPerson = object.item || '';
       this.pickupDate=new Date();
       this.pickupTime=new Date();
    }
  }
  
}

export class ConfigurationMessaging
{
  customerPersonName:string;
  reachedSMSToBooker:boolean;
  reachedSMSToPassenger:boolean;
  sendSMSWhatsApp:boolean;
  primaryMobile:string;
  primaryEmail:string;
  isBooker:boolean;
  isPassenger:boolean;
  type:string;
  id:number;
  isCustomerNotificationsAllowed:boolean;
  isCustomerPersonNotificationsAllowed:boolean;
  mobile:string;
  email:string;
  name:string;

  constructor(configurationMessaging){
    {
      this.customerPersonName = configurationMessaging.customerPersonName || '';
      this.reachedSMSToBooker = configurationMessaging.reachedSMSToBooker || '';
      this.reachedSMSToPassenger = configurationMessaging.reachedSMSToPassenger || '';
      this.sendSMSWhatsApp = configurationMessaging.sendSMSWhatsApp || '';
      this.primaryMobile = configurationMessaging.primaryMobile || '';
      this.primaryEmail = configurationMessaging.primaryEmail || '';
      this.isBooker = configurationMessaging.isBooker || '';
      this.isPassenger = configurationMessaging.isPassenger || '';
    }
  }

}

// export class AdditionalData
// {
//   id:number;
//   name:string;
//   mobile:string;
//   email:string;
//   type:string;
//   isCustomerNotificationsAllowed:boolean;
//   isCustomerPersonNotificationsAllowed:boolean;
//   sendSMSWhatsApp:boolean;
//   constructor(additionalData){
//     {
//       this.id = additionalData.id || '';
//       this.name = additionalData.name || '';
//       this.mobile = additionalData.mobile || '';
//       this.email = additionalData.email || '';
//       this.type = additionalData.type || '';
//       this.isCustomerNotificationsAllowed = additionalData.isCustomerNotificationsAllowed || '';
//       this.isCustomerPersonNotificationsAllowed = additionalData.isCustomerPersonNotificationsAllowed || '';
//       this.sendSMSWhatsApp = additionalData.sendSMSWhatsApp || '';
//     }
//   }

// }

