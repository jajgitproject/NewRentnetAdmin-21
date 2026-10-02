export interface EmailBookingRequestListItem {
  emailBookingRequestId: number;
  emailBookingRequestGroupId: number;
  customerTravelRequestNumber?: string;
  customerName?: string;
  requestDate?: string;
  requestTime?: string;
  pickupDate?: string;
  pickupTime?: string;
  requestStatus?: string;
  reservationEmailAiId?: number;
  reservationId?: number;
  integrationRequestId?: number;
  confidence?: number;
  bookerName?: string;
  bookerMobile?: string;
  subject?: string;
  emailCategory?: string;
  claimedByUserID?: number;
  isMine?: boolean;
  isInProgress?: boolean;
}

export interface EmailBookingQueueCounts {
  unconfirmed: number;
  available: number;
  waitingForReply?: number;
}

export interface EmailBookingSettings {
  requestDetailsEmailEnabled: boolean;
  mailbox?: string;
}

export interface EmailBookingCorrespondenceItem {
  emailBookingCorrespondenceId?: number;
  direction?: string;
  fromAddress?: string;
  toAddress?: string;
  subject?: string;
  sentUtc?: string;
  textBody?: string;
  sentByUserID?: number;
}

export interface EmailBookingClerkEfficiencyRow {
  userID: number;
  clerkName?: string;
  reservations: number;
  updates: number;
  cancellations: number;
  notRelated: number;
  total: number;
}

export interface EmailBookingExtracted {
  customerName?: string;
  customerTravelRequestNumber?: string;
  bookerName?: string;
  bookerMobile?: string;
  bookerEmail?: string;
  passengerName?: string;
  passengerMobile?: string;
  passengerEmail?: string;
  packageType?: string;
  package?: string;
  vehicleCategory?: string;
  vehicle?: string;
  pickupCity?: string;
  pickupAddress?: string;
  pickupDate?: string;
  pickupTime?: string;
  dropoffCity?: string;
  dropoffAddress?: string;
  dropoffDate?: string;
  dropoffTime?: string;
  ticketNumber?: string;
  flightNumber?: string;
  specialRequest?: string;
  paymentMode?: string;
  confidence?: number;
}

export interface EmailBookingCompareRow {
  field: string;
  aiValue?: string;
  historicalValue?: string;
  confirmedValue?: string;
}

export interface EmailBookingConfirmPayload {
  emailBookingRequestId: number;
  customerID?: number;
  customerName?: string;
  customerTravelRequestNumber?: string;
  bookerName?: string;
  bookerMobile?: string;
  bookerEmail?: string;
  passengerName?: string;
  passengerMobile?: string;
  passengerEmail?: string;
  packageTypeID?: number;
  packageType?: string;
  packageID?: number;
  package?: string;
  vehicleID?: number;
  vehicleCategoryID?: number;
  vehicleCategory?: string;
  vehicle?: string;
  pickupCityID?: number;
  pickupCity?: string;
  pickupAddress?: string;
  pickupAddressDetails?: string;
  pickupDate?: string;
  pickupTime?: string;
  dropoffCity?: string;
  dropoffAddress?: string;
  dropOffAddressDetails?: string;
  dropoffDate?: string;
  dropoffTime?: string;
  serviceLocationID?: number;
  serviceLocation?: string;
  requestType?: string;
  ticketNumber?: string;
  specialRequest?: string;
  customerGroupID?: number;
  customerTypeID?: number;
  primaryBookerID?: number;
  primaryPassengerID?: number;
  salesExecutiveID?: number;
  kamID?: number;
  reservationExecutiveID?: number;
  userID?: number;
  reservationSourceID?: number;
  reservationSource?: string;
  pickupDateString?: string;
  pickupTimeString?: string;
  dropOffDateString?: string;
  dropOffTimeString?: string;
  pickupAddressLatitude?: string;
  pickupAddressLongitude?: string;
  dropOffAddressLatitude?: string;
  dropOffAddressLongitude?: string;
  ecoCompanyID?: number;
  extraPassengers?: { name?: string; mobile?: string; email?: string }[];
  emailCategory?: string;
  paymentMode?: string;
  modeOfPaymentID?: number;
  moreThanOneReservation?: boolean;
  expectedReservationCount?: number;
  sameGuest?: boolean;
}

export interface EmailBookingReservationCandidate {
  reservationID: number;
  customerName?: string;
  passengerName?: string;
  bookerName?: string;
  pickupDate?: string;
  pickupTime?: string;
  pickupCity?: string;
  reservationStatus?: string;
  matchScore?: number;
  isCancelled?: boolean;
}

export interface EmailBookingFindReservationsPayload {
  emailBookingRequestId?: number;
  customerID?: number;
  customerName?: string;
  pickupDate?: string;
  passengerName?: string;
  bookerName?: string;
  bookerMobile?: string;
  bookerEmail?: string;
  ticketNumber?: string;
  pickupCity?: string;
  reservationID?: number;
}

export interface EmailBookingAttachmentItem {
  emailBookingAttachmentId?: number;
  fileName?: string;
  contentType?: string;
  contentId?: string;
  isInline?: boolean;
  byteLength?: number;
  contentBase64?: string;
}

export interface EmailBookingRequestDetail {
  request: EmailBookingRequestListItem;
  aiCapture: EmailBookingExtracted;
  aiCapturedJson?: string;
  confirmedJson?: string;
  subject?: string;
  fromAddress?: string;
  textBody?: string;
  htmlBody?: string;
  receivedUtc?: string;
  emailCategory?: string;
  suggestedEmailCategory?: string;
  suggestedEmailCategoryReason?: string;
  compareRows: EmailBookingCompareRow[];
  matchedHistoricalReservationId?: number;
  reservationEmailAiId?: number;
  reservationId?: number;
  moreThanOneReservation?: boolean;
  expectedReservationCount?: number;
  createdReservationCount?: number;
  sameGuest?: boolean;
  suggestedMoreThanOneReservation?: boolean;
  suggestedExpectedReservationCount?: number;
  suggestedSameGuest?: boolean;
  suggestedMultiReason?: string;
  requestDetailsEmailEnabled?: boolean;
  correspondence?: EmailBookingCorrespondenceItem[];
  attachments?: EmailBookingAttachmentItem[];
}
