// @ts-nocheck
import { formatDate } from '@angular/common';

export class CustomerInfo {
    //customerID: number;
    customerType: string;
    customerName: string; 
    customerCategory: string;
    billingInstrunction: string;
    otherInstrunctions: string;
  
    constructor(customerInfo) {
      {
        this.customerName = customerInfo.customerName || '';
        this.customerType = customerInfo.customerType || '';
        this.customerCategory = customerInfo.customerCategory || '';
        this.billingInstrunction=customerInfo.billingInstrunction || '';
        this.otherInstrunctions = customerInfo.otherInstrunctions || '';
      }
    }
}

export class BillingHistory {
  dutySlipForBillingID: number;
  dutySlipID: number; 
  userID: number; 
  actionTaken: string;
  actionDetails: string;
  verifyDuty : boolean;
  goodForBilling : boolean;

  constructor(billingHistory) {
    {
      this.dutySlipForBillingID = billingHistory.dutySlipForBillingID || '';
      this.dutySlipID = billingHistory.dutySlipID || '';
      this.userID = billingHistory.userID || '';
      this.actionTaken=billingHistory.actionTaken || '';
      this.actionDetails = billingHistory.actionDetails || '';
      this.goodForBilling = billingHistory.goodForBilling || '';
      this.verifyDuty = billingHistory.verifyDuty || '';
    }
  }
}

export class DutySlipMap {
  dutySlipMap: string;

  constructor(dutySlipMap) {
    {
      this.dutySlipMap = dutySlipMap.dutySlipMap || '';
    }
  }
}

export class CurrentDuty {
    reservationID: number;
     customerTypeID: number; 
     customerType: string; 
     customerID: number;
     customer: string;
     customerGroupID: number;
     customerGroup: string;
     primaryBookerID: number;
     primaryBooker: string;
     primaryPassengerID: number;
     primaryPassenger: string;
     vehicleID: number;
     vehicle: string;
     vehicleCategoryID: number;
     packageTypeID: number;
     packageType: string;
     packageID: number;
     package: string;
     stateID:number;
     state:string;
     pickupCityID: number;
     pickupCity: string;
     customerDesignation: string;
     customerDepartment: string;
     pickupDate: string;
     closureMethod:string;
  
