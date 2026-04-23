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
  add(advanceTable: CustomerPerson) 
  {
    advanceTable.customerPersonID=-1;
    advanceTable.userID=this.generalService.getUserID();

    if(advanceTable.employeeCode==="")
    {
      advanceTable.employeeCode=null;
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPerson)
  {
    advanceTable.userID=this.generalService.getUserID();

    if(advanceTable.employeeCode==="")
    {
      advanceTable.employeeCode=null;
    }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonID  + '/'+ userID);
  }
}
