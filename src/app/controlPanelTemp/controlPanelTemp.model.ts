// @ts-nocheck
export class ControlPanelData {
  totalRecords: number;
  reservationDetails: ControlPanelTemp;
  constructor(controlPanelData) {
    this.totalRecords = controlPanelData.totalRecords || '';
    this.reservationDetails = controlPanelData.reservationDetails || '';
  }
}

export class ControlPanelTemp {
  reservationID: number;
  dutySlipID: number;
  dateOfBooking: Date;
  garageOutDateTime: Date;
  garageInDateTime: Date;
  reachedDateTime: Date;
  tripStartDateTime: Date;
  tripEndDateTime: Date;
  vehicleID: number;
  vehicle: string;
  vehicleCategoryID: number;
  vehicleCategory: string;
  manufacturerID: number;
  vehicleManufacturer: string;
  logo: string;
  packageID: number;
  package: string;
  description: string;
  packageTypeID: number;
  packageType: string;
  isVIP: string;
  iSVVIP: string;
  currentStatus: string;
  activationStatus: string;
  updatedBy: number;
  updateDateTime: Date;
  bookingGroupID: number;
  alternateReservationID: string;
  vehicleCategoryLevel: number;
  image: string;
  primaryPassenger: string;
  vendor: string;
  city: string;
  driverName: string;
  vendorAcceptanceStatus: string;
  vehicleRegistrationNumber: string;
  vendorStatus: string;
  vehicleStatus: string;
  vehicleSupllied: string;
  isFemale: string;
  vendorBookingNumber: string;
  constructor(controlPanel) {
    {
      this.reservationID = controlPanel.vehicleID || '';
      this.dateOfBooking = controlPanel.vehicleID || '';
      this.vehicleID = controlPanel.vehicleID || '';
      this.vehicle = controlPanel.vehicleID || '';
      this.vehicleCategoryID = controlPanel.vehicleID || '';
      this.vehicleCategory = controlPanel.vehicleID || '';
      this.manufacturerID = controlPanel.vehicleID || '';
      this.vehicleManufacturer = controlPanel.vehicleID || '';
      this.logo = controlPanel.vehicleID || '';
      this.packageID = controlPanel.vehicleID || '';
      this.package = controlPanel.vehicleID || '';
      this.description = controlPanel.vehicleID || '';
      this.packageTypeID = controlPanel.vehicleID || '';
      this.packageType = controlPanel.vehicleID || '';
      this.isVIP = controlPanel.vehicleID || '';
      this.iSVVIP = controlPanel.vehicleID || '';
      this.currentStatus = controlPanel.vehicleID || '';
      this.activationStatus = controlPanel.vehicleID || '';
      this.updatedBy = controlPanel.vehicleID || '';
      this.updateDateTime = controlPanel.vehicleID || '';
      this.bookingGroupID = controlPanel.vehicleID || '';
      this.alternateReservationID = controlPanel.vehicleID || '';
      this.vehicleCategoryLevel = controlPanel.vehicleID || '';
      this.image = controlPanel.vehicleID || '';
      this.primaryPassenger = controlPanel.primaryPassenger || '';
      this.vendor = controlPanel.vendor || '';
      this.city = controlPanel.city || '';
      this.driverName = controlPanel.driverName || '';
      this.vehicleRegistrationNumber =
        controlPanel.vehicleRegistrationNumber || '';
      this.vendorAcceptanceStatus = controlPanel.vendorAcceptanceStatus || '';
      this.vendorStatus = controlPanel.vendorStatus || '';
      this.vehicleStatus = controlPanel.vehicleStatus || '';
      this.vehicleSupllied = controlPanel.vehicleSupllied || '';
      this.isFemale = controlPanel.isFemale || '';
      this.vendorBookingNumber = controlPanel.vendorBookingNumber || '';
    }
  }
}

export class TripDetails {
  bookingNumber: number = 123;
  // booker: string;
  // vendorStatus:string;
  // vendor:string;
  // vehicleStatus:string;
  // vendorBookingNumber:number;

  //  constructor(tripDetails) {
  //    {
  //       this.bookingNumber = tripDetails.bookingNumber || '';
  //       this.booker = tripDetails.booker || '';
  //       this.vendorStatus = tripDetails.vendorStatus || '';
  //       this.vendor = tripDetails.vendor || '';
  //       this.vehicleStatus =tripDetails.vehicleStatus || '';
  //       this.vendorBookingNumber = tripDetails.vendorBookingNumber || '';
  //    }
  //  }
}

// export class CarDetails {
//   vehicleCategory: string;
//   vehicleBooked:string;
//   packageBooked:string;
//   vehicleSupplied:string;
//   vehicleNumber:string;
//   driver:string;

//   constructor(carDetails) {
//     {
//        this.vehicleCategory = carDetails.vehicleCategory || '';
//        this.vehicleBooked = carDetails.vehicleBooked || '';
//        this.packageBooked =carDetails.packageBooked || '';
//        this.vehicleSupplied = carDetails.vehicleSupplied || '';
//        this.vehicleNumber = carDetails.vehicleNumber  || '';
//        this.driver = carDetails.driver || '';
//     }
//   }
// }

// export class Route {
//   pickUp: string;
//   listOfStops: string;
//   map: string;
//   drop: string;

//   constructor(route) {
//     {
//       this.pickUp = route.pickUp || '';
//       this.listOfStops = route.listOfStops || '';
//       this.map = route.map || '';
//       this.drop = route.drop|| '';
//     }
//   }
// }

// export class TripTracker {
//   tripStatus: string;
//   tripTiming: string;
//   showOnMap: string;
//   connectDriver: string;
//   tripClosureStatus: string;
//   tripTrackerDetails: number;

//   constructor(tripTracker) {
//     {
//       this.tripStatus = tripTracker.tripStatus || '';
//       this.tripTiming = tripTracker.tripTiming || '';
//       this.showOnMap = tripTracker.showOnMap || '';
//       this.connectDriver = tripTracker.connectDriver || '';
//       this.tripClosureStatus = tripTracker.tripClosureStatus || '';
//       this.tripTrackerDetails = tripTracker.tripTrackerDetails || '';
//     }
//   }
// }

// export class BillingDetails {
//   billingStatus: string;
//   amount: number;
//   documents: string;

//   constructor(billingDetails) {
//     {
//       this.billingStatus = billingDetails.billingStatus || '';
//       this.amount = billingDetails.amount || '';
//       this.documents = billingDetails.documents || '';
//     }
//   }
// }

// export class Passengers {
//   passengerDetails: string;

//   constructor(passengers) {
//     {
//       this.passengerDetails = passengers.passengerDetails || '';
//     }
//   }
// }

// export class PaymentStatus {
//   invoiceClearance: string;
//   paymentMode: string;
//   amountPaid: number;
//   disputes:string;

//  constructor(paymentStatus) {
//    {
//       this.invoiceClearance = paymentStatus.invoiceClearance || '';
//       this.paymentMode =paymentStatus.paymentMode || '';
//       this.amountPaid = paymentStatus.amountPaid || '';
//       this.disputes = paymentStatus.disputes || '';
//    }
//  }

// }

