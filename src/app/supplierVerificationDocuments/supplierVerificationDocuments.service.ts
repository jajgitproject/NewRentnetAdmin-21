// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierVerificationDocuments } from './supplierVerificationDocuments.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierVerificationDocumentsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierVerificationDocuments";
  }
  /** CRUD METHODS */
  getTableData(SupplierID:number,SearchSupplierVerificationDocuments:string, SearchNumbers:string,SearchReasonNon:string,SearchsupplierRequiredDocumentAdditionDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(SearchSupplierVerificationDocuments==="")
    {
      SearchSupplierVerificationDocuments=null;
    }
    if(SearchNumbers==="")
    {
      SearchNumbers=null;
    }
    if(SearchReasonNon==="")
    {
      SearchReasonNon=null;
    }
    if(SearchsupplierRequiredDocumentAdditionDate==="")
      {
        SearchsupplierRequiredDocumentAdditionDate=null;
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SupplierID +"/" +SearchSupplierVerificationDocuments + '/' + SearchNumbers +'/'+ SearchReasonNon +'/'+ SearchsupplierRequiredDocumentAdditionDate +'/' + SearchActivationStatus +'/' + PageNumber + '/SupplierVerificationDocumentsID/Ascending');
  }
  getTableDataSort(SupplierID:number,SearchSupplierVerificationDocuments:string,SearchNumbers:string,SearchReasonNon:string,SearchsupplierRequiredDocumentAdditionDate:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SupplierID===0)
    {
      SupplierID=0;
    }
    if(SearchSupplierVerificationDocuments==="")
    {
      SearchSupplierVerificationDocuments=null;
    }
    if(SearchNumbers==="")
    {
      SearchNumbers=null;
    }
    if(SearchReasonNon==="")
    {
      SearchReasonNon=null;
    }
    if(SearchsupplierRequiredDocumentAdditionDate==="")
      {
        SearchsupplierRequiredDocumentAdditionDate=null;
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SupplierID +"/" +SearchSupplierVerificationDocuments + '/' + SearchNumbers +'/'+ SearchReasonNon +'/'+SearchsupplierRequiredDocumentAdditionDate +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierVerificationDocuments) 
  {
    advanceTable.supplierVerificationDocumentsID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.supplierRequiredDocumentAdditionDateString=this.generalService.getTimeApplicable(advanceTable.supplierRequiredDocumentAdditionDate);
    advanceTable.validTillString=this.generalService.getTimeApplicable(advanceTable.validTill);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierVerificationDocuments)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.supplierRequiredDocumentAdditionDateString=this.generalService.getTimeApplicable(advanceTable.supplierRequiredDocumentAdditionDate);
    advanceTable.validTillString=this.generalService.getTimeApplicable(advanceTable.validTill);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierVerificationDocumentsID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierVerificationDocumentsID + '/'+ userID);
  }

}
  

