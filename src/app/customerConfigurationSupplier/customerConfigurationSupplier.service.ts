// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerConfigurationSupplier } from './customerConfigurationSupplier.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerConfigurationSupplierService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerConfigurationSupplier";
  }
  /** CRUD METHODS */
  getTableData(SearchID:number,CustomerID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchID + '/'+CustomerID + '/' + SearchActivationStatus +'/' + PageNumber + '/customerConfigurationSupplierID/Ascending');
  }
  getTableDataSort(SearchID:number,CustomerID:number, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchID + '/'+CustomerID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerConfigurationSupplier) 
  {
    debugger;
    advanceTable.customerConfigurationSupplierID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerConfigurationSupplier)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerConfigurationSupplierID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerConfigurationSupplierID);
  }
}
