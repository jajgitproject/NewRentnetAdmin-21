// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { GoogleAddress, Reservation, SameReservationModel } from './reservation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe, formatDate } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerConfigurationInvoicing } from '../customerConfigurationInvoicing/customerConfigurationInvoicing.model';
@Injectable()
export class ReservationService 
{
  private API_URL:string = '';
  private RG_API_URL:string = '';
  private Duplicate_API_URL:string = '';
  private GA_API_URL:string = '';
  private SA_API_URL:string = '';
  private API_URL_CustomerGroupReservationCapping:string = '';
  private API_URL_Customer:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService, private datePipe: DatePipe) 
  {
    this.API_URL=generalService.BaseURL+ "reservation";
    this.RG_API_URL=generalService.BaseURL+ "reservationGroup";
    this.Duplicate_API_URL=generalService.BaseURL+ "reservationGroupDuplicate";
    this.GA_API_URL=generalService.BaseURL+ "googleAddress";
    this.SA_API_URL=generalService.BaseURL+ "savedAddress";
    this.API_URL_CustomerGroupReservationCapping=generalService.BaseURL+ "customerGroupReservationCapping";
    this.API_URL_Customer=generalService.BaseURL+ "customer";
  }
  /** CRUD METHODS */
  getIntervalMin(CustomerID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Customer + "/" + 'GetIntervalMinByID' + '/' +CustomerID);
  }

  getTableData(PassengerID:number):  Observable<any> 
  {
    return this.httpClient.get(this.SA_API_URL +"/"+PassengerID);
  }

  getDataForReservation(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.RG_API_URL +"/ForReservationPage/"+ReservationID);
  }

  GetServiceLocation(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/getServiceAndTransferedLocation/"+ReservationID);
  }

  getTimeForDropoffTime(packageID:number,pickupTime:string,pickupDate:string,contractID:number,vehicleID:number,cityID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + 'getDropOffTime' + "/"  +  packageID + "/" + pickupTime + "/" + pickupDate + "/" + contractID + "/" + vehicleID + "/" + cityID);
  }

  getBookingDetails(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/ForBookingDetails/"+ReservationID);
  }

  getReservationStatusLog(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.Duplicate_API_URL+'/'+ReservationID);
  }

  add(advanceTable: any) 
  {
    
    advanceTable.reservationID=-1;
    advanceTable.reservationStatusChangedByID=this.generalService.getUserID();
    if(advanceTable.pickupSpotTypeID==="")
    {
      advanceTable.pickupSpotTypeID=0;
    }
    if(advanceTable.customerReservationFieldID=== "")
    {
      advanceTable.customerReservationFieldID=null;
    }
    if(advanceTable.fieldName=== "")
    {
      advanceTable.fieldName=null;
    }
    if(advanceTable.projectCode=== "")
    {
      advanceTable.projectCode=null;
    }
    if(advanceTable.pickupSpotID==="")
    {
      advanceTable.pickupSpotID=0;
    }
    if(advanceTable.dropOffCityID==="")
    {
      advanceTable.dropOffCityID=0;
    }
    if(advanceTable.dropOffSpotID==="")
    {
      advanceTable.dropOffSpotID=0;
    }
    if(advanceTable.dropOffSpotTypeID==="")
    {
      advanceTable.dropOffSpotTypeID=0;
    }
    if(advanceTable.pickupDate==="")
    {
      advanceTable.pickupDate=null;
    }
    else
    {
      advanceTable.pickupDateString=this.generalService.getTimeApplicable(advanceTable.pickupDate);
    }
    if(advanceTable.dropOffDate==="")
    {
      advanceTable.dropOffDate=null;
    }
    else
    {
      advanceTable.dropOffDateString=this.generalService.getTimeApplicable(advanceTable.dropOffDate);
    }
    if(advanceTable.locationOutDate==="")
      {
        advanceTable.locationOutDate=null;
      }
      else
      {
        advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
      }
    if(advanceTable.locationOutTime==="")
    {
      advanceTable.locationOutTime=null;
    }
    else
    {
      advanceTable.locationOutTimeString=this.generalService.getTimeApplicable(advanceTable.locationOutTime);
    }
    if(advanceTable.pickupTime==="")
    {
      advanceTable.pickupTime=null;
    }
    else
    {
      advanceTable.pickupTimeString=this.generalService.getTimeApplicable(advanceTable.pickupTime);
    }
    if(advanceTable.dropOffTime==="")
    {
      advanceTable.dropOffTime=null;
    }
    else
    {
      advanceTable.dropOffTimeString=this.generalService.getTimeApplicable(advanceTable.dropOffTime);
    }
    this.normalizeSecurityGuardPayload(advanceTable);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  addGoogleAddress(advanceTable: GoogleAddress) 
  {
    advanceTable.geoPointID=-1;
    return this.httpClient.post<any>(this.GA_API_URL , advanceTable);
  }

  private combinePassengerDateAndTime(datePart: unknown, timePart: unknown): Date | null {
    if (datePart == null || datePart === '') {
      return null;
    }
    const combined = new Date(datePart as string | number | Date);
    if (Number.isNaN(combined.getTime())) {
      return null;
    }
    if (timePart != null && timePart !== '') {
      const time = new Date(timePart as string | number | Date);
      if (!Number.isNaN(time.getTime())) {
        combined.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
      }
    } else {
      combined.setHours(0, 0, 0, 0);
    }
    return combined;
  }

  private applyDefaultGuardPickupScheduleToPayload(advanceTable: any): void {
    const passengerPickup = this.combinePassengerDateAndTime(advanceTable.pickupDate, advanceTable.pickupTime);
    if (!passengerPickup) {
      return;
    }
    const sgPickup = new Date(passengerPickup);
    if (advanceTable.pickupTime != null && advanceTable.pickupTime !== '') {
      sgPickup.setHours(sgPickup.getHours() - 2);
    }
    const dateOnly = new Date(sgPickup);
    dateOnly.setHours(0, 0, 0, 0);
    advanceTable.securityGuardPickupDate = dateOnly;
    advanceTable.securityGuardPickupTime = sgPickup;
    advanceTable.securityGuardPickupDateString = this.generalService.getTimeApplicable(dateOnly);
    advanceTable.securityGuardPickupTimeString = this.generalService.getTimeApplicable(sgPickup);
    const pickupPriority = Number(advanceTable.pickupPriorityOrder ?? 0);
    if (pickupPriority > 0) {
      advanceTable.securityGuardPickupStopOrderPriority = pickupPriority - 1;
    }
  }

  private applyDefaultGuardDropOffScheduleToPayload(advanceTable: any): void {
    const passengerDrop = this.combinePassengerDateAndTime(advanceTable.dropOffDate, advanceTable.dropOffTime);
    if (!passengerDrop) {
      return;
    }
    const sgDrop = new Date(passengerDrop);
    if (advanceTable.dropOffTime != null && advanceTable.dropOffTime !== '') {
      sgDrop.setHours(sgDrop.getHours() + 2);
    }
    const dateOnly = new Date(sgDrop);
    dateOnly.setHours(0, 0, 0, 0);
    advanceTable.securityGuardDropOffDate = dateOnly;
    advanceTable.securityGuardDropOffTime = sgDrop;
    advanceTable.securityGuardDropOffDateString = this.generalService.getTimeApplicable(dateOnly);
    advanceTable.securityGuardDropOffTimeString = this.generalService.getTimeApplicable(sgDrop);
    const dropPriority = Number(advanceTable.dropOffPriorityOrder ?? 0);
    if (dropPriority > 0) {
      advanceTable.securityGuardDropOffStopOrderPriority = dropPriority + 1;
    }
  }

  private clearSecurityGuardPayloadFields(advanceTable: any): void {
    if (!advanceTable) {
      return;
    }
    advanceTable.doesThisReservationContainSecurityGuard = false;
    advanceTable.securityGuardDetails = null;
    advanceTable.securityGuardID = null;
    advanceTable.securityGuard = null;
    advanceTable.securityGuardEmail = null;
    advanceTable.securityGuardMobile = null;
    advanceTable.securityGuardInfoNotReceived = false;
    advanceTable.securityGuardPickupCityID = null;
    advanceTable.securityGuardPickupCity = null;
    advanceTable.securityGuardPickupDate = null;
    advanceTable.securityGuardPickupTime = null;
    advanceTable.securityGuardPickupDateString = null;
    advanceTable.securityGuardPickupTimeString = null;
    advanceTable.securityGuardPickupAddress = null;
    advanceTable.securityGuardPickupAddressDetails = null;
    advanceTable.securityGuardPickupAddressLatLong = null;
    advanceTable.securityGuardPickupStopOrderPriority = null;
    advanceTable.securityGuardPickupInfoNotReceived = false;
    advanceTable.securityGuardPickupIsTimeNotConfirmed = false;
    advanceTable.securityGuardDropOffCityID = null;
    advanceTable.securityGuardDropOffCity = null;
    advanceTable.securityGuardDropOffDate = null;
    advanceTable.securityGuardDropOffTime = null;
    advanceTable.securityGuardDropOffDateString = null;
    advanceTable.securityGuardDropOffTimeString = null;
    advanceTable.securityGuardDropOffAddress = null;
    advanceTable.securityGuardDropOffAddressDetails = null;
    advanceTable.securityGuardDropOffAddressLatLong = null;
    advanceTable.securityGuardDropOffStopOrderPriority = null;
    advanceTable.securityGuardDropOffInfoNotReceived = false;
    advanceTable.securityGuardDropOffIsTimeNotConfirmed = false;
  }

  private normalizeSecurityGuardPayload(advanceTable: any): void {
    if (!advanceTable) {
      return;
    }

    const toBool = (v: unknown): boolean => v === true || v === 'true' || v === 1 || v === '1';
    advanceTable.doesThisReservationContainSecurityGuard = toBool(advanceTable.doesThisReservationContainSecurityGuard);

    const toPositiveInt = (v: unknown): number | null => {
      if (v === '' || v === null || v === undefined) {
        return null;
      }
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : null;
    };

    const toNonNegativeInt = (v: unknown): number | null => {
      if (v === '' || v === null || v === undefined) {
        return null;
      }
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 ? n : null;
    };

    advanceTable.securityGuardID = toPositiveInt(advanceTable.securityGuardID);
    advanceTable.securityGuardPickupCityID = toPositiveInt(advanceTable.securityGuardPickupCityID);
    advanceTable.securityGuardDropOffCityID = toPositiveInt(advanceTable.securityGuardDropOffCityID);
    advanceTable.securityGuardPickupStopOrderPriority = toNonNegativeInt(advanceTable.securityGuardPickupStopOrderPriority);
    advanceTable.securityGuardDropOffStopOrderPriority = toNonNegativeInt(advanceTable.securityGuardDropOffStopOrderPriority);

    const normalizeDateField = (dateKey: string, stringKey: string): void => {
      if (advanceTable[dateKey] === '' || advanceTable[dateKey] === undefined) {
        advanceTable[dateKey] = null;
        advanceTable[stringKey] = null;
      } else if (advanceTable[dateKey] != null) {
        advanceTable[stringKey] = this.generalService.getTimeApplicable(advanceTable[dateKey]);
      }
    };

    const normalizeTimeField = (timeKey: string, stringKey: string): void => {
      if (advanceTable[timeKey] === '' || advanceTable[timeKey] === undefined) {
        advanceTable[timeKey] = null;
        advanceTable[stringKey] = null;
      } else if (advanceTable[timeKey] != null) {
        advanceTable[stringKey] = this.generalService.getTimeApplicable(advanceTable[timeKey]);
      }
    };

    normalizeDateField('securityGuardPickupDate', 'securityGuardPickupDateString');
    normalizeDateField('securityGuardDropOffDate', 'securityGuardDropOffDateString');
    normalizeTimeField('securityGuardPickupTime', 'securityGuardPickupTimeString');
    normalizeTimeField('securityGuardDropOffTime', 'securityGuardDropOffTimeString');

    if (!toBool(advanceTable.doesThisReservationContainSecurityGuard)) {
      this.clearSecurityGuardPayloadFields(advanceTable);
      return;
    }

    if (typeof advanceTable.securityGuardDetails === 'string') {
      const trimmed = advanceTable.securityGuardDetails.trim();
      advanceTable.securityGuardDetails = trimmed.length > 0 ? trimmed.slice(0, 500) : null;
    } else if (advanceTable.securityGuardDetails === '' || advanceTable.securityGuardDetails === undefined) {
      advanceTable.securityGuardDetails = null;
    }

    if (toBool(advanceTable.securityGuardInfoNotReceived)) {
      advanceTable.securityGuardID = null;
      advanceTable.securityGuard = null;
      advanceTable.securityGuardEmail = null;
      advanceTable.securityGuardMobile = null;
    }

    if (toBool(advanceTable.securityGuardPickupInfoNotReceived)) {
      advanceTable.securityGuardPickupCityID = null;
      advanceTable.securityGuardPickupCity = null;
      advanceTable.securityGuardPickupAddress = null;
      advanceTable.securityGuardPickupAddressDetails = null;
      advanceTable.securityGuardPickupAddressLatLong = null;
      advanceTable.securityGuardPickupIsTimeNotConfirmed = false;
      this.applyDefaultGuardPickupScheduleToPayload(advanceTable);
    }

    if (toBool(advanceTable.securityGuardDropOffInfoNotReceived)) {
      advanceTable.securityGuardDropOffCityID = null;
      advanceTable.securityGuardDropOffCity = null;
      advanceTable.securityGuardDropOffAddress = null;
      advanceTable.securityGuardDropOffAddressDetails = null;
      advanceTable.securityGuardDropOffAddressLatLong = null;
      advanceTable.securityGuardDropOffIsTimeNotConfirmed = false;
      this.applyDefaultGuardDropOffScheduleToPayload(advanceTable);
    }
  }

  private preserveSoftCappingBypassFields(advanceTable: any): void {
    if (!advanceTable) {
      return;
    }
    const reason = advanceTable.softCappingByPassReason;
    const details = advanceTable.softCappingByPassDetails;
    const approverId = advanceTable.softCappingByPassApproverID;
    const hasReason = reason != null && String(reason).trim() !== '';
    const hasDetails = details != null && String(details).trim() !== '';
    const hasApprover = approverId != null && Number(approverId) > 0;
    if (!hasReason && !hasDetails && !hasApprover) {
      delete advanceTable.softCappingByPassReason;
      delete advanceTable.softCappingByPassDetails;
      delete advanceTable.softCappingByPassApproverID;
      return;
    }
    advanceTable.softCappingByPassReason = hasReason ? String(reason).trim() : null;
    advanceTable.softCappingByPassDetails = hasDetails ? String(details).trim() : null;
    advanceTable.softCappingByPassApproverID = hasApprover ? Number(approverId) : null;
  }

  update(advanceTable: any)
  {
    this.preserveSoftCappingBypassFields(advanceTable);
    advanceTable.reservationStatusChangedByID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.etrDate==="")
      {
        advanceTable.etrDate=null;
      }
      else
      {
        advanceTable.etrDateString=this.generalService.getTimeApplicable(advanceTable.etrDate);
      }
      if(advanceTable.etrTime==="")
      {
        advanceTable.etrTime=null;
      }
      else
      {
        advanceTable.etrTimeString=this.generalService.getTimeApplicable(advanceTable.etrTime);
      }
  
    if(advanceTable.pickupSpotTypeID==="")
    {
      advanceTable.pickupSpotTypeID=0;
    }
    this.normalizeCustomerSpecificFieldsPayload(advanceTable);
    if(advanceTable.pickupSpotID==="")
    {
      advanceTable.pickupSpotID=0;
    }
    if(advanceTable.dropOffCityID==="")
    {
      advanceTable.dropOffCityID=0;
    }
    if(advanceTable.dropOffSpotID==="")
    {
      advanceTable.dropOffSpotID=0;
    }
    if(advanceTable.dropOffSpotTypeID==="")
    {
      advanceTable.dropOffSpotTypeID=0;
    }
    if(advanceTable.pickupDate==="")
    {
      advanceTable.pickupDate=null;
    }
    else
    {
      advanceTable.pickupDateString=this.generalService.getTimeApplicable(advanceTable.pickupDate);
    }
    if(advanceTable.dropOffDate==="")
    {
      advanceTable.dropOffDate=null;
    }
    else
    {
      advanceTable.dropOffDateString=this.generalService.getTimeApplicable(advanceTable.dropOffDate);
    }
    if(advanceTable.locationOutDate==="")
      {
        advanceTable.locationOutDate=null;
      }
      else
      {
        advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
      }
    if(advanceTable.locationOutTime==="")
    {
      advanceTable.locationOutTime=null;
    }
    else
    {
      advanceTable.locationOutTimeString=this.generalService.getTimeApplicable(advanceTable.locationOutTime);
    }
    if(advanceTable.pickupTime==="")
    {
      advanceTable.pickupTime=null;
    }
    else
    {
      advanceTable.pickupTimeString=this.generalService.getTimeApplicable(advanceTable.pickupTime);
    }
    if(advanceTable.dropOffTime==="")
    {
      advanceTable.dropOffTime=null;
    }
    else
    {
      advanceTable.dropOffTimeString=this.generalService.getTimeApplicable(advanceTable.dropOffTime);
    }   
    if(advanceTable.etrDate==="")
    {
      advanceTable.etrDate=null;
    }
    else
    {
      advanceTable.etrDateString=this.generalService.getTimeApplicable(advanceTable.etrDate);
    }
    if(advanceTable.etrTime==="")
    {
      advanceTable.etrTime=null;
    }
    else
    {
      advanceTable.etrTimeString=this.generalService.getTimeApplicable(advanceTable.etrTime);
    }
    this.normalizeSecurityGuardPayload(advanceTable);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  updateReservationEdit(advanceTable: any)
  {
    this.preserveSoftCappingBypassFields(advanceTable);
    advanceTable.reservationStatusChangedByID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.pickupSpotTypeID==="")
    {
      advanceTable.pickupSpotTypeID=0;
    }
    this.normalizeCustomerSpecificFieldsPayload(advanceTable);
    if(advanceTable.pickupSpotID==="")
    {
      advanceTable.pickupSpotID=0;
    }
    if(advanceTable.dropOffCityID==="")
    {
      advanceTable.dropOffCityID=0;
    }
    if(advanceTable.dropOffSpotID==="")
    {
      advanceTable.dropOffSpotID=0;
    }
    if(advanceTable.dropOffSpotTypeID==="")
    {
      advanceTable.dropOffSpotTypeID=0;
    }
    if(advanceTable.pickupDate==="")
    {
      advanceTable.pickupDate=null;
    }
    else
    {
      advanceTable.pickupDateString=this.generalService.getTimeApplicable(advanceTable.pickupDate);
    }
    if(advanceTable.dropOffDate==="")
    {
      advanceTable.dropOffDate=null;
    }
    else
    {
      advanceTable.dropOffDateString=this.generalService.getTimeApplicable(advanceTable.dropOffDate);
    }
    if(advanceTable.locationOutDate==="")
      {
        advanceTable.locationOutDate=null;
      }
      else
      {
        advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
      }
    if(advanceTable.locationOutTime==="")
    {
      advanceTable.locationOutTime=null;
    }
    else
    {
      advanceTable.locationOutTimeString=this.generalService.getTimeApplicable(advanceTable.locationOutTime);
    }
    if(advanceTable.pickupTime==="")
    {
      advanceTable.pickupTime=null;
    }
    else
    {
      advanceTable.pickupTimeString=this.generalService.getTimeApplicable(advanceTable.pickupTime);
    }
    if(advanceTable.dropOffTime==="")
    {
      advanceTable.dropOffTime=null;
    }
    else
    {
      advanceTable.dropOffTimeString=this.generalService.getTimeApplicable(advanceTable.dropOffTime);
    }   
    if(advanceTable.etrDate==="")
      {
        advanceTable.etrDate=null;
      }
      else
      {
        advanceTable.etrDateString=this.generalService.getTimeApplicable(advanceTable.etrDate);
      }
      if(advanceTable.etrTime==="")
      {
        advanceTable.etrTime=null;
      }
      else
      {
        advanceTable.etrTimeString=this.generalService.getTimeApplicable(advanceTable.etrTime);
      }
    this.normalizeSecurityGuardPayload(advanceTable);
    return this.httpClient.put<any>(this.API_URL+'/'+'UpdateReservationForEdit' , advanceTable);
  }

  /** Pickup geo + details only (Reservation + pickup stop). Used by KAM correction and change-pickup flows. */
  updatePickupAddressOnly(payload: {
    reservationID: number;
    reservationStopAddress: string;
    reservationStopAddressDetails: string;
    reservationStopAddressLatLong: string;
    userID?: number;
    isKamAddressCorrection?: boolean;
  }): Observable<any> {
    const body = {
      reservationID: payload.reservationID,
      userID: payload.userID ?? this.generalService.getUserID(),
      reservationStopAddress: payload.reservationStopAddress,
      reservationStopAddressDetails: payload.reservationStopAddressDetails,
      reservationStopAddressLatLong: payload.reservationStopAddressLatLong,
      isKamAddressCorrection: payload.isKamAddressCorrection === true,
    };
    return this.httpClient.put<any>(this.API_URL + '/UpdatePickupTimeChnagesReservation', body);
  }

  getKamPickupAddressCorrectionHistory(reservationID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/kamPickupAddressCorrectionHistory/' + reservationID);
  }

  /**
   * Ensure CSF arrays + customerSpecificFields JSON are never wiped to null/"" before PUT.
   * Backend UpdateReservationForEdit writes DBNull when CustomerReservationFieldID is empty/null.
   */
  private normalizeCustomerSpecificFieldsPayload(advanceTable: any): void {
    if (advanceTable.customerReservationFieldID === '') {
      advanceTable.customerReservationFieldID = [];
    }
    if (advanceTable.fieldName === '') {
      advanceTable.fieldName = [];
    }
    if (advanceTable.projectCode === '') {
      advanceTable.projectCode = [];
    }
    if (advanceTable.fieldValue === '') {
      advanceTable.fieldValue = [];
    }

    const ids = Array.isArray(advanceTable.customerReservationFieldID)
      ? advanceTable.customerReservationFieldID
      : [];
    const names = Array.isArray(advanceTable.fieldName) ? advanceTable.fieldName : [];
    const values = Array.isArray(advanceTable.projectCode)
      ? advanceTable.projectCode
      : (Array.isArray(advanceTable.fieldValue) ? advanceTable.fieldValue : []);

    advanceTable.customerReservationFieldID = ids;
    advanceTable.fieldName = names;
    advanceTable.projectCode = values;
    advanceTable.fieldValue = Array.isArray(advanceTable.fieldValue) ? advanceTable.fieldValue : values;

    if (
      (!advanceTable.customerSpecificFields || advanceTable.customerSpecificFields === '') &&
      ids.length > 0
    ) {
      advanceTable.customerSpecificFields = JSON.stringify(
        ids.map((id: number, index: number) => ({
          CustomerReservationFieldID: id,
          FieldName: names[index] ?? '',
          FieldValue: values[index] ?? '',
        }))
      );
    }
  }

  /**
   * Direct CSF persist used by the control-panel CSF dialog.
   * Bypasses ReservationProc and writes Reservation.CustomerSpecificFields via SQL.
   */
  updateCustomerSpecificFields(payload: {
    reservationID: number;
    customerReservationFieldID: number[];
    fieldName: string[];
    fieldValue: string[];
  }): Observable<any> {
    const body = {
      ...payload,
      userID: this.generalService.getUserID(),
    };
    return this.httpClient.put<any>(this.API_URL + '/updateReservation', body);
  }

  delete(reservationID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ reservationID);
  }

  getReservationCapping(CustomerGroupID:number,CustomerID:number,PickupDate:string,CityID:number,PackageTypeID:number,VehicleID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CustomerGroupReservationCapping + "/CheckReservationCapping/" + CustomerGroupID + '/' + CustomerID + '/' + PickupDate + '/' + CityID + '/' + PackageTypeID + '/' + VehicleID);
  }

  getSoftReservationCapping(CustomerGroupID:number,CustomerID:number,PickupDate:string,CityID:number,PackageTypeID:number,VehicleID:number): Observable<any> {
    return this.httpClient.get(
      this.API_URL_CustomerGroupReservationCapping + '/CheckSoftReservationCapping/'
      + CustomerGroupID + '/' + CustomerID + '/' + PickupDate + '/' + CityID + '/' + PackageTypeID + '/' + VehicleID
    );
  }
  GetResrvationGSTForCityID(customerID:number,cityID:number): Observable<any> {
    return this.httpClient.get(this.generalService.BaseURL + "customerConfigurationInvoicing/GetResrvationGSTForCityID/"+customerID +'/'+cityID);
  }
  GetResrvationGSTDetails(customerID:number): Observable<CustomerConfigurationInvoicing[]> {
    return this.httpClient.get<CustomerConfigurationInvoicing[]>(this.generalService.BaseURL + "customerConfigurationInvoicing/GetResrvationGSTDetails/"+customerID);
  }
  
  GetIsGSTMandatoryWithResrvation(customerGroupID:number): Observable<any> {
    return this.httpClient.get<any>(this.generalService.BaseURL + "customerGroup/GetIsGSTMandatoryWithResrvation/"+customerGroupID);
  }
  
  getReservationGSTData(ReservationID:number):  Observable<any> 
    {
      return this.httpClient.get(this.API_URL +"/getReservationGSTData/"+ReservationID);
    }
   updatePickupEdit(advanceTable: any) {
  if (advanceTable.pickupTime === "" || advanceTable.pickupTime == null) {
    advanceTable.pickupTime = null;
    advanceTable.pickupTimeString = null;
  } else {
    advanceTable.pickupTimeString = formatDate(advanceTable.pickupTime, 'HH:mm:ss', 'en-IN');
  }
  if (!advanceTable.dropOffTime) {
    advanceTable.dropOffTimeString = null;
  } else {
    advanceTable.dropOffTimeString = formatDate(advanceTable.dropOffTime, 'HH:mm:ss', 'en-IN');
  }
  if (advanceTable.pickupDate) {
    const pickupDate = advanceTable.pickupDate instanceof Date
      ? advanceTable.pickupDate
      : new Date(advanceTable.pickupDate);
    advanceTable.pickupDateString = formatDate(pickupDate, 'yyyy-MM-dd', 'en-IN');
  }

  return this.httpClient.put<any>(this.API_URL + '/' + 'EditPickupTime', advanceTable);
}
 updateLocationOutEdit(advanceTable: any) {
  if (advanceTable.locationOutTime === "" || advanceTable.locationOutTime == null) {
    advanceTable.locationOutTime = null;
    advanceTable.locationOutTimeString = null;
  } else {
    advanceTable.locationOutTimeString = formatDate(advanceTable.locationOutTime, 'HH:mm:ss', 'en-IN');
  }
  if (advanceTable.locationOutDate) {
    const locationOutDate = advanceTable.locationOutDate instanceof Date
      ? advanceTable.locationOutDate
      : new Date(advanceTable.locationOutDate);
    advanceTable.locationOutDateString = formatDate(locationOutDate, 'yyyy-MM-dd', 'en-IN');
  } else {
    advanceTable.locationOutDateString = null;
  }

  return this.httpClient.put<any>(this.API_URL + '/' + 'EditLocationOutTime', advanceTable);
}

  CheckValidationForSameReservation(CustomerID: number, PassengerID: number, CityID: number, PickupDate: string, PickupTime: string):Observable<any> 
  {
    let formattedDate: string | null = null;
    try {
      formattedDate = PickupDate ? this.datePipe.transform(PickupDate, 'yyyy-MM-dd') : null;
    } catch {
      formattedDate = null;
    }
    if (!formattedDate || CustomerID == null || CustomerID === '' || PassengerID == null || PassengerID === '' || CityID == null || CityID === '') {
      return of({ result: false });
    }
    const formattedTime = PickupTime || '00:00';
    return this.httpClient.get<any>(this.API_URL + '/' + 'CheckValidationForSameReservation' + '/' + CustomerID + '/' + PassengerID + '/' + CityID + '/' + formattedDate + '/' + formattedTime);
  }

}
  

