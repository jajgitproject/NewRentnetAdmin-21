// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerKAMCity } from './customerKAMCity.model';
@Injectable()
export class CustomerKAMCityService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "CustomerKAMCity";
  }
  /** CRUD METHODS */
  getTableData( CustomerKeyAccountManagerID:number,City:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(City==="")
    {
      City="null";
    }
     return this.httpClient.get(this.API_URL + '/'+CustomerKeyAccountManagerID +'/'+City + '/' + SearchActivationStatus +'/' + PageNumber + '/customerKeyAccountManagerID/Ascending');
  }

  getTableDataSort(CustomerKeyAccountManagerID:number,City:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(City==="")
      {
        City="null";
      }
    
    return this.httpClient.get(this.API_URL + '/'+CustomerKeyAccountManagerID +'/'+City  + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerKAMCity) 
  {
    advanceTable.customerKAMCityID=-1;
    advanceTable.userID=this.generalService.getUserID();

    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerKAMCity)
  {
    advanceTable.userID=this.generalService.getUserID();

    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerKAMCityID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerKAMCityID+ '/'+ userID);
  }

}
  

