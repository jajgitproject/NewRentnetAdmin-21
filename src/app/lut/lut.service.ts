// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lut } from './lut.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class LutService 
{
  private API_URL:string = '';
  private GA_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "lut";
    this.GA_API_URL=generalService.BaseURL+ "organizationalEntity";
  }
  /** CRUD METHODS */
  getTableData(SearchBankBranch:string,SearchBank:string,SearchLutNo:string,searchcompanyBranch:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchBankBranch==="")
    {
      SearchBankBranch="null";
    }
    if(SearchBank==="")
    {
      SearchBank="null";
    }
    if(SearchLutNo==="")
    {
      SearchLutNo="null";
    }
    if(searchcompanyBranch==="")
      {
        searchcompanyBranch="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBankBranch + '/'+ SearchBank +'/'+ SearchLutNo +'/' + searchcompanyBranch +'/' + SearchActivationStatus +'/' + PageNumber + '/LutID/Ascending');
    
  }

  GetLutForBranch(organizationalEntityID:number):  Observable<any> 
  {
    return this.httpClient.get(this.GA_API_URL +"/getLutForCompanyBranch/"+organizationalEntityID);
  }
  getTableDataSort(SearchBankBranch:string,SearchBank:string,SearchLutNo:string,searchcompanyBranch:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchBankBranch==="")
    {
      SearchBankBranch="null";
    }
    if(SearchBank==="")
    {
      SearchBank="null";
    }
    if(SearchLutNo==="")
    {
      SearchLutNo="null";
    }
    if(searchcompanyBranch==="")
      {
        searchcompanyBranch="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBankBranch +'/'+ SearchBank +'/'+ SearchLutNo +'/'+ searchcompanyBranch +'/'  + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Lut) 
  {
    advanceTable.lutID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Lut)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(lutID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ lutID + '/'+ userID);
  }
}
  

