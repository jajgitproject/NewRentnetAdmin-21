// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { LocationDetails } from './locationDetails.model';

@Injectable()
export class LocationDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "allotmentLocation/";
  }

  GetAllotmentLocation(organizationalEntityID:number): Observable<LocationDetails[]> {
    return this.httpClient.get<LocationDetails[]>(this.API_URL + "GetAllotmentLocation/"+organizationalEntityID);
  }
 
}
