// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierRequiredDocument } from './supplierRequiredDocument.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierRequiredDocumentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierRequiredDocument";
    //this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData(SearchDocumentName:string, SearchValidFrom:string, SearchValidTo:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchDocumentName==="")
    {
      SearchDocumentName="null";
    }
    if(SearchValidFrom==="")
    {
      SearchValidFrom="null";
    }
    if(SearchValidTo==="")
    {
      SearchValidTo="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
     return this.httpClient.get(this.API_URL + "/"+SearchDocumentName + '/'+SearchValidFrom + '/' + SearchValidTo +'/' + SearchActivationStatus +'/' + PageNumber + '/SupplierRequiredDocumentsID/Ascending');
  }


  viewSRD(SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL +'/' + SearchActivationStatus +'/' + PageNumber + '/SupplierRequiredDocumentsID/Ascending');
  }

  getTableDataSort(SearchDocumentName:string,SearchValidFrom:string,SearchValidTo, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchDocumentName==="")
    {
      SearchDocumentName="null";
    }
    if(SearchValidFrom==="")
    {
      SearchValidFrom="null";
    }
    if(SearchValidTo==="")
    {
      SearchValidTo="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDocumentName + '/'+SearchValidFrom + '/'+SearchValidTo + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierRequiredDocument) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.supplierRequiredDocumentsID=-1;
    if(advanceTable.requiredForSoftAttachment){
      advanceTable.requiredForSoftAttachment=true;
    }
    else{
     advanceTable.requiredForSoftAttachment=false;
    }
    
    if(advanceTable.requiredForFullAttachment){
      advanceTable.requiredForFullAttachment=true;
    }
    else{
     advanceTable.requiredForFullAttachment=false;
    }
    advanceTable.validFromString=this.generalService.getTimeS(advanceTable.validFrom);
    advanceTable.validToString=this.generalService.getTimeFromS(advanceTable.validTo);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierRequiredDocument)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.validFromString=this.generalService.getTimeS(advanceTable.validFrom);
    advanceTable.validToString=this.generalService.getTimeFromS(advanceTable.validTo);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierRequiredDocumentsID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierRequiredDocumentsID + '/' + userID);
  }
  // GetEmployeeData(employeeID: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  // }
}
