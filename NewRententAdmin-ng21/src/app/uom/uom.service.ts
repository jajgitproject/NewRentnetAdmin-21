// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Uom } from './uom.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class UomService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "uom";
  }
  /** CRUD METHODS */
  getTableData(SearchUom:string, SearchUomCode:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    if(SearchUom==="")
    {
      SearchUom="null";
    }
    if(SearchUomCode==="")
    {
      SearchUomCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
   // console.log(this.API_URL + "/" +SearchUom + '/' + SearchActivationStatus +'/' + PageNumber + '/uom/Ascending')
    return this.httpClient.get(this.API_URL + "/" +SearchUom + '/'+SearchUomCode + '/' + SearchActivationStatus +'/' + PageNumber + '/uom/Ascending');
  }

  getTableDataSort(SearchUom:string, SearchUomCode:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
     
    if(SearchUom==="")
    {
      SearchUom="null";
    }
    if(SearchUomCode==="")
    {
      SearchUomCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/kkk" +SearchUom + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchUom + '/'+SearchUomCode + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: Uom) 
  {
    advanceTable.uomid=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Uom)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(uomid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ uomid + '/'+ userID);
  }
}