    constructor(currentDuty) {
      {
        this.reservationID = currentDuty.reservationID || -1;
        this.customerTypeID = currentDuty.customerTypeID || '';
        this.customerID = currentDuty.customerID || '';
        this.customerGroupID=currentDuty.customerGroupID || '';
        this.primaryBookerID = currentDuty.primaryBookerID || '';
        this.primaryPassengerID = currentDuty.primaryPassengerID || '';
        this.vehicleID=currentDuty.vehicleID || '';
        this.packageTypeID = currentDuty.packageTypeID || '';
        this.packageID = currentDuty.packageID || '';
        this.pickupCityID = currentDuty.pickupCityID || '';
        this.vehicleCategoryID=currentDuty.vehicleCategoryID || '';
        this.stateID=currentDuty.stateID || '';
        this.state=currentDuty.state || '';
        this.customerType = currentDuty.customerType || '';
        this.customer = currentDuty.customer || '';
        this.customerGroup=currentDuty.customerGroup || '';
        this.primaryBooker = currentDuty.primaryBooker || '';
        this.primaryPassenger = currentDuty.primaryPassenger || '';
        this.vehicle=currentDuty.vehicle || '';
        this.packageType = currentDuty.packageType || '';
        this.package = currentDuty.package || '';
        this.pickupCity = currentDuty.pickupCity || '';
      }
    }
    
  }

  export class ClosingDetailShowModel{
    dutySlipForBillingID:number;
    dutySlipID:number;
    locationOutLocationOrHubID:number;
    locationOutDateForBilling:Date;
    locationOutDateForBillingString:string;
    locationOutTimeForBilling:Date;
    locationOutTimeForBillingString:string;
    locationOutKMForBilling:number;
    locationOutLatLongForBilling:string;
    locationOutAddressStringForBilling:string;

    locationOutKMForBillingManual:number;
    locationOutKMForBillingApp:number;
    locationOutKMForBillingGPS:number;

    reportingToGuestDateForBilling:Date;
    reportingToGuestDateForBillingString:string;
    reportingToGuestTimeForBilling:Date;
    reportingToGuestTimeForBillingString:string;
    reportingToGuestKMForBilling:number;
    reportingToGuestLatLongForBilling:string;
    reportingToGuestAddressStringForBilling:string;

    pickUpDateForBilling:Date;
    pickUpDateForBillingString:string;
    pickUpTimeForBilling:Date;
    pickUpTimeForBillingString:string;
    pickUpKMForBilling:number;
    pickUpLatLongForBilling:string;
    pickUpAddressStringForBilling:string;

    pickUpKMForBillingManual:number;
    pickUpKMForBillingApp:number;
    pickUpKMForBillingGPS:number;

    dropOffDateForBilling:Date;
    dropOffDateForBillingString:string;
    dropOffTimeForBilling:Date;
    dropOffTimeForBillingString:string;
    dropOffKMForBilling:number;
    dropOffLatLongForBilling:string;
    dropOffAddressStringForBilling:string;

    dropOffKMForBillingManual:number;
    dropOffKMForBillingApp:number;
    dropOffKMForBillingGPS:number;

    locationInDateForBilling:Date;
    locationInDateForBillingString:string;
    locationInTimeForBilling:Date;
    locationInTimeForBillingString:string;
    locationInKMForBilling:number;
    locationInLatLongForBilling:string;
    locationInAddressStringForBilling:string;
    locationInLocationOrHubID:number;

    disputeKMs:number;
    disputeMinutes:number;
    disputeReason:string;
    disputeApprovedByID:number;
    additionalKMs:number;
    additionalMinutes:number;
    driverConveyanceKMsFrom:number;
    driverConveyanceKMsTo:number;
    runningDetails:string;
    totalCustomerAdvance:number;
    discountApplicableOn:string;
    discountPercentage:number;
    discountApplicableAmount:number;
    discountAmount:number;
    dutyTypeID:number;
    packageID:number;

    constructor(closingDetailShowModel) {
        {
          this.dutySlipForBillingID = closingDetailShowModel.dutySlipForBillingID || '';
          this.dutySlipID = closingDetailShowModel.dutySlipID || '';
          this.locationOutLocationOrHubID = closingDetailShowModel.locationOutLocationOrHubID || '';
          this.locationOutDateForBillingString = closingDetailShowModel.locationOutDateForBillingString || '';
          this.locationOutTimeForBillingString = closingDetailShowModel.locationOutTimeForBillingString || '';
          this.locationOutKMForBilling = closingDetailShowModel.locationOutKMForBilling || '';
          this.locationOutLatLongForBilling = closingDetailShowModel.locationOutLatLongForBilling || '';
          this.locationOutAddressStringForBilling = closingDetailShowModel.locationOutAddressStringForBilling || '';
          this.locationOutDateForBilling=new Date();
          this.locationOutTimeForBilling=new Date();

          this.reportingToGuestDateForBillingString = closingDetailShowModel.reportingToGuestDateForBillingString || '';
          this.reportingToGuestTimeForBillingString = closingDetailShowModel.reportingToGuestTimeForBillingString || '';
          this.reportingToGuestKMForBilling = closingDetailShowModel.reportingToGuestKMForBilling || '';
          this.reportingToGuestLatLongForBilling = closingDetailShowModel.reportingToGuestLatLongForBilling || '';
          this.reportingToGuestAddressStringForBilling = closingDetailShowModel.reportingToGuestAddressStringForBilling || '';
          this.reportingToGuestDateForBilling=new Date();
          this.reportingToGuestTimeForBilling=new Date();

          this.pickUpDateForBillingString = closingDetailShowModel.pickUpDateForBillingString || '';
          this.pickUpTimeForBillingString = closingDetailShowModel.pickUpTimeForBillingString || '';
          this.pickUpKMForBilling = closingDetailShowModel.pickUpKMForBilling || '';
          this.pickUpLatLongForBilling = closingDetailShowModel.pickUpLatLongForBilling || '';
          this.pickUpAddressStringForBilling = closingDetailShowModel.pickUpAddressStringForBilling || '';
          this.pickUpDateForBilling=new Date();
          this.pickUpTimeForBilling=new Date();

          this.dropOffDateForBillingString = closingDetailShowModel.dropOffDateForBillingString || '';
          this.dropOffTimeForBillingString = closingDetailShowModel.dropOffTimeForBillingString || '';
          this.dropOffKMForBilling = closingDetailShowModel.dropOffKMForBilling || '';
          this.dropOffLatLongForBilling = closingDetailShowModel.dropOffLatLongForBilling || '';
          this.dropOffAddressStringForBilling = closingDetailShowModel.dropOffAddressStringForBilling || '';
          this.dropOffDateForBilling=new Date();
          this.dropOffTimeForBilling=new Date();

          this.locationInLocationOrHubID = closingDetailShowModel.locationInLocationOrHubID || 0;
          this.locationInDateForBillingString = closingDetailShowModel.locationInDateForBillingString || '';
          this.locationInTimeForBillingString = closingDetailShowModel.locationInTimeForBillingString || '';
          this.locationInKMForBilling = closingDetailShowModel.locationInKMForBilling || '';
          this.locationInLatLongForBilling = closingDetailShowModel.locationInLatLongForBilling || '';
          this.locationInAddressStringForBilling = closingDetailShowModel.locationInAddressStringForBilling || '';
          this.locationInDateForBilling=new Date();
          this.locationInTimeForBilling=new Date();

          this.disputeKMs = closingDetailShowModel.disputeKMs || '';
          this.disputeMinutes = closingDetailShowModel.disputeMinutes || '';
          this.disputeReason = closingDetailShowModel.disputeReason || '';
          this.disputeApprovedByID = closingDetailShowModel.disputeApprovedByID || '';
          this.additionalKMs = closingDetailShowModel.additionalKMs || '';
          this.additionalMinutes = closingDetailShowModel.additionalMinutes || '';
          this.driverConveyanceKMsFrom = closingDetailShowModel.driverConveyanceKMsFrom || '';
          this.driverConveyanceKMsTo = closingDetailShowModel.driverConveyanceKMsTo || '';
          this.runningDetails = closingDetailShowModel.runningDetails || '';
          this.totalCustomerAdvance = closingDetailShowModel.totalCustomerAdvance || '';
          this.discountApplicableOn = closingDetailShowModel.discountApplicableOn || '';
          this.discountPercentage = closingDetailShowModel.additionalMinutes || '';
          this.discountApplicableAmount = closingDetailShowModel.discountApplicableAmount || '';
          this.discountAmount = closingDetailShowModel.discountAmount || '';
          this.dutyTypeID = closingDetailShowModel.dutyTypeID || '';
          this.packageID = closingDetailShowModel.packageID || '';
        }
      }
 }


 export class DutySlipForBillingModel{
  dutySlipForBillingID:number;
  dutySlipID:number;
  locationOutLocationOrHubID:number;
  locationOutDateForBilling:Date;
  locationOutDateForBillingString:string;
  locationOutTimeForBilling:Date;
  locationOutTimeForBillingString:string;
  locationOutKMForBilling:number;
  locationOutLatLongForBilling:string;
  locationOutAddressStringForBilling:string;

  reportingToGuestDateForBilling:Date;
  reportingToGuestDateForBillingString:string;
  reportingToGuestTimeForBilling:Date;
  reportingToGuestTimeForBillingString:string;
  reportingToGuestKMForBilling:number;
  reportingToGuestLatLongForBilling:string;
  reportingToGuestAddressStringForBilling:string;

  pickUpDateForBilling:Date;
  pickUpDateForBillingString:string;
  pickUpTimeForBilling:Date;
  pickUpTimeForBillingString:string;
  pickUpKMForBilling:number;
  pickUpLatLongForBilling:string;
  pickUpAddressStringForBilling:string;

  dropOffDateForBilling:Date;
  dropOffDateForBillingString:string;
  dropOffTimeForBilling:Date;
  dropOffTimeForBillingString:string;
  dropOffKMForBilling:number;
  dropOffLatLongForBilling:string;
  dropOffAddressStringForBilling:string;

  locationInDateForBilling:Date;
  locationInDateForBillingString:string;
  locationInTimeForBilling:Date;
  locationInTimeForBillingString:string;
  locationInKMForBilling:number;
  locationInLatLongForBilling:string;
  locationInAddressStringForBilling:string;
  locationInLocationOrHubID:number;
  dutyTypeID:number;
  packageID:number;
  closureMethod:string;
  customerSignatureImage:string;
  actionTaken:string;
  actionDetails:string;
  userID:number;

  constructor(closingDetailShowModel) {
      {
        this.dutySlipForBillingID = closingDetailShowModel.dutySlipForBillingID || '';
        this.dutySlipID = closingDetailShowModel.dutySlipID || '';
        this.locationOutLocationOrHubID = closingDetailShowModel.locationOutLocationOrHubID || '';
        this.locationOutDateForBillingString = closingDetailShowModel.locationOutDateForBillingString || '';
        this.locationOutTimeForBillingString = closingDetailShowModel.locationOutTimeForBillingString || '';
        this.locationOutKMForBilling = closingDetailShowModel.locationOutKMForBilling || '';
        this.locationOutLatLongForBilling = closingDetailShowModel.locationOutLatLongForBilling || '';
        this.locationOutAddressStringForBilling = closingDetailShowModel.locationOutAddressStringForBilling || '';
        this.locationOutDateForBilling=new Date();
        this.locationOutTimeForBilling=new Date();

        this.reportingToGuestDateForBillingString = closingDetailShowModel.reportingToGuestDateForBillingString || '';
        this.reportingToGuestTimeForBillingString = closingDetailShowModel.reportingToGuestTimeForBillingString || '';
        this.reportingToGuestKMForBilling = closingDetailShowModel.reportingToGuestKMForBilling || '';
        this.reportingToGuestLatLongForBilling = closingDetailShowModel.reportingToGuestLatLongForBilling || '';
        this.reportingToGuestAddressStringForBilling = closingDetailShowModel.reportingToGuestAddressStringForBilling || '';
        this.reportingToGuestDateForBilling=new Date();
        this.reportingToGuestTimeForBilling=new Date();

        this.pickUpDateForBillingString = closingDetailShowModel.pickUpDateForBillingString || '';
        this.pickUpTimeForBillingString = closingDetailShowModel.pickUpTimeForBillingString || '';
        this.pickUpKMForBilling = closingDetailShowModel.pickUpKMForBilling || '';
        this.pickUpLatLongForBilling = closingDetailShowModel.pickUpLatLongForBilling || '';
        this.pickUpAddressStringForBilling = closingDetailShowModel.pickUpAddressStringForBilling || '';
        this.pickUpDateForBilling=new Date();
        this.pickUpTimeForBilling=new Date();

        this.dropOffDateForBillingString = closingDetailShowModel.dropOffDateForBillingString || '';
        this.dropOffTimeForBillingString = closingDetailShowModel.dropOffTimeForBillingString || '';
        this.dropOffKMForBilling = closingDetailShowModel.dropOffKMForBilling || '';
        this.dropOffLatLongForBilling = closingDetailShowModel.dropOffLatLongForBilling || '';
        this.dropOffAddressStringForBilling = closingDetailShowModel.dropOffAddressStringForBilling || '';
        this.dropOffDateForBilling=new Date();
        this.dropOffTimeForBilling=new Date();

        this.locationInLocationOrHubID = closingDetailShowModel.locationInLocationOrHubID || 0;
        this.locationInDateForBillingString = closingDetailShowModel.locationInDateForBillingString || '';
        this.locationInTimeForBillingString = closingDetailShowModel.locationInTimeForBillingString || '';
        this.locationInKMForBilling = closingDetailShowModel.locationInKMForBilling || '';
        this.locationInLatLongForBilling = closingDetailShowModel.locationInLatLongForBilling || '';
        this.locationInAddressStringForBilling = closingDetailShowModel.locationInAddressStringForBilling || '';
        this.locationInDateForBilling=new Date();
        this.locationInTimeForBilling=new Date();
        this.dutyTypeID = closingDetailShowModel.dutyTypeID || '';
        this.packageID = closingDetailShowModel.packageID || '';
      }
    }
}


