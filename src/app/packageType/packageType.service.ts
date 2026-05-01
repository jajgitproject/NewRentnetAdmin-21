// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PackageType } from './packageType.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PackageTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "packageType";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, ServiceType:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(ServiceType==="")
    {
      ServiceType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+ServiceType + '/' + SearchActivationStatus +'/' + PageNumber + '/packageType/Ascending');
  }
  getTableDataSort(SearchName:string, ServiceType:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(ServiceType==="")
    {
      ServiceType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+ServiceType + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: PackageType) 
  {
    advanceTable.packageTypeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.oldRentNetDuty_Type==="")
    {
      advanceTable.oldRentNetDuty_Type = null;
    } 
    else
    {
      advanceTable.oldRentNetDuty_Type = advanceTable.oldRentNetDuty_Type;
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: PackageType)
  {
    
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(packageTypeID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ packageTypeID+ '/'+ userID);
  }
}
