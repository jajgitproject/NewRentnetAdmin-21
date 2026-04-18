// @ts-nocheck
import { formatDate } from '@angular/common';
export class BookingBackupMIS {
  reservationID :number;
  customerID  :number;
  primaryBookerID :number;
  modeOfPaymentID :number;
  transferedLocationID :number;
  packageTypeID :number;
  vehicleID  :number;
  dutySlipID:number;
  inventoryID :number;
  driverID :number;
  customerDesignationID :number;
  primaryPassengerID :number;
  reservationExecutiveID :number;
 
 
  pickupDate :Date;
  pickupTime :Date;
  bookingTime :Date;
  bookingDate:Date;
  cancellationDateTime :Date;
  locationOutTime :Date;
  reportingToGuestTime :Date;
 
                                 
 
  city :string;
  pickupAddress :string;
  serviceLocation :string;
  transferLocation :string;
  modeOfPayment :string;
  bookerName:string;
  bookerMobile:string;
  vehicle :string;
  packageType :string;
  guestName:string;
  gender:string;
  importance :string;
  primaryMobile :string;
  customerDesignation:string;
  primaryEmail:string;
  customerName :string;
  package:string;
  specialInstruction :string;
  reservationInternalNote:string;
  bookingType :string;
  customerSpecificFields :string;
  driverName :string;
  driverMobile:string;
  registrationNumber:string;
  tripStatus :string;
  supplierName :string;
  loggedInUser:string;
  customerDepartment :string;
  gSTNumber :string;
  salesPerson :string;
  manualDutySlipNumber:string;
  reservationStatus:string;
  pickupDetail:string;
  pickupSubDetail:string;
  customerGroup:string;
  
  constructor(bookingBackupMIS) {
    {

       this.reservationID = bookingBackupMIS.reservationID || '';
       this.customerID  = bookingBackupMIS.customerID || '';
       this.primaryBookerID = bookingBackupMIS.primaryBookerID || '';
       this.modeOfPaymentID = bookingBackupMIS.modeOfPaymentID || '';
       this.transferedLocationID = bookingBackupMIS.transferedLocationID || '';
       this.packageTypeID = bookingBackupMIS.packageTypeID || '';
       this.vehicleID  = bookingBackupMIS.vehicleID || '';
       this.dutySlipID= bookingBackupMIS.dutySlipID || '';
       this.inventoryID = bookingBackupMIS.inventoryID || '';
       this.driverID = bookingBackupMIS.driverID || '';
       this.customerDesignationID = bookingBackupMIS.customerDesignationID || '';
       this.primaryPassengerID = bookingBackupMIS.primaryPassengerID || '';
       this.reservationExecutiveID = bookingBackupMIS.reservationExecutiveID || '';


       this.pickupDate= bookingBackupMIS.pickupDate || '';
       this.pickupTime= bookingBackupMIS.pickupTime || '';
       this.bookingTime= bookingBackupMIS.bookingTime || '';
       this.bookingDate= bookingBackupMIS.bookingDate || '';
       this.cancellationDateTime= bookingBackupMIS.cancellationDateTime || '';
       this.locationOutTime= bookingBackupMIS.locationOutTime || '';
       this.reportingToGuestTime= bookingBackupMIS.reportingToGuestTime || '';

       this.city= bookingBackupMIS.city || '';
       this.pickupAddress= bookingBackupMIS.pickupAddress || '';
       this.serviceLocation= bookingBackupMIS.serviceLocation || '';
       this.transferLocation= bookingBackupMIS.transferLocation || '';
       this.modeOfPayment= bookingBackupMIS.modeOfPayment || '';
       this.bookerName= bookingBackupMIS.bookerName || '';
       this.bookerMobile= bookingBackupMIS.bookerMobile || '';
       this.vehicle= bookingBackupMIS.vehicle || '';
       this.packageType= bookingBackupMIS.packageType || '';
       this.guestName= bookingBackupMIS.guestName || '';
       this.gender= bookingBackupMIS.gender || '';
       this.importance= bookingBackupMIS.importance || '';
       this.primaryMobile= bookingBackupMIS.primaryMobile || '';
       this.customerDesignation= bookingBackupMIS.customerDesignation || '';
       this.primaryEmail= bookingBackupMIS.primaryEmail || '';
       this.customerName= bookingBackupMIS.customerName || '';
       this.package= bookingBackupMIS.package || '';
       this.specialInstruction= bookingBackupMIS.specialInstruction || '';
       this.reservationInternalNote= bookingBackupMIS.reservationInternalNote || '';
       this.bookingType= bookingBackupMIS.bookingType || '';
       this.customerSpecificFields= bookingBackupMIS.customerSpecificFields || '';
       this.driverName= bookingBackupMIS.driverName || '';
       this.driverMobile= bookingBackupMIS.driverMobile || '';
       this.registrationNumber= bookingBackupMIS.registrationNumber || '';
       this.tripStatus= bookingBackupMIS.tripStatus || '';
       this.supplierName= bookingBackupMIS.supplierName || '';
       this.loggedInUser= bookingBackupMIS.loggedInUser || '';
       this.customerDepartment= bookingBackupMIS.customerDepartment || '';
       this.gSTNumber= bookingBackupMIS.gSTNumber || '';
       this.salesPerson= bookingBackupMIS.salesPerson || '';
       this.manualDutySlipNumber= bookingBackupMIS.manualDutySlipNumber || '';
       this.reservationStatus= bookingBackupMIS.reservationStatus || '';
       this.pickupDetail=bookingBackupMIS.pickupDetail || '';
       this.pickupSubDetail=bookingBackupMIS.pickupSubDetail || '';
       this.customerGroup = bookingBackupMIS.customerGroup || '';
     
    }
  }
  
}
export class SalesPersonModel{
  salesPersonID :number;
  salesPerson:string;
  constructor(salesPersonDropDownModel) {
    {
      this.salesPersonID= salesPersonDropDownModel.salesPersonID || '';
       this.salesPerson= salesPersonDropDownModel.salesPerson || '';

    }
  }
}