export class ClosingTableModel{
  // dutySlipForBillingID:number;
  // dutySlipID:number;
  // locationOutLocationOrHubID:number;
  locationOutDateForBilling:Date;
  locationOutDateForBillingString:string;
  locationOutTimeForBilling:Date;
  locationOutTimeForBillingString:string;
  locationOutKMForBilling:number;
  locationOutLatLongForBilling:string;
  locationOutAddressStringForBilling:string;

  // locationOutDateForDriver:Date;
  // locationOutDateForDriverString:string;
  // locationOutTimeForDriver:Date;
  // locationOutTimeForDriverString:string;
  // locationOutKMForDriver:number;
  // locationOutLatLongForDriver:string;
  // locationOutAddressStringForDriver:string;

  // locationOutDateForApp:Date;
  // locationOutDateForAppString:string;
  // locationOutTimeForApp:Date;
  // locationOutTimeForAppString:string;
  // locationOutKMForApp:number;
  // locationOutLatLongForApp:string;
  // locationOutAddressStringForApp:string;

  // locationOutDateForGPS:Date;
  // locationOutDateForGPSString:string;
  // locationOutTimeForGPS:Date;
  // locationOutTimeForGPSString:string;
  // locationOutKMForGPS:number;
  // locationOutLatLongForGPS:string;
  // locationOutAddressStringForGPS:string;

