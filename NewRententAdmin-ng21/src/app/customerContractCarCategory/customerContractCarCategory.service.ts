// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerContractCarCategory } from './customerContractCarCategory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerContractCarCategoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerContractCarCategory";
  }
  /** CRUD METHODS */
  getTableData(customerContractID:number,searchcustomerContractCarCategory:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchcustomerContractCarCategory==="")
    {
      searchcustomerContractCarCategory="null";
    }
   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
     return this.httpClient.get(this.API_URL + "/" +customerContractID + '/'+searchcustomerContractCarCategory + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerContractCarCategoryID/Ascending');
  }
  getTableDataSort(customerContractID:number,searchcustomerContractCarCategory:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {

    if(searchcustomerContractCarCategory==="")
    {
      searchcustomerContractCarCategory="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContractID + '/'+searchcustomerContractCarCategory + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerContractCarCategory) 
  {
    advanceTable.customerContractCarCategoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerContractCarCategory)
  {  advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerContractCarCategoryID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerContractCarCategoryID + '/'+ userID);
  }

  SaveCustomerContractCarCategory(data: CustomerContractCarCategory[]): Observable<any> {
    return this.httpClient.post(this.API_URL +'/Import', data);
  }
  GetVehicleCategoryToImportFormContractCarCategory(CustomerContractID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/'+ 'GetVehicleCategoryToImportFormContractCarCategory'+ '/'+ CustomerContractID);
  }
  ImportFromCustomerContract(data: CustomerContractCarCategory[]): Observable<any> {
    return this.httpClient.post(this.API_URL +'/ImportFromCustomerContract', data);
  }
}
