// @ts-nocheck
import { AllotmentStatusDetails } from "../AllotmentStatusDetails/AllotmentStatusDetails.model";

export class ControlPanelHeaderData {
  totalRecords: number;
  reservationHeaderDetails: ControlPanelHeaderDetails[];
  constructor(controlPanelData) {
    this.totalRecords = controlPanelData.totalRecords || '';
    this.reservationHeaderDetails = controlPanelData.reservationHeaderDetails;
  }
}

export class ControlPanelHeaderDetails {
  reservationID: number;
  customerGroupID:number;
  pickupCity:string;
  pickupDate:Date;
  pickupTime:Date;
  passengerName:string;
  primaryPassengerID:number;
  gender:string;
  importance:string;
  vehicle:string;
  vehicleCategory:string;
  registrationNumber:string;
  driverName:string;
  driverPhone:string;
  reservationStatus:string;
  tripTo:string;
  newCustomer:boolean;
  
  
  constructor(controlPanelHeaderDetails) {
    this.reservationID = controlPanelHeaderDetails.reservationID || '';
    this.customerGroupID = controlPanelHeaderDetails.customerGroupID || '';
    this.pickupCity = controlPanelHeaderDetails.pickupCity;
    this.pickupDate = controlPanelHeaderDetails.pickupDate;
    this.pickupTime = controlPanelHeaderDetails.pickupTime;
    this.passengerName = controlPanelHeaderDetails.passengerName;
    this.gender = controlPanelHeaderDetails.gender;
    this.importance = controlPanelHeaderDetails.importance;
    this.vehicle = controlPanelHeaderDetails.vehicle;
    this.vehicleCategory = controlPanelHeaderDetails.vehicleCategory;
    this.registrationNumber = controlPanelHeaderDetails.registrationNumber;
    this.driverName = controlPanelHeaderDetails.driverName;
    this.driverPhone = controlPanelHeaderDetails.driverPhone;
    this.reservationStatus = controlPanelHeaderDetails.reservationStatus;
    this.tripTo = controlPanelHeaderDetails.tripTo;
    this.newCustomer = controlPanelHeaderDetails.newCustomer;
  }
}

export class ControlPanelData {
  totalRecords: number;
  reservationDetails: ControlPanelDetails[];
  constructor(controlPanelData) {
    this.totalRecords = controlPanelData.totalRecords || '';
    this.reservationDetails = controlPanelData.reservationDetails;
  }
}

export class ControlPanelDetails {
  reservationID: number;
  dutySlipID: number;
  allotmentID: number;
  companyName:string;
  reservationStatus: string;
  customerPerson: CustomerPersonModel;
  vehicle: VehicleModel;
  package: PackageModel;
  allotmentStatus: string;
  pickup: PickupModel;
  drop: DropOffModel;
  specialInstruction: ReservationSpecialInstructionModel[];
  passengerDetails: PassengerModel[];
  allotmentStatusDetails: AllotmentStatusDetails[];
  allotment: PassengerModel[];
  stopsDetails: StopsModel[];
  FeedBackDetails: FeedBackDetailsModel;
  driverName:string;
  isDone: boolean;
  pickupCityID:number;
  carVendor:string;
  isOpen: boolean;
  allotmentType:string;
  driverID:number;
  serviceLocationID:number;
  customerName:string;
  transferedLocationID:number;
  internalNote:InternalNote[];
  customerSector:string;
  dutySlipType:string;
  printRunningDetailOnDutySlip:boolean;
  showRateOnDutySlip:boolean;
  showOTPOnDutySlip:boolean;

  constructor(details) {
    this.reservationID = details.reservationID || '';
    this.reservationStatus = details.reservationStatus || '';
    this.customerPerson = details.customerPerson;
    this.vehicle = details.vehicle;
    this.package = details.package;
    this.pickup = details.package;
    this.drop = details.drop;
    this.specialInstruction = details.specialInstruction;
    this.FeedBackDetails = details.FeedBackDetails;
    this.passengerDetails = details.passengerDetails;
    this.stopsDetails = details.stopsDetails;
    this.carVendor = details.carVendor;
    this.pickupCityID = details.pickupCityID 
  }
}

class CustomerPersonModel {
  customerPersonID: number;
  customerPersonName: string;
  primaryEmail: string;
  primaryMobile: string;
  importance: string;
  gender: string;
  preferAppBasedDriver: boolean;
  customerDesignationID: string;
  customerDesignation: string;
  customerDepartmentID: string;
  customerDepartment: string;

