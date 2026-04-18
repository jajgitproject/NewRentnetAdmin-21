// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchDriverByLocation } from './searchDriverByLocation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class SearchDriverByLocationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService, 
    private searchDriverByLocationService: NgbModal) 
  {
    this.API_URL=generalService.BaseURL+ "driverInventoryAssociation";
  }

  open(content: any) {
    this.searchDriverByLocationService.open(content);
  }

  /** CRUD METHODS */
  
  getTableData(driverID:number,searchDriverName:string, eTRAvailabilityDate:string, eTRAvailabilityTime:string, eTRAvailabilityGeoLocation:string, searchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(driverID===0)
    {
      driverID=0;
    }
    if(searchDriverName==="")
    {
      searchDriverName="null";
    }
    if(eTRAvailabilityDate==="")
    {
      eTRAvailabilityDate="null";
    }
    if(eTRAvailabilityTime==="")
    {
      eTRAvailabilityTime="null";
    }
    if(eTRAvailabilityGeoLocation==="")
    {
      eTRAvailabilityGeoLocation="null";
    }
    if(searchActivationStatus===null)
    {
      searchActivationStatus=null;
    }
    console.log(this.API_URL + '/SearchDriverByLocation' + "/"+driverID+ "/" +searchDriverName + "/" +eTRAvailabilityDate+ '/'+ eTRAvailabilityTime + '/' + eTRAvailabilityGeoLocation  + '/' + searchActivationStatus +'/' + PageNumber + '/driverInventoryAssociationID/Ascending');
    return this.httpClient.get(this.API_URL + '/SearchDriverByLocation' + "/"+driverID+ "/" +searchDriverName + "/" +eTRAvailabilityDate+ '/'+ eTRAvailabilityTime + '/' + eTRAvailabilityGeoLocation  + '/' + searchActivationStatus +'/' + PageNumber + '/driverInventoryAssociationID/Ascending');
  }
}
  

