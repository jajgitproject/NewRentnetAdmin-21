// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierActivationStatusHistory } from './supplierActivationStatusHistory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierActivationStatusHistoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierActivationStatusHistory";
  }
  /** CRUD METHODS */
  getTableData(supplierStatus:string,SupplierID:number,supplierStatusReason:string,supplierStatusByEmployeeName:string,supplierStatusDate:string, PageNumber: number):  Observable<any> 
  {
    if(supplierStatus==="")
    {
      supplierStatus="null";
    }
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(supplierStatusReason==="")
      {
        supplierStatusReason="null";
      }
      if(supplierStatusByEmployeeName==="")
        {
          supplierStatusByEmployeeName="null";
        }
        if(supplierStatusDate==="")
          {
            supplierStatusDate="null";
          }
    return this.httpClient.get(this.API_URL + "/" +supplierStatus+ "/" +SupplierID+'/'+supplierStatusReason+'/'+supplierStatusByEmployeeName+'/'+supplierStatusDate+'/' + PageNumber + '/supplierStatus/Ascending');
  }
  getTableDataSort(supplierStatus:string,SupplierID:number,supplierStatusReason:string,supplierStatusByEmployeeName:string,supplierStatusDate:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(supplierStatus==="")
    {
      supplierStatus="null";
    }
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(supplierStatusReason==="")
      {
        supplierStatusReason="null";
      }
      if(supplierStatusByEmployeeName==="")
        {
          supplierStatusByEmployeeName="null";
        }
        if(supplierStatusDate==="")
          {
            supplierStatusDate="null";
          }
    return this.httpClient.get(this.API_URL + "/" +supplierStatus+ "/" +SupplierID +'/' +supplierStatusReason+'/'+supplierStatusByEmployeeName+'/'+supplierStatusDate+'/'+ PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierActivationStatusHistory) 
  {
    //advanceTable.supplierActivationStatusHistoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.supplierStatusByEmployeeID=this.generalService.getUserID();
    advanceTable.supplierStatusDate=this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierActivationStatusHistory)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  // delete(supplierActivationStatusHistoryID: number):  Observable<any> 
  // {
  //   return this.httpClient.delete(this.API_URL + '/'+ supplierActivationStatusHistoryID);
  // }
}
