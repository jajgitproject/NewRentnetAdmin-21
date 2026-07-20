// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { IndividualCustomerModel } from './individualCustomer.model';

@Injectable()
export class IndividualCustomerService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerIndividual';
  }

  add(advanceTable: IndividualCustomerModel): Observable<any> {
    const payload = this.sanitizePayload(advanceTable);
    payload.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, payload);
  }

  /** Coerce empty strings to numbers/bools so System.Text.Json model binding does not return 400. */
  sanitizePayload(raw: any): any {
    const toInt = (v: any, fallback: number = 0) => {
      if (v === null || v === undefined || v === '') return fallback;
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    };
    const toBool = (v: any, fallback: boolean = false) => {
      if (v === null || v === undefined || v === '') return fallback;
      if (typeof v === 'boolean') return v;
      if (v === 'true' || v === 1 || v === '1') return true;
      if (v === 'false' || v === 0 || v === '0') return false;
      return fallback;
    };
    const toDecimalOrNull = (v: any) => {
      if (v === null || v === undefined || v === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    return {
      customerPersonName: (raw.customerPersonName || '').toString().trim(),
      salutationID: toInt(raw.salutationID),
      salutation: raw.salutation || '',
      gender: raw.gender || '',
      importance: raw.importance || '',
      primaryMobile: raw.primaryMobile || '',
      primaryEmail: raw.primaryEmail || '',
      billingEmail: raw.billingEmail || '',
      locationID: toInt(raw.locationID),
      location: raw.location || '',
      gstNumber: raw.gstNumber || null,
      gstRate: toDecimalOrNull(raw.gstRate),
      billingName: raw.billingName || '',
      billingAddress: raw.billingAddress || '',
      billingCityID: toInt(raw.billingCityID),
      billingCityName: raw.billingCityName || '',
      billingStateID: toInt(raw.billingStateID),
      billingStateName: raw.billingStateName || '',
      billingPin: raw.billingPin || '',
      eInvoiceAddress: raw.eInvoiceAddress || '',
      employeeID: toInt(raw.employeeID),
      employeeName: raw.employeeName || '',
      customerKAMCityID: toInt(raw.customerKAMCityID),
      customerKAMCity: raw.customerKAMCity || '',
      roundOffInvoiceValue: toBool(raw.roundOffInvoiceValue, false),
      salesManagerID: toInt(raw.salesManagerID),
      salesManagerName: raw.salesManagerName || '',
      activationStatus: toBool(raw.activationStatus, true),
      customerDesignationID: toInt(raw.customerDesignationID, 0),
      customerDepartmentID: toInt(raw.customerDepartmentID, 0),
      countryForISDCodeID: toInt(raw.countryForISDCodeID, 0),
      maskMobileNumber: toBool(raw.maskMobileNumber, false),
      isPostPickUpCallAllowed: toBool(raw.isPostPickUpCallAllowed, false),
      customerContractID: toInt(raw.customerContractID),
      customerContractName: raw.customerContractName || '',
      userID: toInt(raw.userID)
    };
  }
}