  reportingToGuestDateForBilling:Date;
  reportingToGuestDateForBillingString:string;
  reportingToGuestTimeForBilling:Date;
  reportingToGuestTimeForBillingString:string;
  reportingToGuestKMForBilling:number;
  reportingToGuestLatLongForBilling:string;
  reportingToGuestAddressStringForBilling:string;

  // reportingToGuestDateForDriver:Date;
  // reportingToGuestDateForDriverString:string;
  // reportingToGuestTimeForDriver:Date;
  // reportingToGuestTimeForDriverString:string;
  // reportingToGuestKMForDriver:number;
  // reportingToGuestLatLongForDriver:string;
  // reportingToGuestAddressStringForDriver:string;

  pickUpDateForBilling:Date;
  pickUpDateForBillingString:string;
  pickUpTimeForBilling:Date;
  pickUpTimeForBillingString:string;
  pickUpKMForBilling:number;
  pickUpLatLongForBilling:string;
  pickUpAddressStringForBilling:string;

  // pickUpDateForDriver:Date;
  // pickUpDateForDriverString:string;
  // pickUpTimeForDriver:Date;
  // pickUpTimeForDriverString:string;
  // pickUpKMForDriver:number;
  // pickUpLatLongForDriver:string;
  // pickUpAddressStringForDriver:string;
  
