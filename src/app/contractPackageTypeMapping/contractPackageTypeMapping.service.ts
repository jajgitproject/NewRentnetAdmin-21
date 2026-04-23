// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ContractPackageTypeMapping } from './contractPackageTypeMapping.model';


@Injectable()
export class ContractPackageTypeMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "contractPackageTypeMapping";
  }
  /** CRUD METHODS */
  getTableData(contractID:number,packageType:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(contractID===0)
      {
        contractID=0;
      }
    if(packageType==="")
    {
      packageType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + contractID + '/' +packageType + '/' + SearchActivationStatus +'/' + PageNumber + '/ContractPackageTypeMappingID/Ascending');
  }
  getTableDataSort(contractID:number,packageType:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(contractID===0)
      {
        contractID=0;
      }
    if(packageType==="")
    {
      packageType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(this.API_URL + "/" + contractID + '/' +packageType + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ContractPackageTypeMapping) 
  {
    advanceTable.contractPackageTypeMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ContractPackageTypeMapping)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(contractPackageTypeMappingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ contractPackageTypeMappingID + '/'+ userID);
  }

}
  