  constructor(customerPerson) {
    this.customerPersonID = customerPerson.customerPersonID || '';
    this.customerPersonName = customerPerson.customerPersonName || '';
    this.primaryEmail = customerPerson.primaryEmail || '';
    this.primaryMobile = customerPerson.primaryMobile || '';
    this.importance = customerPerson.importance || '';
    this.gender = customerPerson.gender || '';
    this.preferAppBasedDriver =
      customerPerson.preferAppBasedDriver === true ||
      customerPerson.preferAppBasedDriver === 'true' ||
      customerPerson.preferAppBasedDriver === 1 ||
      String(customerPerson.preferAppBasedDriver || '').toLowerCase() === 'yes';
    this.customerDesignationID = customerPerson.customerDesignationID || '';
    this.customerDesignation = customerPerson.customerDesignation || '';
    this.customerDepartmentID = customerPerson.customerDepartmentID || '';
    this.customerDepartment = customerPerson.customerDepartment || '';
  }
}

class VehicleModel {
  vehicleID: number;
  vehicle: string;
  vehicleImage: string;
  vehicleAltTag: string;
  vehicleSittingCapacity: number;
  vehicleBaggageCapacity: number;
  vehicleAcrissCode: string;
  vehicleCategoryID: number;
  vehicleCategory: string;
  vehicleCategoryLevel: string;
  vehicleCategoryImage: string;
  description: string;
  vehicleManufacturerID: number;
  vehicleManufacturer: string;
  logo: string;
  previousCategory: string;
  nextCategory: string;

  constructor(vehicle) {
    this.vehicleID = vehicle.vehicleID || '';
    this.vehicle = vehicle.vehicle || '';
    this.vehicleImage = vehicle.vehicleImage || '';
    this.vehicleAltTag = vehicle.vehicleAltTag || '';
    this.vehicleSittingCapacity = vehicle.vehicleSittingCapacity || '';
    this.vehicleBaggageCapacity = vehicle.vehicleBaggageCapacity || '';
    this.vehicleAcrissCode = vehicle.vehicleAcrissCode || '';
    this.vehicleCategoryID = vehicle.vehicleCategoryID || '';
    this.vehicleCategory = vehicle.vehicleCategory || '';
    this.vehicleCategoryLevel = vehicle.vehicleCategoryLevel || '';
    this.vehicleCategoryImage = vehicle.vehicleCategoryImage || '';
    this.description = vehicle.description || '';
    this.vehicleManufacturerID = vehicle.vehicleManufacturerID || '';
    this.vehicleManufacturer = vehicle.vehicleManufacturer || '';
    this.logo = vehicle.logo || '';
    this.previousCategory = vehicle.previousCategory || '';
    this.nextCategory = vehicle.nextCategory || '';
  }
}

class PackageModel {
  packageID: number;
  package: string;
  packageTypeID: number;
  packageType: string;
  serviceTypeID: number;
  serviceType: string;
  constructor(packageM) {
    this.packageID = packageM.packageID || '';
    this.package = packageM.package || '';
    this.packageTypeID = packageM.packageTypeID || '';
    this.packageType = packageM.packageType || '';
    this.serviceTypeID = packageM.serviceTypeID || '';
    this.serviceType = packageM.serviceType || '';
  }
}

class PickupModel {
  pickupTime: string;
  pickupDate: Date;
  pickupAddress: string;
  pickupAddressDetails: string;
  constructor(pickup) {
    this.pickupTime = pickup.pickupDate || '';
    this.pickupDate = pickup.pickupDate || '';
    this.pickupAddress = pickup.pickupAddress || '';
    this.pickupAddressDetails = pickup.pickupAddressDetails || '';
  }
}

class DropOffModel {
  dropOffTime: string;
  dropOffDate: Date;
  dropOffAddress: string;
  dropOffAddressDetails: string;
  constructor(drop) {
    this.dropOffTime = drop.dropOffTime || '';
    this.dropOffDate = drop.dropOffDate || '';
    this.dropOffAddress = drop.dropOffAddress || '';
    this.dropOffAddressDetails = drop.dropOffAddressDetails || '';
  }
}

