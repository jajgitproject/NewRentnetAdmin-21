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
    advanceTable.userID=this.generalService.getUserID();
    //advanceTable.customerID=-1;    
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: CustomerCorporateIndividualModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
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
