// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyAmenitieModel, DutySlipQualityCheck } from './dutySlipQualityCheck.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutySlipQualityCheckService 
{
  private API_URL:string = '';
  private DA_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutySlipQualityCheck";
    this.DA_API_URL=generalService.BaseURL+ "dutyAmenitie";
  }
  /** CRUD METHODS */
  getTableData(SearchStartDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    // if(driverID===0)
    // {
    //   driverID=0;
    // }
    // if(inventoryID===0)
    // {
    //   inventoryID=0;
    // }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ SearchStartDate + '/' + SearchActivationStatus +'/' + PageNumber + '/dutySlipQualityCheckID/Ascending');
  }
  getTableDataSort(SearchStartDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    // if(driverID===0)
    // {
    //   driverID=0;
    // }
    // if(inventoryID===0)
    // {
    //   inventoryID=0;
    // }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL +"/"+ SearchStartDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+ coloumName +'/'+ sortType);
  }
  add(advanceTable: DutySlipQualityCheck) 
  {
    advanceTable.dutyQualityCheckID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.qCDateString=this.generalService.getTimeApplicable(advanceTable.qCDate);
    advanceTable.qCTimeString=this.generalService.getTimeApplicableTO(advanceTable.qCTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  addDutyAmenitie(advanceTable: DutyAmenitieModel) 
  {
    advanceTable.dutyAmenitieID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.DA_API_URL , advanceTable);
  }

  updateDutyAmenitie(advanceTable: DutySlipQualityCheck)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.DA_API_URL , advanceTable);
  }

  update(advanceTable: DutySlipQualityCheck)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.qCDateString=this.generalService.getTimeApplicable(advanceTable.qCDate);
    advanceTable.qCTimeString=this.generalService.getTimeApplicableTO(advanceTable.qCTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyQualityCheckID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ dutyQualityCheckID);
  }

  deleteAmenitie(dutyAmenitieID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.DA_API_URL + '/'+ dutyAmenitieID+ '/'+ userID);
  }

  getAllotmentIDForDutyQualityCheck(AllotmentID:number)
  {
    console.log(this.API_URL+"/"+'getAllotmentIDForDutyQualityCheck'+"/"+AllotmentID)
    return this.httpClient.get(this.API_URL+"/"+'getAllotmentIDForDutyQualityCheck'+"/"+AllotmentID);
  }

  getDutyAmenities(dutySlipID:any, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {

    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.DA_API_URL + "/"+ dutySlipID + '/' + SearchActivationStatus +'/' + PageNumber + '/DutyAmenitieID/Ascending');
  }
  getDutyAmenitiesSort(dutySlipID:any, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.DA_API_URL +"/"+ dutySlipID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+ coloumName +'/'+ sortType);
  }
   UpdateVerifiedDutyAmenitie(advanceTable: DutyAmenitieModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.DA_API_URL+'/'+'UpdateVerifiedDutyAmenitie' , advanceTable);
  }
}