class ReservationSpecialInstructionModel {
  reservationSpecialInstructionID: number;
  specialInstruction: string;
  specialInstructionBy: string;
  specialInstructionAttachment: string;
  activationStatus: string;
  constructor(si) {
    this.reservationSpecialInstructionID =
      si.reservationSpecialInstructionID || '';
    this.specialInstruction = si.specialInstruction || '';
    this.specialInstructionBy = si.specialInstructionBy || '';
    this.specialInstructionAttachment = si.specialInstructionAttachment || '';
    this.activationStatus = si.activationStatus || '';
  }
}

export class InternalNote {
  reservationInternalNoteID: number;
  reservationID: number;
  reservationInternalNote:string;
  reservationInternalNoteAttachment:string;
  reservationInternalNoteByEmployeeID:number;
  reservationInternalNoteByEmployee:string;
  firstName:string;
  lastName:string;
  activationStatus: boolean;
  userID: number;
   
  constructor(internalNote) {
    {
      this.reservationInternalNoteID = internalNote.reservationInternalNoteID || -1;
      this.reservationID = internalNote.reservationID || '';
      this.reservationInternalNote = internalNote.reservationInternalNote || '';
      this.reservationInternalNoteAttachment = internalNote.reservationInternalNoteAttachment || '';
      this.reservationInternalNoteByEmployeeID = internalNote.reservationInternalNoteByEmployeeID || '';      
      this.activationStatus = internalNote.activationStatus || ''; 
    }
  }  
}

class FeedBackDetailsModel {
  reservationID: number;
  feedBackRemark: string;
  feedbackPointsOutOfFive: string;
  constructor(FeedBackDetails) {
    this.reservationID = FeedBackDetails.reservationID || '';
    this.feedBackRemark = FeedBackDetails.feedBackRemark || ''; // Map correctly here
    this.feedbackPointsOutOfFive = FeedBackDetails.feedbackPointsOutOfFive || '';
  }
  
}

export class PassengerModel {
  reservationPassengerID: number;
  customerPersonID: number;
  customerPersonName: string;
  primaryMobile: string;
  primaryEmail: string;
  reservationPickupStopID: number;
  isPrimaryPassenger: string;
  pickupDate: Date;
  pickupTime: Date;
  pickupStopType: string;
  pickupStopAddress: string;
  pickupStopAddressDetails: string;
  reservationDropOffStopID: number;
  dropOffCityID: number;
  dropOffDate: Date;
  dropOffTime: Date;
  dropOffStopType: string;
  dropOffStopAddress: string;
  dropOffStopAddressDetails: string;
  customerDepartment: string;
  customerDesignation: string;
  constructor(passenger) {
    this.reservationPassengerID = passenger.reservationPassengerID || '';
    this.customerPersonID = passenger.customerPersonID || '';
    this.customerPersonName = passenger.customerPersonName || '';
    this.primaryMobile = passenger.primaryMobile || '';
    this.primaryEmail = passenger.primaryEmail || '';
    this.reservationPickupStopID = passenger.reservationPickupStopID || '';
    this.isPrimaryPassenger = passenger.reservationPickupStopID || '0';
    this.pickupDate = passenger.pickupDate || '';
    this.pickupTime = passenger.pickupTime || '';
    this.pickupStopType = passenger.pickupStopType || '';
    this.pickupStopAddress = passenger.pickupStopAddress || '';
    this.pickupStopAddressDetails = passenger.pickupStopAddressDetails || '';
    this.reservationDropOffStopID = passenger.reservationDropOffStopID || '';
    this.dropOffCityID = passenger.dropOffCityID || '';
    this.dropOffDate = passenger.dropOffDate || '';
    this.dropOffTime = passenger.dropOffTime || '';
    this.dropOffStopType = passenger.dropOffStopType || '';
    this.dropOffStopAddress = passenger.dropOffStopAddress || '';
    this.dropOffStopAddressDetails = passenger.dropOffStopAddressDetails || '';
    this.customerDepartment = passenger.customerDepartment || '';
    this.customerDesignation = passenger.customerDesignation || '';
  }
}

