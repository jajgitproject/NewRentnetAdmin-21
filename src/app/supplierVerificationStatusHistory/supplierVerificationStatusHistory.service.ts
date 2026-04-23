// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierVerificationStatusHistory } from './supplierVerificationStatusHistory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierVerificationStatusHistoryService 
{
  private API_URL:string = '';
  private API_URL_Date:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierVerificationStatusHistory";
    this.API_URL_Date=generalService.BaseURL+ "supplierRequiredDocument";
  }
  /** CRUD METHODS */

  getDataByDate(StatusDate:string):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Date + "/" + 'getSupplierRequiredDocumentByDate' + "/" + StatusDate);
  }

  getTableData(SearchStatus:string,SupplierID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchStatus==="")
    {
      SearchStatus=null;
    }
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchStatus + '/'+SupplierID + '/' + SearchActivationStatus +'/' + PageNumber + '/SupplierVerificationStatusHistoryID/Descending');
  }
  getTableDataSort(SearchStatus:string,SupplierID:number, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchStatus==="")
    {
      SearchStatus=null;
    }
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchStatus + '/'+SupplierID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierVerificationStatusHistory) 
  {
    //advanceTable.supplierVerificationStatusHistoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.supplierVerificationStatusByEmployeeID=this.generalService.getUserID();
    advanceTable.supplierVerificationStatusDate= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierVerificationStatusHistory)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.supplierVerificationStatusByEmployeeID=this.generalService.getUserID();
    advanceTable.supplierVerificationStatusDate= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierVerificationStatusHistoryID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ supplierVerificationStatusHistoryID);
  }

  
}
  