  // pickUpDateForApp:Date;
  // pickUpDateForAppString:string;
  // pickUpTimeForApp:Date;
  // pickUpTimeForAppString:string;
  // pickUpKMForApp:number;
  // pickUpLatLongForApp:string;
  // pickUpAddressStringForApp:string;

  // pickUpDateForGPS:Date;
  // pickUpDateForGPSString:string;
  // pickUpTimeForGPS:Date;
  // pickUpTimeForGPSString:string;
  // pickUpKMForGPS:number;
  // pickUpLatLongForGPS:string;
  // pickUpAddressStringForGPS:string;

  dropOffDateForBilling:Date;
  dropOffDateForBillingString:string;
  dropOffTimeForBilling:Date;
  dropOffTimeForBillingString:string;
  dropOffKMForBilling:number;
  dropOffLatLongForBilling:string;
  dropOffAddressStringForBilling:string;

  // dropOffDateForDriver:Date;
  // dropOffDateForDriverString:string;
  // dropOffTimeForDriver:Date;
  // dropOffTimeForDriverString:string;
  // dropOffKMForDriver:number;
  // dropOffLatLongForDriver:string;
  // dropOffAddressStringForDriver:string;

  // dropOffDateForApp:Date;
  // dropOffDateForAppString:string;
  // dropOffTimeForApp:Date;
  // dropOffTimeForAppString:string;
  // dropOffKMForApp:number;
  // dropOffLatLongForApp:string;
  // dropOffAddressStringForApp:string;

  // reportingToGuestDateForApp:Date;
  // reportingToGuestDateForAppString:string;
  // reportingToGuestTimeForApp:Date;
  // reportingToGuestTimeForAppString:string;
  // reportingToGuestKMForApp:number;
  // reportingToGuestLatLongForApp:string;
  // reportingToGuestAddressStringForApp:string;

  // dropOffDateForGPS:Date;
  // dropOffDateForGPSString:string;
  // dropOffTimeForGPS:Date;
  // dropOffTimeForGPSString:string;
  // dropOffKMForGPS:number;
  // dropOffLatLongForGPS:string;
  // dropOffAddressStringForGPS:string;

  //locationInLocationOrHubID:number;
  locationInDateForBilling:Date;
  locationInDateForBillingString:string;
  locationInTimeForBilling:Date;
  locationInTimeForBillingString:string;
  locationInKMForBilling:number;
  locationInLatLongForBilling:string;
  locationInAddressStringForBilling:string;

  // locationInDateForDriver:Date;
  // locationInDateForDriverString:string;
  // locationInTimeForDriver:Date;
  // locationInTimeForDriverString:string;
  // locationInKMForDriver:number;
  // locationInLatLongForDriver:string;
  // locationInAddressStringForDriver:string;

  // locationInDateForApp:Date;
  // locationInDateForAppString:string;
  // locationInTimeForApp:Date;
  // locationInTimeForAppString:string;
  // locationInKMForApp:number;
  // locationInLatLongForApp:string;
  // locationInAddressStringForApp:string;

  // locationInDateForGPS:Date;
  // locationInDateForGPSString:string;
  // locationInTimeForGPS:Date;
  // locationInTimeForGPSString:string;
  // locationInKMForGPS:number;
  // locationInLatLongForGPS:string;
  // locationInAddressStringForGPS:string;

  // reportingToGuestDateForGPS:Date;
  // reportingToGuestDateForGPSString:string;
  // reportingToGuestTimeForGPS:Date;
  // reportingToGuestTimeForGPSString:string;
  // reportingToGuestKMForGPS:number;
  // reportingToGuestLatLongForGPS:string;
  // reportingToGuestAddressStringForGPS:string;
  
  dutyTypeID:number;
  packageID:number;
  closureType:string;
  customerSignatureImage:string;

  locationToPickupTripKm:number;
  pickupToDropOffTripKm:number;
  dropOffToLocationInTripKm:number;

  endToHubKM:number;
  hubToStartKM:number;
  startToEndKM:number;
  reservationID:number;
  allotmentID:number;

  goodForBilling:boolean;
  verifyDuty:boolean;
  dsClosing:string;

  runningDetails:string;
  vendorRemark:string;
  userID:number;
  actionTaken:string;
  actionDetails:string;

