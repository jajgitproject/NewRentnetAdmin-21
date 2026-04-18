// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { Dispute } from './dispute.model';
@Injectable()
export class DisputeService 
{
  private API_URL:string = '';
  private API_URL_Info:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  private disputeDataSubject = new BehaviorSubject<any[]>([]);
  disputeData$ = this.disputeDataSubject.asObservable();

  
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "Dispute";
    this.API_URL_Info=generalService.BaseURL+ "disputeDetails";
  }
  /** CRUD METHODS */
  getTableData(dutySlipForBillingID:number, PageNumber: number, orderBy: string = 'Ascending'):  Observable<any> 
  {
    if(dutySlipForBillingID===0)
    {
      dutySlipForBillingID=0;
    }
    return this.httpClient.get(this.API_URL +"/"+'GetAllDispute'+  "/" +dutySlipForBillingID + '/' + PageNumber + '/DisputeID/'+orderBy);
  }
  getTableDataSort(dutySlipForBillingID:number, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(dutySlipForBillingID===0)
      {
        dutySlipForBillingID=0;
      }
      
    //console.log(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL +"/"+'GetAllDispute'+  "/" + dutySlipForBillingID + '/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: Dispute) 
  {
    advanceTable.disputeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    // if(advanceTable.disputeDate)
    //   {
    //     advanceTable.disputeDateString=this.generalService.getTimeApplicableTO(advanceTable.disputeDate);
    //   }
    //   else
    //   {
    //     advanceTable.disputeDate=null;
    //   }
    //   advanceTable.disputeTimeString=this.generalService.getTimeTo(advanceTable.disputeTime);

    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  updateDispute(advanceTable:any)
  {
    advanceTable.userID=this.generalService.getUserID();
    // if(advanceTable.disputeDate)
    //   {
    //     advanceTable.disputeDateString=this.generalService.getTimeApplicableTO(advanceTable.disputeDate);
    //   }
    //   else
    //   {
    //     advanceTable.disputeDate=null;
    //   }
    //   advanceTable.disputeTimeString=this.generalService.getTimeTo(advanceTable.disputeTime);
      return this.httpClient.post<any>(this.API_URL , advanceTable);
    
    // return this.httpClient.put<any>(this.API_URL+'/UpdateDispute' , advanceTable);
  }

  delete(disputeID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+disputeID+ '/'+ userID);
  }

  getDisputeInfo(DutySlipID:Number):  Observable<any>
  {
    return this.httpClient.get(this.API_URL_Info + "/"+'GetDisputeDetails'+ "/"+ DutySlipID);
  }
   approveDisputeStatus(disputeID: number,dutySlipID:number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL +"/"+'ApproveDisputeStatus'+ '/'+disputeID+ '/'+ userID + '/'+ dutySlipID);
  }
  
  // Call this when dispute data is updated
  updateDisputeData(data: any[]) {
    this.disputeDataSubject.next(data);
  }
}
  

