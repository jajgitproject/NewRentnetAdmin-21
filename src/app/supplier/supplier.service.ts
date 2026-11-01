// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Supplier } from './supplier.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';
@Injectable()
export class SupplierService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplier";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, 
    SearchCity:string,
    SearchAddress:string,
    SearchPin:string,
    SearchPhone:string,
    SearchFax:string,
    SearchEmail:string,
    SearchSupplierStatus:string,
    SearchSupplierVerificationStatus:string,
    SearchSupplierRegistrationDate:string,
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchAddress==="")
    {
      SearchAddress="null";
    }
    if(SearchPin==="")
    {
      SearchPin="null";
    }
    if(SearchPhone==="")
    {
      SearchPhone="null";
    }
    if(SearchFax==="")
    {
      SearchFax="null";
    }
    if(SearchEmail==="")
      {
        SearchEmail="null";
      }
      if(SearchSupplierStatus==="")
        {
          SearchSupplierStatus="null";
        }
        if(SearchSupplierVerificationStatus==="")
          {
            SearchSupplierVerificationStatus="null";
          }
          if(SearchSupplierRegistrationDate==="")
            {
              SearchSupplierRegistrationDate="null";
            }
    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchCity+ "/" +SearchAddress+ "/" +SearchPin+ "/" +SearchPhone+ "/" +SearchFax +'/'+SearchEmail +'/'+SearchSupplierStatus +'/'+SearchSupplierVerificationStatus +'/'+SearchSupplierRegistrationDate +'/'+ PageNumber + '/supplierName/Ascending');
  }
  getTableDataSort(SearchName:string,
    SearchCity:string,
    SearchAddress:string,
    SearchPin:string,
    SearchPhone:string,
    SearchFax:string,
    SearchEmail:string,
    SearchSupplierStatus:string,
    SearchSupplierVerificationStatus:string,
    SearchSupplierRegistrationDate:string,
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchAddress==="")
    {
      SearchAddress="null";
    }
    if(SearchPin==="")
    {
      SearchPin="null";
    }
    if(SearchPhone==="")
    {
      SearchPhone="null";
    }
    if(SearchFax==="")
    {
      SearchFax="null";
    }
    if(SearchEmail==="")
      {
        SearchEmail="null";
      }
      if(SearchSupplierStatus==="")
        {
          SearchSupplierStatus="null";
        }
        if(SearchSupplierVerificationStatus==="")
          {
            SearchSupplierVerificationStatus="null";
          }
          if(SearchSupplierRegistrationDate==="")
            {
              SearchSupplierRegistrationDate="null";
            }

    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchCity+ "/" +SearchAddress+ "/" +SearchPin+ "/" +SearchPhone+ "/" +SearchFax +'/'+SearchEmail +'/'+SearchSupplierStatus +'/'+SearchSupplierVerificationStatus +'/'+SearchSupplierRegistrationDate +'/'+ PageNumber +  '/'+coloumName+'/'+sortType);
  }
  startExportJob(
    searchName: string,
    searchCity: string,
    searchAddress: string,
    searchPin: string,
    searchPhone: string,
    searchFax: string,
    searchEmail: string,
    searchSupplierStatus: string,
    searchSupplierVerificationStatus: string,
    searchSupplierRegistrationDate: string
  ): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/export/StartJob`, {
      userID: this.generalService.getUserID(),
      supplierName: searchName || null,
      city: searchCity || null,
      address: searchAddress || null,
      pin: searchPin || null,
      phone: searchPhone || null,
      fax: searchFax || null,
      email: searchEmail || null,
      supplierStatus: searchSupplierStatus || null,
      supplierVerificationStatus: searchSupplierVerificationStatus || null,
      supplierRegistrationDate: searchSupplierRegistrationDate || null
    });
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/export/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/export/Download/${jobId}`, {
      responseType: 'blob'
    });
  }

  cancelExportJob(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/export/Cancel/${jobId}`, {}, {
      params: { userId: String(this.generalService.getUserID() || 0) }
    });
  }

  pollExportJob(jobId: string): Observable<any> {
    return pollExportJob(this.httpClient, `${this.API_URL}/export/JobStatus/${jobId}`);
  }

  isExportJobRunning(status: any): boolean {
    return isExportJobRunning(status);
  }

  isExportJobReady(status: any): boolean {
    return isExportJobReady(status);
  }

  add(advanceTable: Supplier) 
  {
    advanceTable.supplierID=-1;
    advanceTable.userID=this.generalService.getUserID();
    if(!advanceTable.supplierOfficialIdentityNumber)
    {
    advanceTable.supplierOfficialIdentityNumber = "null";
    }    
    advanceTable.supplierCreatedByEmployeeID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
    
  }
  update(advanceTable: Supplier)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.supplierCreatedByEmployeeID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ supplierID);
  }
}
