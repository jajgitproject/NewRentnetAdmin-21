// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DisputeResolution } from './disputeResolution.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DisputeResolutionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "disputeResolution";
  }

  getDisputeDetails(disputeID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForDisputeDetails/' + disputeID}`);
  }
  /** CRUD METHODS */
  // getTableData(disputeID:number,
  //   SearchActivationStatus:boolean, 
  //   PageNumber: number):  Observable<any> 
  // {
  //   if(disputeID===0)
  //   {
  //     disputeID=0;
  //   }
  
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +disputeID + '/'+ SearchActivationStatus +'/' + PageNumber + '/supplierCustomerFixedPercentageForAllID/Ascending');
  // }
  // getTableDataSort(disputeID:number,
  //   SearchActivationStatus:boolean, 
  //   PageNumber: number,
  //   coloumName:string,
  //   sortType:string):  Observable<any> 
  // {
  //   if(disputeID===0)
  //   {
  //     disputeID=0;
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +disputeID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  // }

  getTableData(disputeID:number, SearchactionTaken:string,SearchActivationStatus:boolean, PageNumber: number, orderBy: string = 'Ascending'):  Observable<any> 
  {
    if(disputeID===0)
    {
      disputeID=0;
    }
    if(SearchactionTaken==="")
      {
        SearchactionTaken="null";
      }
      if(SearchActivationStatus===null)
        {
          SearchActivationStatus=null;
        }
    return this.httpClient.get(this.API_URL +"/"+'GetAllDisputeResolution'+  "/" +disputeID + '/'+SearchactionTaken + '/'+ SearchActivationStatus +'/' + PageNumber + '/DisputeResolutionID/'+orderBy);
  }
  getTableDataSort(disputeID:number,SearchactionTaken:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(disputeID===0)
      {
        disputeID=0;
      }
      if(SearchactionTaken==="")
        {
          SearchactionTaken="null";
        }
        if(SearchActivationStatus===null)
          {
            SearchActivationStatus=null;
          }
    //console.log(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL +"/"+'GetAllDisputeResolution'+  "/" + disputeID + '/' +SearchactionTaken + '/' + SearchActivationStatus +'/'+ PageNumber + '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: DisputeResolution) 
  {
    advanceTable.disputeResolutionID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.actionTakenDateString=this.generalService.getTimeApplicable(advanceTable.actionTakenDate);
    advanceTable.actionTakenTimeString=this.generalService.getTimeApplicableTO(advanceTable.actionTakenTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DisputeResolution)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.actionTakenDateString=this.generalService.getTimeApplicable(advanceTable.actionTakenDate);
    advanceTable.actionTakenTimeString=this.generalService.getTimeApplicableTO(advanceTable.actionTakenTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(disputeResolutionID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ disputeResolutionID+ '/'+ userID);
    // return this.httpClient.delete(this.API_URL + '/'+ disputeResolutionID);
  }
}