  constructor(closingDetailShowModel) {
      {
        // this.dutySlipForBillingID = closingDetailShowModel.dutySlipForBillingID || '';
        // this.dutySlipID = closingDetailShowModel.dutySlipID || '';
        // this.locationOutLocationOrHubID = closingDetailShowModel.locationOutLocationOrHubID || '';
        this.closureType = closingDetailShowModel.closureType || '';
        this.locationOutDateForBillingString = closingDetailShowModel.locationOutDateForBillingString || '';
        this.locationOutTimeForBillingString = closingDetailShowModel.locationOutTimeForBillingString || '';
        this.locationOutKMForBilling = closingDetailShowModel.locationOutKMForBilling || '';
        this.locationOutLatLongForBilling = closingDetailShowModel.locationOutLatLongForBilling || '';
        this.locationOutAddressStringForBilling = closingDetailShowModel.locationOutAddressStringForBilling || '';
        this.locationOutDateForBilling=new Date();
        this.locationOutTimeForBilling=new Date();

        this.reportingToGuestDateForBillingString = closingDetailShowModel.reportingToGuestDateForBillingString || '';
        this.reportingToGuestTimeForBillingString = closingDetailShowModel.reportingToGuestTimeForBillingString || '';
        this.reportingToGuestKMForBilling = closingDetailShowModel.reportingToGuestKMForBilling || '';
        this.reportingToGuestLatLongForBilling = closingDetailShowModel.reportingToGuestLatLongForBilling || '';
        this.reportingToGuestAddressStringForBilling = closingDetailShowModel.reportingToGuestAddressStringForBilling || '';
        this.reportingToGuestDateForBilling=new Date();
        this.reportingToGuestTimeForBilling=new Date();

        // this.reportingToGuestDateForDriverString = closingDetailShowModel.reportingToGuestDateForDriverString || '';
        // this.reportingToGuestTimeForDriverString = closingDetailShowModel.reportingToGuestTimeForDriverString || '';
        // this.reportingToGuestKMForDriver = closingDetailShowModel.reportingToGuestKMForDriver || '';
        // this.reportingToGuestLatLongForDriver = closingDetailShowModel.reportingToGuestLatLongForDriver || '';
        // this.reportingToGuestAddressStringForDriver = closingDetailShowModel.reportingToGuestAddressStringForDriver || '';
        // this.reportingToGuestDateForDriver=new Date();
        // this.reportingToGuestTimeForDriver=new Date();

        // this.reportingToGuestDateForAppString = closingDetailShowModel.reportingToGuestDateForAppString || '';
        // this.reportingToGuestTimeForAppString = closingDetailShowModel.reportingToGuestTimeForAppString || '';
        // this.reportingToGuestKMForApp = closingDetailShowModel.reportingToGuestKMForApp || '';
        // this.reportingToGuestLatLongForApp = closingDetailShowModel.reportingToGuestLatLongForApp || '';
        // this.reportingToGuestAddressStringForApp = closingDetailShowModel.reportingToGuestAddressStringForApp || '';
        // this.reportingToGuestDateForApp=new Date();
        // this.reportingToGuestTimeForApp=new Date();

        // this.reportingToGuestDateForGPSString = closingDetailShowModel.reportingToGuestDateForGPSString || '';
        // this.reportingToGuestTimeForGPSString = closingDetailShowModel.reportingToGuestTimeForGPSString || '';
        // this.reportingToGuestKMForGPS = closingDetailShowModel.reportingToGuestKMForGPS || '';
        // this.reportingToGuestLatLongForGPS = closingDetailShowModel.reportingToGuestLatLongForGPS || '';
        // this.reportingToGuestAddressStringForGPS = closingDetailShowModel.reportingToGuestAddressStringForGPS || '';
        // this.reportingToGuestDateForGPS=new Date();
        // this.reportingToGuestTimeForGPS=new Date();

        this.pickUpDateForBillingString = closingDetailShowModel.pickUpDateForBillingString || '';
        this.pickUpTimeForBillingString = closingDetailShowModel.pickUpTimeForBillingString || '';
        this.pickUpKMForBilling = closingDetailShowModel.pickUpKMForBilling || '';
        this.pickUpLatLongForBilling = closingDetailShowModel.pickUpLatLongForBilling || '';
        this.pickUpAddressStringForBilling = closingDetailShowModel.pickUpAddressStringForBilling || '';
        this.pickUpDateForBilling=new Date();
        this.pickUpTimeForBilling=new Date();

        this.dropOffDateForBillingString = closingDetailShowModel.dropOffDateForBillingString || '';
        this.dropOffTimeForBillingString = closingDetailShowModel.dropOffTimeForBillingString || '';
        this.dropOffKMForBilling = closingDetailShowModel.dropOffKMForBilling || '';
        this.dropOffLatLongForBilling = closingDetailShowModel.dropOffLatLongForBilling || '';
        this.dropOffAddressStringForBilling = closingDetailShowModel.dropOffAddressStringForBilling || '';
        this.dropOffDateForBilling=new Date();
        this.dropOffTimeForBilling=new Date();

        //this.locationInLocationOrHubID = closingDetailShowModel.locationInLocationOrHubID || '';
        this.locationInDateForBillingString = closingDetailShowModel.locationInDateForBillingString || '';
        this.locationInTimeForBillingString = closingDetailShowModel.locationInTimeForBillingString || '';
        this.locationInKMForBilling = closingDetailShowModel.locationInKMForBilling || '';
        this.locationInLatLongForBilling = closingDetailShowModel.locationInLatLongForBilling || '';
        this.locationInAddressStringForBilling = closingDetailShowModel.locationInAddressStringForBilling || '';
        this.locationInDateForBilling=new Date();
        this.locationInTimeForBilling=new Date();
        this.dutyTypeID = closingDetailShowModel.dutyTypeID || '';
        this.packageID = closingDetailShowModel.packageID || '';


        this.endToHubKM = closingDetailShowModel.endToHubKM || '';
        this.hubToStartKM = closingDetailShowModel.hubToStartKM || '';
        this.startToEndKM = closingDetailShowModel.startToEndKM || '';

        this.locationToPickupTripKm = closingDetailShowModel.locationToPickupTripKm || '';
        this.pickupToDropOffTripKm = closingDetailShowModel.pickupToDropOffTripKm || '';
        this.dropOffToLocationInTripKm = closingDetailShowModel.dropOffToLocationInTripKm || '';

        this.goodForBilling = closingDetailShowModel.goodForBilling || '';
        this.verifyDuty = closingDetailShowModel.verifyDuty || '';
        this.dsClosing = closingDetailShowModel.dsClosing || '';

        this.runningDetails = closingDetailShowModel.runningDetails || '';
        this.vendorRemark = closingDetailShowModel.vendorRemark || '';
      }
    }
}

