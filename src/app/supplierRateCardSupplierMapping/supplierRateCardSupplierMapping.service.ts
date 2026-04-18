// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierRateCardSupplierMapping } from './supplierRateCardSupplierMapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierRateCardSupplierMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierRateCardSupplierMapping";
  }
  /** CRUD METHODS */
  getTableData(SupplierContractName:string,SupplierID:number,SearchSupplierName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SupplierContractName==="")
    {
      SupplierContractName="null";
    }
    if(SearchSupplierName==="")
    {
      SearchSupplierName="null";
    }
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SupplierContractName + '/' + SupplierID + '/'+SearchSupplierName + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractMappingID/Ascending');
  }
  getTableDataSort(SupplierContractName:string,SupplierID:number,SearchSupplierName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SupplierContractName==="")
    {
      SupplierContractName="null";
    }
    if(SearchSupplierName==="")
    {
      SearchSupplierName="null";
    }
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SupplierContractName + '/' +SupplierID +  '/'+SearchSupplierName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierRateCardSupplierMapping) 
  {
    advanceTable.supplierContractMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierRateCardSupplierMapping)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractMappingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractMappingID + '/'+ userID);
  }
}
