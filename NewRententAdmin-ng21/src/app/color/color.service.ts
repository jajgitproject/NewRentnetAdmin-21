// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from './color.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ColorService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "color";
  }
  /** CRUD METHODS */
  getTableData(SearchColor:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchColor==="")
    {
      SearchColor="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchColor + '/' + SearchActivationStatus +'/' + PageNumber + '/Color/Ascending');
  }
  getTableDataSort(SearchColor:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchColor==="")
    {
      SearchColor="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    console.log(this.API_URL + "/" +SearchColor + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchColor + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: Color) 
  {
    advanceTable.colorID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Color)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(colorID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ colorID  + '/'+ userID);
  }

}
  

