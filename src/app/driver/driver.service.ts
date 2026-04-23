// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Driver } from './driver.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driver";
  }

  getPassword(referenceID:number,type:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetDriverPassword' + "/" + referenceID + "/" + type);
  }
  /** CRUD METHODS */
  getTableData(SearchdriverName:string,searchdriverFatherName:string,searchdriverGradeName:string,searchDriverOfficialIdentityNumber:string, searchhighestQualification:string,searchMobile:string,searchLocation:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchdriverName==="")
    {
      SearchdriverName="null";
    }
    if(searchdriverFatherName==="")
    {
      searchdriverFatherName="null";
    }

    if(searchdriverGradeName==="")
    {
      searchdriverGradeName="null";
    }
    if(searchDriverOfficialIdentityNumber==="")
    {
      searchDriverOfficialIdentityNumber="null";
    }
    if(searchhighestQualification==="")
    {
      searchhighestQualification="null";
    }

    if(searchMobile==="")
    {
      searchMobile="null";
    }
    if(searchLocation==="")
    {
      searchLocation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+searchdriverFatherName + '/' +searchdriverGradeName + '/' +searchDriverOfficialIdentityNumber + '/' +searchhighestQualification + '/' +searchMobile + '/' +searchLocation + '/' + SearchActivationStatus +'/' + PageNumber + '/driverName/Ascending');
  }
  getTableDataSort(SearchdriverName:string,searchdriverFatherName:string,searchdriverGradeName:string,searchDriverOfficialIdentityNumber:string,searchhighestQualification:string,searchMobile:string,searchLocation:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchdriverName==="")
    {
      SearchdriverName="null";
    }
    if(searchdriverFatherName==="")
    {
      searchdriverFatherName="null";
    }
    if(searchdriverGradeName==="")
    {
      searchdriverGradeName="null";
    }
    if(searchDriverOfficialIdentityNumber==="")
    {
      searchDriverOfficialIdentityNumber="null";
    }
    if(searchhighestQualification==="")
    {
      searchhighestQualification="null";
    }
    if(searchMobile==="")
    {
      searchMobile="null";
    }
     if(searchLocation==="")
    {
      searchLocation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+ searchdriverFatherName +'/'+ searchdriverGradeName +'/'+ searchDriverOfficialIdentityNumber +'/'+ searchhighestQualification +'/'+ searchMobile +'/'+ searchLocation +'/'+ SearchActivationStatus +'/'+ PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Driver) 
  {
    advanceTable.driverID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.hubID=0;
    if(!advanceTable.hubID){
      advanceTable.hubID=0
    }

    advanceTable.dobString=this.generalService.getTimeApplicable(advanceTable.dob);
    advanceTable.dateOfJoiningString=this.generalService.getTimeApplicable(advanceTable.dateOfJoining);
    if(advanceTable.dateOfLeaving)
    {
      advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
    }
    else
    {
      advanceTable.dateOfLeaving=null;
    }
    advanceTable.drivingSinceDateString=this.generalService.getTimeApplicable(advanceTable.drivingSinceDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Driver)
  {
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.hubID=0;
    if(!advanceTable.hubID){
      advanceTable.hubID=0
    }

    advanceTable.dobString=this.generalService.getTimeApplicable(advanceTable.dob);
    advanceTable.dateOfJoiningString=this.generalService.getTimeApplicable(advanceTable.dateOfJoining);
    if(advanceTable.dateOfLeaving)
    {
      advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
    }
    else
    {
      advanceTable.dateOfLeaving=null;
    }
    advanceTable.drivingSinceDateString=this.generalService.getTimeApplicable(advanceTable.drivingSinceDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(driverID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ driverID + '/'+ userID);
  }
}
