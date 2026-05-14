// @ts-nocheck
import { formatDate } from '@angular/common';
export class EmailInfoModel {

  // Reservation
  reservationID: number;
  reservationStatus: string;
  reservationGroupID: number;

  // Booker
  booker: CustomerPersonModel;

  // Passenger
  passenger: CustomerPersonModel;

  // Customer
  customerID: number | null;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;

  // Vehicle
  vehicle: VehicleModel;

  // Company
  companyName: string;

  // Package
  package: PackageModel;

  // Pickup
  pickup: PickupModel;

  // Drop
  drop: DropOffModel;

  // Organizational Entity
  organizationalEntityName: string;
  organizationalEntityAddressString: string;

  // Transfer
  transferedLocationID: number | null;
  transferedLocation: string;

  // Extra Fields
  city: string;
  modeOfPayment: string;
  reportTime: Date | null;

  // Special Instructions
  specialInstructions: ReservationSpecialInstructionModel[];

  constructor(emailInfo?: any) {

    this.reservationID = emailInfo?.reservationID || 0;
    this.reservationStatus = emailInfo?.reservationStatus || '';
    this.reservationGroupID = emailInfo?.reservationGroupID || 0;

    // Booker
    this.booker = emailInfo?.booker || new CustomerPersonModel();

    // Passenger
    this.passenger = emailInfo?.passenger || new CustomerPersonModel();

    // Customer
    this.customerID = emailInfo?.customerID || null;
    this.customerName = emailInfo?.customerName || '';
    this.customerGroupID = emailInfo?.customerGroupID || 0;
    this.customerGroup = emailInfo?.customerGroup || '';

    // Vehicle
    this.vehicle = emailInfo?.vehicle || new VehicleModel();

    // Company
    this.companyName = emailInfo?.companyName || '';

    // Package
    this.package = emailInfo?.package || new PackageModel();

    // Pickup
    this.pickup = emailInfo?.pickup || new PickupModel();

    // Drop
    this.drop = emailInfo?.drop || new DropOffModel();

    // Organizational Entity
    this.organizationalEntityName =
      emailInfo?.organizationalEntityName || '';

    this.organizationalEntityAddressString =
      emailInfo?.organizationalEntityAddressString || '';

    // Transfer
    this.transferedLocationID =
      emailInfo?.transferedLocationID || null;

    this.transferedLocation =
      emailInfo?.transferedLocation || '';

    // Extra Fields
    this.city = emailInfo?.city || '';

    this.modeOfPayment =
      emailInfo?.modeOfPayment || '';

    this.reportTime =
      emailInfo?.reportTime
        ? new Date(emailInfo.reportTime)
        : null;

    // Special Instructions
    this.specialInstructions =
      emailInfo?.specialInstructions || [];
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
