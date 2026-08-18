// @ts-nocheck
export class FeedbackEmailMIS {
  isFeedbackEmailSent: boolean;
  reservationID: number;
  reservationGroupID: number;
  dutySlipID: number;
  pickupDate: Date;
  vehicle: string;
  registrationNumber: string;
  driverName: string;
  pickupCity: string;
  passengerName: string;
  passengerEmail: string;
  passengerID: number;
  passengerMobile: string;
  passengerFeedbackEmailAllowed: boolean;
  customerName: string;
  customerType: string;
  customerFeedbackEmailAllowed: boolean;
  kam: string;
  kamMobile: string;
  customerPersonID: number;
  customerID: number;
  employeeID: number;

  constructor(feedbackEmailMIS) {
    this.isFeedbackEmailSent = feedbackEmailMIS.isFeedbackEmailSent;
    this.reservationID = feedbackEmailMIS.reservationID || '';
    this.reservationGroupID = feedbackEmailMIS.reservationGroupID || '';
    this.dutySlipID = feedbackEmailMIS.dutySlipID || '';
    this.pickupDate = feedbackEmailMIS.pickupDate || '';
    this.vehicle = feedbackEmailMIS.vehicle || '';
    this.registrationNumber = feedbackEmailMIS.registrationNumber || '';
    this.driverName = feedbackEmailMIS.driverName || '';
    this.pickupCity = feedbackEmailMIS.pickupCity || '';
    this.passengerName = feedbackEmailMIS.passengerName || '';
    this.passengerEmail = feedbackEmailMIS.passengerEmail || '';
    this.passengerID = feedbackEmailMIS.passengerID || '';
    this.passengerMobile = feedbackEmailMIS.passengerMobile || '';
    this.passengerFeedbackEmailAllowed = feedbackEmailMIS.passengerFeedbackEmailAllowed;
    this.customerName = feedbackEmailMIS.customerName || '';
    this.customerType = feedbackEmailMIS.customerType || '';
    this.customerFeedbackEmailAllowed = feedbackEmailMIS.customerFeedbackEmailAllowed;
    this.kam = feedbackEmailMIS.kam || '';
    this.kamMobile = feedbackEmailMIS.kamMobile || '';
    this.customerPersonID = feedbackEmailMIS.customerPersonID || '';
    this.customerID = feedbackEmailMIS.customerID || '';
    this.employeeID = feedbackEmailMIS.employeeID || '';
  }
}
