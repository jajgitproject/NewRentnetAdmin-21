// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryDocumentModel, InventoryDocumentVerificationModel } from './inventoryDocument.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DocumentDropDown } from '../general/documentDropDown.model';
@Injectable()
export class InventoryDocumentService 
{
  private API_URL:string = '';
  private API_URL_Verify:string = '';
  private API_URL_ForDoc:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "inventoryDocument";
    this.API_URL_Verify=generalService.BaseURL+ "inventoryDocumentVerification";
    this.API_URL_ForDoc=generalService.BaseURL+ "document";
  }
  /** CRUD METHODS */
  getTableData(inventoryID:number,searchAddressCity:string,searchDocumentNumber:string,searchDocumentIssuingAuthority:string,searchAddress:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(inventoryID===0)
    {
      inventoryID=0;
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
    return this.httpClient.get(this.API_URL + '/'+inventoryID + '/'+ searchAddressCity +'/'+ searchDocumentNumber +'/'+ searchDocumentIssuingAuthority +'/'+ searchAddress +'/' + SearchActivationStatus +'/' + PageNumber + '/InventoryDocumentID/Ascending');
  }
  
  getTableDataSort(inventoryID:number,searchAddressCity:string,searchDocumentNumber:string,searchDocumentIssuingAuthority:string,searchAddress:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(inventoryID===0)
    {
      inventoryID=0;
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
    return this.httpClient.get(this.API_URL + '/'+inventoryID + '/'+ searchAddressCity +'/'+ searchDocumentNumber +'/'+ searchDocumentIssuingAuthority +'/'+ searchAddress +'/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: InventoryDocumentModel) 
  {
    advanceTable.inventoryDocumentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.documentExpiryString=this.generalService.getTimeApplicable(advanceTable.documentExpiry);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: InventoryDocumentModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.documentExpiryString=this.generalService.getTimeApplicable(advanceTable.documentExpiry);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(inventoryDocumentID: number):  Observable<any> 
  {    
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ inventoryDocumentID  + '/'+ userID) ;
  }

  updateVerification(advanceTable: InventoryDocumentVerificationModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.verificationDateString=this.generalService.getTimeApplicable(advanceTable.verificationDate);
    advanceTable.verifiedByID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL_Verify , advanceTable);
  }

  GetDocumentForInventory(): Observable<DocumentDropDown[]> 
  {
    return this.httpClient.get<DocumentDropDown[]>(this.API_URL_ForDoc + "/GetDocumentForInventory");
  } 
}
