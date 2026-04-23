// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonDocument } from './customerPersonDocument.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonDocumentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonDocument";

  }
  /** CRUD METHODS */
  getTableData( customerPerson_ID:number,SearchCustomerPersonDocument:string, SearchDocumentNumber:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {

    if(SearchCustomerPersonDocument==="")
    {
      SearchCustomerPersonDocument="null";
    }
    if(SearchDocumentNumber==="")
    {
      SearchDocumentNumber="null";
    }
   
   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(this.API_URL + '/'+customerPerson_ID +'/'+SearchCustomerPersonDocument  + '/' + SearchDocumentNumber+'/' +  SearchActivationStatus +'/' + PageNumber + '/customerPersonDocumentID/Ascending');
  }

  getTableDataSort(customerPerson_ID:number,SearchCustomerPersonDocument:string, SearchDocumentNumber:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  { 
    if(SearchCustomerPersonDocument==="")
    {
      SearchCustomerPersonDocument="null";
    }
    if(SearchDocumentNumber==="")
    {
      SearchDocumentNumber="null";
    }
 
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(this.API_URL + '/'+customerPerson_ID +'/'+SearchCustomerPersonDocument  + '/' + SearchDocumentNumber+'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerPersonDocument) 
  {
    advanceTable.customerPersonDocumentID=-1;
    advanceTable.userID=this.generalService.getUserID();
   
    advanceTable.documentExpiryString=this.generalService.getTimeApplicable(advanceTable.documentExpiry);
  
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonDocument)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.documentExpiryString=this.generalService.getTimeApplicable(advanceTable.documentExpiry);
   
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonDocumentid: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonDocumentid + '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
