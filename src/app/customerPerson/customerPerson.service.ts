// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPerson, MobileEmailModel } from './customerPerson.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonService 
{
  private API_URL:string = '';
  private API_URL_Driver:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPerson";
    this.API_URL_Driver=generalService.BaseURL+ "driver";
  }

//   checkDuplicateCustomerPerson(customerPerson: {
//   customerPersonName: string;
//   primaryMobile: string;
//   primaryEmail: string;
//   customerGroupID: number;
// }): Observable<MobileEmailModel> {
//   return this.httpClient.get<MobileEmailModel>(this.API_URL + '/check-duplicate-customer-person', { params: customerPerson });
//   }

  DuplicateCustomerPersonName(customerPersonName: string,primaryMobile:string,customerGroupID:number):  Observable<any> 
  {
    debugger
    return this.httpClient.get(this.API_URL + '/checkDuplicateCustomerPerson' + "/" + customerPersonName + "/" + primaryMobile + "/" + customerGroupID);
  }

   duplicateCustomerPersonNameEmail(customerPersonName: string,primaryEmail:string,customerGroupID:number):  Observable<any> 
  {

    return this.httpClient.get(this.API_URL + '/getDuplicateByNameEmailGroup' + "/" + customerPersonName + "/" + primaryEmail + "/" + customerGroupID);
  }

   duplicateCustomerPersonNameMobileEmail(customerPersonName: string, primaryMobile:string,primaryEmail:string,customerGroupID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/getDuplicateByNameEmailGroup' + "/" + customerPersonName + "/" + primaryMobile + "/" + primaryEmail + "/" + customerGroupID);
  }
  getPassword(referenceID:number,type:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Driver + '/GetDriverPassword' + "/" + referenceID + "/" + type);
  }
  /** CRUD METHODS */
  getTableData(
    SearchCustomer:string,
    SearchName:string,
    SearchPrimary:string,
    SearchBilling:string,
    SearchMobile:string,
    CustomerGroupID:number,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    
    if(SearchCustomer==="")
    {
      SearchCustomer="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchPrimary==="")
    {
      SearchPrimary="null";
    }
    if(SearchBilling==="")
    {
      SearchBilling="null";
    }
    if(SearchMobile==="")
    {
      SearchMobile="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL+  "/"+SearchCustomer + "/" +SearchName + '/'+SearchPrimary + '/'+SearchBilling + '/'+SearchMobile + '/'+CustomerGroupID + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonName/Ascending');
  }
  getTableDataSort(SearchCustomer:string,
    SearchName:string, 
    SearchPrimary:string,
    SearchBilling:string,
    SearchMobile:string,
    CustomerGroupID:number,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {

    if(SearchCustomer==="")
    {
      SearchCustomer="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchPrimary==="")
    {
      SearchPrimary="null";
    }
    if(SearchBilling==="")
    {
      SearchBilling="null";
    }
    if(SearchMobile==="")
    {
      SearchMobile="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL+ "/" +SearchCustomer + "/" +SearchName + '/'+SearchPrimary + '/'+SearchBilling + '/'+SearchMobile + '/'+CustomerGroupID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  private coerceCustomerPersonIdFields(payload: any): void {
    const toInt = (value: any, fallback = 0): number => {
      if (value === null || value === undefined || value === '') {
        return fallback;
      }
      const n = Number(value);
      return Number.isFinite(n) ? n : fallback;
    };
    payload.customerPersonID = toInt(payload.customerPersonID, -1);
    payload.customerGroupID = toInt(payload.customerGroupID);
    payload.customerID = toInt(payload.customerID);
    payload.salutationID = toInt(payload.salutationID);
    payload.customerDesignationID = toInt(payload.customerDesignationID);
    payload.customerDepartmentID = toInt(payload.customerDepartmentID);
    payload.userID = toInt(payload.userID, this.generalService.getUserID());
  }

  add(advanceTable: CustomerPerson) 
  {
    advanceTable.customerPersonID=-1;
    advanceTable.userID=this.generalService.getUserID();
    this.coerceCustomerPersonIdFields(advanceTable);
    this.applyIsSecurityGuardBeforeSave(advanceTable);
     if(advanceTable.primaryMobile==="")
    {
      advanceTable.primaryMobile=null;
    }
     if(advanceTable.primaryEmail==="")
    {
      advanceTable.primaryEmail=null;
    }
     if(advanceTable.billingEmail==="")
    {
      advanceTable.billingEmail=null;
    }

    if(advanceTable.employeeCode==="")
    {
      advanceTable.employeeCode=null;
    }
    if(advanceTable.costCenter==="")
    {
      advanceTable.costCenter=null;
    }
    if(advanceTable.isFeedbackEmailAllowed==="")
    {
      advanceTable.isFeedbackEmailAllowed=null;
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPerson)
  {
    advanceTable.userID=this.generalService.getUserID();
    this.coerceCustomerPersonIdFields(advanceTable);
    this.applyIsSecurityGuardBeforeSave(advanceTable);
     if(advanceTable.primaryMobile==="")
    {
      advanceTable.primaryMobile=null;
    }
     if(advanceTable.primaryEmail==="")
    {
      advanceTable.primaryEmail=null;
    }
     if(advanceTable.billingEmail==="")
    {
      advanceTable.billingEmail=null;
    }
    if(advanceTable.employeeCode==="")
    {
      advanceTable.employeeCode=null;
    }
    if(advanceTable.costCenter==="")
    {
      advanceTable.costCenter=null;
    }
    if(advanceTable.isFeedbackEmailAllowed==="")
    {
      advanceTable.isFeedbackEmailAllowed=null;
    }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonID  + '/'+ userID);
  }

  applyIsSecurityGuardBeforeSave(advanceTable: any): void {
    const coerced = this.coerceIsSecurityGuardToBool(
      advanceTable?.isSecurityGuard ?? advanceTable?.IsSecurityGuard
    );
    advanceTable.isSecurityGuard = coerced;
    advanceTable.IsSecurityGuard = coerced;
  }

  coerceIsSecurityGuardToBool(value: any): boolean | null {
    if (value === true || value === false) {
      return value;
    }
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (value === 'Yes' || value === 'yes' || value === 'true' || value === 'True' || value === 1 || value === '1') {
      return true;
    }
    if (value === 'No' || value === 'no' || value === 'false' || value === 'False' || value === 0 || value === '0') {
      return false;
    }
    return null;
  }
}