export class StopsModel {
  reservationStopID: number;
  reservationStopAddress: string;
  encodedStopAddressGeoLocation: string;
  reservationStopCityID: number;
  reservationStopAddressDetails: string;
  reservationStopDate: Date;
  reservationStopTime: Date;
  reservationStopType: string;
  cityGroup: string;
  cityTierName: string;
  city: string;
  state: string;
  country: string;
  constructor(stops) {
    this.reservationStopID = stops.reservationStopID || '';
    this.reservationStopAddress = stops.reservationStopAddress || '';
    this.encodedStopAddressGeoLocation =
      stops.encodedStopAddressGeoLocation || '';
    this.reservationStopCityID = stops.reservationStopCityID || '';
    this.reservationStopAddressDetails = stops.reservationStopAddressDetails || '';
    this.reservationStopDate = stops.reservationStopDate || '';
    this.reservationStopTime = stops.reservationStopTime || '';
    this.reservationStopType = stops.reservationStopType || stops.stopType || '';
    this.cityGroup =
      stops.cityGroup ||
      stops.CityGroup ||
      stops.cityGroupName ||
      '';
    this.cityTierName = stops.cityTierName || stops.CityTierName || '';
    this.city =
      stops.city ||
      stops.City ||
      stops.reservationStopCity ||
      '';
    this.state =
      stops.state ||
      stops.State ||
      stops.reservationStopState ||
      '';
    this.country =
      stops.country ||
      stops.Country ||
      stops.reservationStopCountry ||
      '';
  }
}

export class Filters {
  tripStatus: string;
  reservationStatus: string;
  allotmentStatus: string;
  billingStatus:string;
  guestType:string;
  reservationType: string;
  delays:string;
  security:string;
  disputes:string;
  reservationID: number;
  vendorTripNumber:string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  customerGroup: string;
  customer: string;
  booker: string;
  passenger: string;
  vehicleCategory:string;
  vehicleName: string;
  city:string;
  packageType:string;
  package:string;
  supplier:string;
  vehicleInventory:string;
  driver:string;
  qualityStatus:string;
  userID:number;
  showAllLocation:boolean;
  primarymobile:string;
  locationName:string;
  transferLocationName:string;
  driverOfficialIdentityNumber:string;
  gender:string;
  ownership:string;
  contactMobile:string;
  messageType:string;
  customerGroupID:number;
  customerID:number;
  packageTypeID:number;
  packageID:number;
  reservationGroupID:string;
  tripType:string;
  reservationSourceDetail:string;
  verifyDuty:string;
  goodForBilling:string;
  billed:string;
  passed:string;
  driverAcceptanceStatus:string;
  modeOfPayment:string;
  carType:string;
  emailtosupplier:string;
  tncStatus:string;
  constructor(filter) { 
    this.tripStatus = filter.tripStatus || '';
    this.userID = filter.userID || '';
    this.showAllLocation = filter.showAllLocation || '';
    this.qualityStatus = filter.qualityStatus || '';
    this.reservationStatus = filter.reservationStatus || '';
    this.allotmentStatus = filter.allotmentStatus || '';
    this.billingStatus = filter.billingStatus || '';
    this.reservationType = filter.reservationType || '';
    this.guestType = filter.guestType || '';
    this.delays = filter.delays || '';
    this.security = filter.security || '';
    this.vendorTripNumber = filter.vendorTripNumber || '';
    this.reservationID = filter.reservationID || 0;
    this.fromDate = filter.fromDate || '';
    this.toDate = filter.toDate || '';
    this.fromTime = filter.fromTime || '';
    this.toTime = filter.toTime || '';
    this.customerGroup = filter.customerGroup || '';
    this.customer = filter.customer || '';
    this.booker = filter.booker || '';
    this.passenger = filter.passenger || '';
    this.vehicleCategory=filter.vehicleCategory || '';
    this.vehicleName = filter.vehicleName || '';
    this.city = filter.city || '';
    this.packageType = filter.packageType || '';
    this.package = filter.package || '';
    this.supplier = filter.supplier || '';
    this.vehicleInventory = filter.vehicleInventory || '';
    this.driver = filter.driver || '';
    this.primarymobile = filter.primarymobile || '';
    this.locationName = filter.locationName || '';
    this.transferLocationName = filter.transferLocationName || '';
    this.driverOfficialIdentityNumber=filter.driverOfficialIdentityNumber || '';
    this.gender=filter.gender || '';
    this.ownership=filter.ownership || '';
    this.contactMobile=filter.contactMobile || '';
    this.messageType=filter.messageType || '';
    this.customerID=filter.customerID || '';
    this.customerGroupID=filter.customerGroupID || '';
    this.packageTypeID=filter.packageTypeID || '';
    this.packageID=filter.packageID || '';
    this.reservationGroupID=filter.reservationGroupID || null;
    this.tripType=filter.tripType || '';
    this.reservationSourceDetail = filter.reservationSourceDetail || '';
  }
}

