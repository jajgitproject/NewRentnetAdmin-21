// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllotCarAndDriver } from './allotCarAndDriver.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AllotCarAndDriverService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "allotment";
  }

  add(advanceTable: AllotCarAndDriver) 
  {
    advanceTable.allotmentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.allotmentByEmployeeID=this.generalService.getUserID();
    advanceTable.allotmentRemark=null;
    advanceTable.dateOfAllotment=null;
    advanceTable.timeofAllotment=null;
    advanceTable.allotmentStatus='Alloted';
    console.log(this.API_URL , advanceTable);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: AllotCarAndDriver)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.allotmentByEmployeeID=this.generalService.getUserID();
    advanceTable.allotmentRemark=null;
    advanceTable.dateOfAllotment=null;
    advanceTable.timeofAllotment=null;
    advanceTable.allotmentStatus='Alloted';
    return this.httpClient.put<any>(this.API_URL+'/UpdateAllotment' , advanceTable);
  }
  
}
  

