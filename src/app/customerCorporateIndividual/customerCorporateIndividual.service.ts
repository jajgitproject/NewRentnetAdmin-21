// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CorporateCompanyModel, CustomerCorporateIndividualModel, CustomerPersonModel } from './customerCorporateIndividual.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
@Injectable()
export class CustomerCorporateIndividualService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerCorporateIndividual";
  }
  /** CRUD METHODS */
  getTableData(
    searchCustomerName:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }

  getTableDataSort(
    searchCustomerName:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerCorporateIndividualModel) 
  {
    const payload = this.sanitizePayload(advanceTable);
    payload.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, payload);
  }

  update(advanceTable: CustomerCorporateIndividualModel)
  {
    const payload = this.sanitizePayload(advanceTable);
    payload.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, payload);
  }

  /** Coerce empty strings to numbers/bools so API model binding does not return 400. */
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
    const toImportanceString = (v: any) => {
      if (v === null || v === undefined || v === '') return '';
      if (typeof v === 'boolean') return v ? 'true' : 'false';
      return String(v).trim();
    };

    return {
      corporateCompanyID: toInt(raw.corporateCompanyID),
      corporateCompany: raw.corporateCompany || '',
      customerPersonName: (raw.customerPersonName || '').toString().split('##')[0].trim(),
      salutationID: toInt(raw.salutationID),
      salutation: raw.salutation || '',
      gender: raw.gender || '',
      importance: toImportanceString(raw.importance),
      primaryMobile: raw.primaryMobile || '',
      primaryEmail: raw.primaryEmail || '',
      billingEmail: raw.billingEmail || '',
      locationID: toInt(raw.locationID),
      location: raw.location || '',
      gstNumber: raw.gstNumber || null,
      customerIdentityNumber: raw.customerIdentityNumber || null,
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
      isBillToShipToCustomer: toBool(raw.isBillToShipToCustomer, false),
      userID: toInt(raw.userID)
    };
  }

  delete(customerID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerID+ '/'+ userID);
  }

  getCustomer(): Observable<CorporateCompanyModel[]> 
  {
    return this.httpClient.get<CorporateCompanyModel[]>(this.API_URL + '/' + "DropDownForCustomer");
  }

  getCorporateCompanyByID(corporateCompanyID: number): Observable<any>
  {
    return this.httpClient.get<any>(this.generalService.BaseURL + 'customer/' + corporateCompanyID);
  }

  getCustomerPerson(CorporateCompanyID:number): Observable<CustomerPersonModel[]> 
  {
    return this.httpClient.get<CustomerPersonModel[]>(this.API_URL + '/' + "DropDownForCustomerPerson" + '/'+ CorporateCompanyID);
  }

  getKAMCity(EmployeeID:number): Observable<CityDropDown[]> 
  {
    return this.httpClient.get<CityDropDown[]>(this.API_URL + '/' + "DropDownForKAMCity" + '/'+ EmployeeID);
  }

  getCustomerCorporateIndividualData(CustomerPersonID): Observable<any> 
  {
    return this.httpClient.get<any>(this.API_URL + '/' + "GetCustomerCorporateIndividual" + '/'+ CustomerPersonID);
  }

}
