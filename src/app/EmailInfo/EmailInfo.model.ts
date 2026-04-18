// @ts-nocheck
import { formatDate } from '@angular/common';
export class EmailInfoModel {
  reservationID: number;
  reservationStatus: string;
  reservationGroupID: number;
  customerPerson: CustomerPersonModel;

  customerID: number | null;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;
  vehicle: VehicleModel;
  companyName: string;
  package: PackageModel;

  pickup: PickupModel;
  drop: DropOffModel;

  organizationalEntityName: string;
  organizationalEntityAddressString: string;

  transferedLocationID: number | null;
  transferedLocation: string;

  specialInstruction: ReservationSpecialInstructionModel[];;
  constructor(emailInfo) {
    {
      this.reservationID = emailInfo.reservationID || 0;
      this.reservationStatus = emailInfo.reservationStatus || '';
      this.reservationGroupID = emailInfo.reservationGroupID || 0;
      this.customerPerson = emailInfo.customerPerson ;  
      this.customerID = emailInfo.customerID || null;
      this.customerName = emailInfo.customerName || '';
      this.customerGroupID = emailInfo.customerGroupID || 0;
      this.customerGroup = emailInfo.customerGroup || '';
      this.vehicle = emailInfo.vehicle ;
      this.companyName = emailInfo.companyName || '';
      this.package = emailInfo.package ;
      this.pickup = emailInfo.pickup;
      this.drop = emailInfo.drop ;
      this.organizationalEntityName = emailInfo.organizationalEntityName || '';
      this.organizationalEntityAddressString = emailInfo.organizationalEntityAddressString || '';
      this.transferedLocationID = emailInfo.transferedLocationID || null;
      this.transferedLocation = emailInfo.transferedLocation || '';
      this.specialInstruction = emailInfo.specialInstruction || '';

    }
  }
}
// ---------------- Customer Person ----------------

export class CustomerPersonModel {
  customerPersonID: number | null;
  customerPersonName: string;
  primaryEmail: string;
  importance: string;
  gender: string;
  primaryMobile: string;
   constructor(customerPersonModel) {
    {
      this.customerPersonID = customerPersonModel.customerPersonID || null;
      this.customerPersonName = customerPersonModel.customerPersonName || '';
      this.primaryEmail = customerPersonModel.primaryEmail || '';
      this.importance = customerPersonModel.importance || '';}
   }
    
}

// ---------------- Vehicle ----------------

export class VehicleModel {
  vehicleID: number | null;
  vehicle: string;
  vehicleCategoryID: number | null;
  vehicleCategory: string;
   constructor(vehicleModel) {
    {
      this.vehicleID = vehicleModel.vehicleID || null;
      this.vehicle = vehicleModel.vehicle || '';
      this.vehicleCategoryID = vehicleModel.vehicleCategoryID || null;
      this.vehicleCategory = vehicleModel.vehicleCategory || '';
    }
    }
  }


// ---------------- Package ----------------

export class PackageModel {
  packageID: number | null;
  package: string;
  serviceTypeID: number | null;
  serviceType: string;
   constructor(packageModel) {
    {
      this.packageID = packageModel.packageID || null;
      this.package = packageModel.package || '';
      this.serviceTypeID = packageModel.serviceTypeID || null;
      this.serviceType = packageModel.serviceType || '';
    }}
}

// ---------------- Pickup ----------------

export class PickupModel {
  pickupDate: string | null;     // received as string from API
  pickupTime: string | null;
  pickupAddress: string;
  pickupAddressDetails: string;
  constructor(pickupModel) {
    {
      this.pickupDate = pickupModel.pickupDate || null;
      this.pickupTime = pickupModel.pickupTime || null;
      this.pickupAddress = pickupModel.pickupAddress || '';
      this.pickupAddressDetails = pickupModel.pickupAddressDetails || '';
    }}
}

// ---------------- Drop Off ----------------

export class DropOffModel {
  dropOffDate: string | null;
  dropOffTime: string | null;
  dropOffAddress: string;
  dropOffAddressDetails: string;
  constructor(dropOffModel) {
    {
      this.dropOffDate = dropOffModel.dropOffDate || null;
      this.dropOffTime = dropOffModel.dropOffTime || null;
      this.dropOffAddress = dropOffModel.dropOffAddress || '';
      this.dropOffAddressDetails = dropOffModel.dropOffAddressDetails || '';
    }}
}
class ReservationSpecialInstructionModel {

  specialInstruction: string;
  constructor(si) {
  
    this.specialInstruction = si.specialInstruction || '';
    
  }
}
