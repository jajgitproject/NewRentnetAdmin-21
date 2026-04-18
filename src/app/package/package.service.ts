// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from './package.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PackageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "package";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/package/Ascending')
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/package/Ascending');
  }
  getTableDataSort(SearchName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Package) 
  {
    advanceTable.packageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.oldRentNetPackage==="")
    {
      advanceTable.oldRentNetPackage = null;
    }
    else
    {
      advanceTable.oldRentNetPackage = advanceTable.oldRentNetPackage;
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Package)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(packageID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ packageID + '/' + userID);
  }
}
