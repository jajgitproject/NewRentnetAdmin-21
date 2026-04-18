// @ts-nocheck
import { formatDate } from '@angular/common';
export class SendSMS {
   bookingNo: number;
   city: string;
   carNo:string;
   pickupDateString:string;
  pickupDate:Date;
  pickupTimeString:string;
  pickupTime:Date;
  carSent:string;
  serviceStaffName:string;
  serviceStaffMobile:number;
  mobileNo:number;
  reasonToResend:string;
  customerPerson:any;
  sendSMSWhatsApp:boolean;

  constructor(sendSMS) {
    {
      
       this.bookingNo = sendSMS.bookingNo || '';
       this.city = sendSMS.city || '';
       this.carNo = sendSMS.carNo || '';
       this.pickupDateString = sendSMS.pickupDateString || '';
       this.pickupTimeString = sendSMS.pickupTimeString || '';
       
       this.carSent = sendSMS.carSent || '';
       this.serviceStaffName = sendSMS.serviceStaffName || '';
       this.serviceStaffMobile = sendSMS.serviceStaffMobile || '';
       this.mobileNo = sendSMS.mobileNo || '';
       this.reasonToResend = sendSMS.reasonToResend || '';
      
       this.pickupDate=new Date();
       this.pickupTime=new Date();
    }
  }
  
}
export class AddPeople
{
  number:string;
  customer:string;
  employee:string;
  addPeople:string;
  countryCode:string;
  name:string;
  constructor(addPeople){
    {
      this.number = addPeople.number || '';
       this.addPeople = addPeople.addPeople || '';
       this.customer = addPeople.customer || '';
       this.employee = addPeople.addPeople || '';
       this.countryCode = addPeople.countryCode || '';
       this.name = addPeople.name || '';
    }
  }
}

export class CustomerConfigurationMessaging
{
  customerPersonName:string;
  reachedSMSToBooker:boolean;
  reachedSMSToPassenger:boolean;
  sendSMSWhatsApp:boolean;
  primaryMobile:string;
  type:string;

  constructor(customerConfigurationMessaging){
    {
      this.customerPersonName = customerConfigurationMessaging.customerPersonName || '';
      this.reachedSMSToBooker = customerConfigurationMessaging.reachedSMSToBooker || '';
      this.reachedSMSToPassenger = customerConfigurationMessaging.reachedSMSToPassenger || '';
      this.sendSMSWhatsApp = customerConfigurationMessaging.sendSMSWhatsApp || '';
      this.primaryMobile = customerConfigurationMessaging.primaryMobile || '';
      this.type = customerConfigurationMessaging.type || '';
  
    }
  }

}