export class ClosingScreenCurrentDuty {
  allotmentID:number;
  dutySlipID:number;
  driverName:string;
  driverPhone:string;
  registrationNumber:string;
  vehicle:string;
  dateOfAllotment:Date;

  constructor(closingScreenCurrentDuty) {
    {
      this.dutySlipID = closingScreenCurrentDuty.dutySlipID || '';
      this.allotmentID = closingScreenCurrentDuty.allotmentID || '';
      this.driverName = closingScreenCurrentDuty.driverName || '';
      this.driverPhone = closingScreenCurrentDuty.driverPhone || '';
      this.registrationNumber=closingScreenCurrentDuty.registrationNumber || '';
      this.vehicle = closingScreenCurrentDuty.vehicle || '';
      this.dateOfAllotment = closingScreenCurrentDuty.dateOfAllotment || '';
    }
  }
}
  

export class KMForAppModel {
  dutySlipID:number;
  locationToPickupTripKm:number;
  pickupToDropOffTripKm:number;
  dropOffToLocationInTripKm:number;

  constructor(kmForAppModel) {
    {
      this.dutySlipID = kmForAppModel.dutySlipID || '';
      this.locationToPickupTripKm = kmForAppModel.locationToPickupTripKm || '';
      this.pickupToDropOffTripKm = kmForAppModel.pickupToDropOffTripKm || '';
      this.dropOffToLocationInTripKm = kmForAppModel.dropOffToLocationInTripKm || '';
    }
  }
}


export class KMForDriverModel {
  dutySlipID:number;
  endToHubKM:number;
  hubToStartKM:number;
  startToEndKM:number;
  locationOutKMByDriver:number;
  pickUpKMByDriver:number;
  dropOffKMByDriver:number;
  locationInKMByDriver:number;
  reportingToGuestKMByDriver:number;

  constructor(kmForDriverModel) {
    {
      this.dutySlipID = kmForDriverModel.dutySlipID || '';
      this.endToHubKM = kmForDriverModel.endToHubKM || '';
      this.hubToStartKM = kmForDriverModel.hubToStartKM || '';
      this.startToEndKM = kmForDriverModel.startToEndKM || '';
      this.locationOutKMByDriver = kmForDriverModel.locationOutKMByDriver || '';
      this.pickUpKMByDriver = kmForDriverModel.pickUpKMByDriver || '';
      this.locationInKMByDriver = kmForDriverModel.locationInKMByDriver || '';
      this.dropOffKMByDriver = kmForDriverModel.dropOffKMByDriver || '';
      this.reportingToGuestKMByDriver = kmForDriverModel.reportingToGuestKMByDriver || '';
    }
  }
}


