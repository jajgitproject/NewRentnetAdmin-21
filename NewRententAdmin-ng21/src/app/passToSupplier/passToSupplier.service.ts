// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PassToSupplierModel, SupplierDropDownModel } from './passToSupplier.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PassToSupplierService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "passToSupplier";
  }
  /** CRUD METHODS */
  getTableData(SearchPassToSupplier:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchPassToSupplier==="")
    {
      SearchPassToSupplier="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchPassToSupplier + '/' + SearchActivationStatus +'/' + PageNumber + '/passToSupplier/Ascending');
  }
  getTableDataSort(SearchPassToSupplier:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchPassToSupplier==="")
    {
      SearchPassToSupplier="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchPassToSupplier + '/' + SearchActivationStatus + '/' + PageNumber +  '/'+ coloumName + '/' + sortType);
  }

  add(advanceTable: PassToSupplierModel) 
  {
    advanceTable.reservationPassedToSupplierID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: PassToSupplierModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  getSupplier():Observable<SupplierDropDownModel[]> 
  {
    return this.httpClient.get<SupplierDropDownModel[]>(this.API_URL + "/GetSupplierDropDown");
  }

  getData(reseravtionID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetPassToSupplierByID/' + reseravtionID);
  }
}
  

