// @ts-nocheck
export class ClosingReservationForPickupDataModel {
  reservationID: number;
  allotmentID: number;
  customerTypeID: number;
  customerID: number;
  customerGroupID: number;
  primaryBookerID: number;

  primaryPassengerID: number;
  pickupCityID: number;
  vehicleCategoryID: number;
  vehicleID: number;
  packageTypeID: number;
  packageID: number;

  pickupDate: Date;
  pickupTime: Date;

  pickupSpotTypeID: number;
  pickupSpotID: number;
  pickupAddress: string;
  pickupAddressLatLong: string;
  pickupAddressDetails: string;
  pickupStopOrderPriority: number;

  locationOutDate: Date;
  locationOutTime: Date;

  serviceLocationID: number;
  transferedLocationID: number;

  dropOffDate: Date;
  dropOffTime: Date;

  etrDate: Date;
  etrTime: Date;

  dropOffCityID: number;
  dropOffSpotTypeID: number;
  dropOffSpotID: number;
  dropOffAddress: string;
  dropOffAddressLatLong: string;
  dropOffAddressDetails: string;
  dropOffStopOrderPriority: number;

  ticketNumber: string;
  attachment: string;
  emailLink: string;

  reservationSourceID: number;
  reservationSourceDetail: string;
  referenceNumber: string;
  reservationStatus: string;
  customerSpecificFields: string;

  modeOfPaymentID: number;
  ecoCompanyID: number;
  reservationGroupID: number;

  cancellationReason: string;
  cancellationDateTime: Date;

  reservationCreatedByID: number;
  reservationCreatedOn: Date;

  isTimeNotConfirmed: boolean;

  constructor(closingReservationForPickupDataModel) {
    this.reservationID = closingReservationForPickupDataModel.reservationID || '';
    this.allotmentID = closingReservationForPickupDataModel.allotmentID || '';
    this.customerTypeID = closingReservationForPickupDataModel.customerTypeID || '';
    this.customerID = closingReservationForPickupDataModel.customerID || '';
    this.customerGroupID = closingReservationForPickupDataModel.customerGroupID || '';
    this.primaryBookerID = closingReservationForPickupDataModel.primaryBookerID || '';

    this.primaryPassengerID = closingReservationForPickupDataModel.primaryPassengerID || '';
    this.pickupCityID = closingReservationForPickupDataModel.pickupCityID || '';
    this.vehicleCategoryID = closingReservationForPickupDataModel.vehicleCategoryID || '';
    this.vehicleID = closingReservationForPickupDataModel.vehicleID || '';
    this.packageTypeID = closingReservationForPickupDataModel.packageTypeID || '';
    this.packageID = closingReservationForPickupDataModel.packageID || '';

    this.pickupDate = closingReservationForPickupDataModel.pickupDate  || '';
    this.pickupTime = closingReservationForPickupDataModel.pickupTime  || '';

    this.pickupSpotTypeID = closingReservationForPickupDataModel.pickupSpotTypeID || '';
    this.pickupSpotID = closingReservationForPickupDataModel.pickupSpotID || '';
    this.pickupAddress = closingReservationForPickupDataModel.pickupAddress || '';
    this.pickupAddressLatLong = closingReservationForPickupDataModel.pickupAddressLatLong || '';
    this.pickupAddressDetails = closingReservationForPickupDataModel.pickupAddressDetails || '';
    this.pickupStopOrderPriority = closingReservationForPickupDataModel.pickupStopOrderPriority || '';

    this.locationOutDate = closingReservationForPickupDataModel.locationOutDate  || '';
    this.locationOutTime = closingReservationForPickupDataModel.locationOutTime  || '';

    this.serviceLocationID = closingReservationForPickupDataModel.serviceLocationID || '';
    this.transferedLocationID = closingReservationForPickupDataModel.transferedLocationID || '';

    this.dropOffDate = closingReservationForPickupDataModel.dropOffDate  || '';
    this.dropOffTime = closingReservationForPickupDataModel.dropOffTime  || '';

    this.etrDate = closingReservationForPickupDataModel.etrDate  || '';
    this.etrTime = closingReservationForPickupDataModel.etrTime  || '';

    this.dropOffCityID = closingReservationForPickupDataModel.dropOffCityID || '';
    this.dropOffSpotTypeID = closingReservationForPickupDataModel.dropOffSpotTypeID || '';
    this.dropOffSpotID = closingReservationForPickupDataModel.dropOffSpotID || '';
    this.dropOffAddress = closingReservationForPickupDataModel.dropOffAddress || '';
    this.dropOffAddressLatLong = closingReservationForPickupDataModel.dropOffAddressLatLong || '';
    this.dropOffAddressDetails = closingReservationForPickupDataModel.dropOffAddressDetails || '';
    this.dropOffStopOrderPriority = closingReservationForPickupDataModel.dropOffStopOrderPriority || '';

    this.ticketNumber = closingReservationForPickupDataModel.ticketNumber || '';
    this.attachment = closingReservationForPickupDataModel.attachment || '';
    this.emailLink = closingReservationForPickupDataModel.emailLink || '';

    this.reservationSourceID = closingReservationForPickupDataModel.reservationSourceID || '';
    this.reservationSourceDetail = closingReservationForPickupDataModel.reservationSourceDetail || '';
    this.referenceNumber = closingReservationForPickupDataModel.referenceNumber || '';
    this.reservationStatus = closingReservationForPickupDataModel.reservationStatus || '';
    this.customerSpecificFields = closingReservationForPickupDataModel.customerSpecificFields || '';

    this.modeOfPaymentID = closingReservationForPickupDataModel.modeOfPaymentID || '';
    this.ecoCompanyID = closingReservationForPickupDataModel.ecoCompanyID || '';
    this.reservationGroupID = closingReservationForPickupDataModel.reservationGroupID || '';

    this.cancellationReason = closingReservationForPickupDataModel.cancellationReason || '';
    this.cancellationDateTime = closingReservationForPickupDataModel.cancellationDateTime  || '';

    this.reservationCreatedByID = closingReservationForPickupDataModel.reservationCreatedByID || '';
    this.reservationCreatedOn = closingReservationForPickupDataModel.reservationCreatedOn  || '';

    this.isTimeNotConfirmed = closingReservationForPickupDataModel.isTimeNotConfirmed || '';
  }
}

