// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverDocument } from './driverDocument.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverDocumentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverDocument";
  }
  /** CRUD METHODS */
  getTableData(driverID:number,searchAddressCity:string,searchDocumentNumber:string,searchDocumentIssuingAuthority:string,searchAddress:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(driverID===0)
    {
      driverID=0;
    }
    if(searchAddressCity==="")
    {
      searchAddressCity="null";
    }
    if(searchDocumentNumber==="")
    {
      searchDocumentNumber="null";
    }
    if(searchDocumentIssuingAuthority==="")
    {
      searchDocumentIssuingAuthority="null";
    }
    if(searchAddress==="")
    {
      searchAddress="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/'+driverID + '/'+ searchAddressCity +'/'+ searchDocumentNumber +'/'+ searchDocumentIssuingAuthority +'/'+ searchAddress +'/' + SearchActivationStatus +'/' + PageNumber + '/driverDocumentID/Ascending');
  }
  getTableDataSort(driverID:number,searchAddressCity:string,searchDocumentNumber:string,searchDocumentIssuingAuthority:string,searchAddress:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(driverID===0)
    {
      driverID=0;
    }
    if(searchAddressCity==="")
    {
      searchAddressCity="null";
    }
    if(searchDocumentNumber==="")
    {
      searchDocumentNumber="null";
    }
    if(searchDocumentIssuingAuthority==="")
    {
      searchDocumentIssuingAuthority="null";
    }
    if(searchAddress==="")
    {
      searchAddress="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/'+driverID + '/'+ searchAddressCity +'/'+ searchDocumentNumber +'/'+ searchDocumentIssuingAuthority +'/'+ searchAddress +'/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: DriverDocument) 
  {
    advanceTable.driverDocumentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.documentExpiryString=this.generalService.getTimeApplicable(advanceTable.documentExpiry);
    //advanceTable.uploadedByID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DriverDocument)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.documentExpiryString=this.generalService.getTimeApplicable(advanceTable.documentExpiry);
    //advanceTable.uploadedByID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(driverDocumentID: number):  Observable<any> 
  {
    
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ driverDocumentID  + '/'+ userID) ;
  }
}