export class KMPreviousBookingModel {
  locationOutKM:number;
  reportingToGuestKM:number;
  dropOffKM:number;
  pickUpKM:number;
  locationInKM:number;

  constructor(kMPreviousBookingModel) {
    {
      this.locationOutKM = kMPreviousBookingModel.locationOutKM || '';
      this.reportingToGuestKM = kMPreviousBookingModel.reportingToGuestKM || '';
      this.dropOffKM = kMPreviousBookingModel.dropOffKM || '';
      this.pickUpKM = kMPreviousBookingModel.pickUpKM || '';
      this.locationInKM = kMPreviousBookingModel.locationInKM || '';
    }
  }
}

export class ClosureTypeModel {
  closureType:string;

  constructor(closureTypeModel) {
    {
      this.closureType = closureTypeModel.closureType || '';
    }
  }
}

export class ReservationSalesPersonModel {
  reservationSalesPersonID:number;
  reservationID:number;
  salesPersonID:number;
  salesPerson:string;
  userID:number;
  activationStatus:boolean;

  constructor(reservationSalesPersonModel) {
    {
      this.reservationSalesPersonID = reservationSalesPersonModel.reservationSalesPersonID || '';
      this.reservationID = reservationSalesPersonModel.reservationID || '';
      this.salesPersonID = reservationSalesPersonModel.salesPersonID || '';
      this.salesPerson = reservationSalesPersonModel.salesPerson || '';
      this.activationStatus = reservationSalesPersonModel.activationStatus || '';
    }
  }
}



export class DutySlipByAppModel {
  locationOutDateByApp: Date;
  locationOutTimeByApp:Date;
  pickUpDateByApp:Date;
  pickUpTimeByApp:Date;
  dropOffDateByApp:Date;
  dropOffTimeByApp:Date;
  locationInDateByApp:Date;
  locationInTimeByApp:Date;

  constructor(dutySlipByAppModel) {
    {
      this.locationOutDateByApp = dutySlipByAppModel.locationOutDateByApp || '';
      this.locationOutTimeByApp = dutySlipByAppModel.locationOutTimeByApp || '';
      this.pickUpDateByApp = dutySlipByAppModel.pickUpDateByApp || '';
      this.pickUpTimeByApp=dutySlipByAppModel.pickUpTimeByApp || '';
      this.dropOffDateByApp = dutySlipByAppModel.dropOffDateByApp || '';
      this.dropOffTimeByApp = dutySlipByAppModel.dropOffTimeByApp || '';
      this.locationInDateByApp=dutySlipByAppModel.locationInDateByApp || '';
      this.locationInTimeByApp = dutySlipByAppModel.locationInTimeByApp || '';
    }
  }
}


export class ClosingDataModel {
  reservationID:number;
  allotmentID:number;
  dutySlipID:number;
  dutySlipForBillingID:number;
  customerID:number;
  packageID:number;
  packageTypeID:number;
  inventoryID:number;
  registrationNumber:string;

  pickupDate:Date;
  pickupTime:Date;
  pickupAddress:string;

  dropOffDate:Date;
  dropOffTime:Date;
  dropOffAddress:string;

  locationOutDate:Date;
  locationOutTime:Date;
  locationOutKM:number;
  locationOutAddress:string;

  closureStatus:string;
  vehicle:string;
  customerContractID:number;
  packageType:string;


  constructor(closingDataModel) {
    {
      this.reservationID = closingDataModel.reservationID || '';
      this.allotmentID = closingDataModel.allotmentID || '';
      this.dutySlipID = closingDataModel.dutySlipID || '';
      this.dutySlipForBillingID = closingDataModel.dutySlipForBillingID || '';
      this.customerID = closingDataModel.customerID || '';
      this.packageID = closingDataModel.packageID || '';
      this.packageTypeID = closingDataModel.packageTypeID || '';
      this.inventoryID = closingDataModel.inventoryID || '';

      this.registrationNumber = closingDataModel.registrationNumber || '';
      this.pickupDate = closingDataModel.pickupDate || '';

      this.pickupTime = closingDataModel.pickupTime || '';
      this.pickupAddress = closingDataModel.pickupAddress || '';
      this.dropOffDate = closingDataModel.dropOffDate || '';
      this.dropOffTime = closingDataModel.dropOffTime || '';
      this.dropOffAddress = closingDataModel.dropOffAddress || '';

      this.locationOutDate = closingDataModel.locationOutDate || '';
      this.locationOutTime = closingDataModel.locationOutTime || '';
      this.locationOutKM = closingDataModel.locationOutKM || '';
      this.locationOutAddress = closingDataModel.locationOutAddress || '';
      this.closureStatus = closingDataModel.closureStatus || '';
    }
  }
}
