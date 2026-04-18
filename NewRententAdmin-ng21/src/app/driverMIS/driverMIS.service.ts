// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverMISService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverMIS";
  }

  /** CRUD METHODS */
  getTableData(SearchdriverName:string,searchlocation:string,searchdateofjoiningfrom:string,searchdateofjoiningto:string,searchSupplierType:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchdriverName==="")
    {
      SearchdriverName="null";
    }
    if(searchlocation==="")
    {
      searchlocation="null";
    }

    if(searchdateofjoiningfrom==="")
    {
      searchdateofjoiningfrom="null";
    }
    if(searchdateofjoiningto==="")
      {
        searchdateofjoiningto="null";
      }
    if(searchSupplierType==="")
    {
      searchSupplierType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    console.log(this.API_URL + "/" +SearchdriverName + '/'+searchlocation + '/' +searchdateofjoiningfrom + '/' +searchSupplierType + '/' + SearchActivationStatus +'/' + PageNumber + '/driverID/Dscending')
    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+searchlocation + '/' +searchdateofjoiningfrom + '/'+searchdateofjoiningto + '/' +searchSupplierType + '/' + SearchActivationStatus +'/' + PageNumber + '/driverID/Dscending');
  }
  getTableDataSort(SearchdriverName:string,searchlocation:string,searchdateofjoiningfrom:string, searchdateofjoiningto:string,searchSupplierType:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchdriverName==="")
    {
      SearchdriverName="null";
    }
    if(searchlocation==="")
    {
      searchlocation="null";
    }
    if(searchdateofjoiningfrom==="")
    {
      searchdateofjoiningfrom="null";
    }
    if(searchdateofjoiningto==="")
      {
        searchdateofjoiningto="null";
      }
    if(searchSupplierType==="")
    {
      searchSupplierType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+ searchlocation +'/'+ searchdateofjoiningfrom +'/' +searchdateofjoiningto + '/'+ searchSupplierType +'/'+ SearchActivationStatus +'/'+ PageNumber +  '/'+coloumName+'/'+sortType);
  }
  
}
