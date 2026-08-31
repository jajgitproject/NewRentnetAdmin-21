// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Driver } from './driver.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';
@Injectable()
export class DriverService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driver";
  }

  getPassword(referenceID:number,type:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetDriverPassword' + "/" + referenceID + "/" + type);
  }
  /** CRUD METHODS */
  getTableData(SearchdriverName:string,searchdriverFatherName:string,searchdriverGradeName:string,searchDriverOfficialIdentityNumber:string,searchSupplier:string,searchhighestQualification:string,searchMobile:string,searchLocation:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchdriverName==="")
    {
      SearchdriverName="null";
    }
    if(searchdriverFatherName==="")
    {
      searchdriverFatherName="null";
    }

    if(searchdriverGradeName==="")
    {
      searchdriverGradeName="null";
    }
    if(searchDriverOfficialIdentityNumber==="")
    {
      searchDriverOfficialIdentityNumber="null";
    }
     if(searchSupplier==="")
    {
      searchSupplier="null";
    }
    if(searchhighestQualification==="")
    {
      searchhighestQualification="null";
    }

    if(searchMobile==="")
    {
      searchMobile="null";
    }
    if(searchLocation==="")
    {
      searchLocation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+searchdriverFatherName + '/' +searchdriverGradeName + '/' +searchDriverOfficialIdentityNumber + '/' +searchSupplier + '/' +searchhighestQualification + '/' +searchMobile + '/' +searchLocation + '/' + SearchActivationStatus +'/' + PageNumber + '/driverName/Ascending');
  }
  getTableDataSort(SearchdriverName:string,searchdriverFatherName:string,searchdriverGradeName:string,searchDriverOfficialIdentityNumber:string,searchSupplier:string,searchhighestQualification:string,searchMobile:string,searchLocation:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchdriverName==="")
    {
      SearchdriverName="null";
    }
    if(searchdriverFatherName==="")
    {
      searchdriverFatherName="null";
    }
    if(searchdriverGradeName==="")
    {
      searchdriverGradeName="null";
    }
    if(searchDriverOfficialIdentityNumber==="")
    {
      searchDriverOfficialIdentityNumber="null";
    }
     if(searchSupplier==="")
    {
      searchSupplier="null";
    }
    if(searchhighestQualification==="")
    {
      searchhighestQualification="null";
    }
    if(searchMobile==="")
    {
      searchMobile="null";
    }
     if(searchLocation==="")
    {
      searchLocation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+ searchdriverFatherName +'/'+ searchdriverGradeName +'/'+ searchDriverOfficialIdentityNumber +'/'+ searchSupplier +'/'+ searchhighestQualification +'/'+ searchMobile +'/'+ searchLocation +'/'+ SearchActivationStatus +'/'+ PageNumber +  '/'+coloumName+'/'+sortType);
  }
  private toActivationStatusParam(value: boolean | null): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return String(value);
  }

  startExportJob(
    searchDriverName: string,
    searchDriverFatherName: string,
    searchDriverGradeName: string,
    searchDriverOfficialIdentityNumber: string,
    searchSupplier: string,
    searchHighestQualification: string,
    searchMobile: string,
    searchLocation: string,
    searchActivationStatus: boolean | null
  ): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/export/StartJob`, {
      userID: this.generalService.getUserID(),
      driverName: searchDriverName || null,
      driverFatherName: searchDriverFatherName || null,
      driverGradeName: searchDriverGradeName || null,
      driverOfficialIdentityNumber: searchDriverOfficialIdentityNumber || null,
      supplier: searchSupplier || null,
      highestQualification: searchHighestQualification || null,
      mobile: searchMobile || null,
      location: searchLocation || null,
      activationStatus: this.toActivationStatusParam(searchActivationStatus)
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

  add(advanceTable: Driver) 
  {
    advanceTable.driverID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.hubID=0;
    if(!advanceTable.hubID){
      advanceTable.hubID=0
    }

    advanceTable.dobString=this.generalService.getTimeApplicable(advanceTable.dob);
    advanceTable.dateOfJoiningString=this.generalService.getTimeApplicable(advanceTable.dateOfJoining);
    if(advanceTable.dateOfLeaving)
    {
      advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
    }
    else
    {
      advanceTable.dateOfLeaving=null;
    }
    advanceTable.drivingSinceDateString=this.generalService.getTimeApplicable(advanceTable.drivingSinceDate);
    if (advanceTable.driverBackGroundVerificationCheckIssueDate) {
      advanceTable.driverBackGroundVerificationCheckIssueDateString =
        this.generalService.getTimeApplicable(advanceTable.driverBackGroundVerificationCheckIssueDate);
    } else {
      advanceTable.driverBackGroundVerificationCheckIssueDate = null;
      advanceTable.driverBackGroundVerificationCheckIssueDateString = null;
    }
    if (advanceTable.driverFitnessCertificateIssueDate) {
      advanceTable.driverFitnessCertificateIssueDateString =
        this.generalService.getTimeApplicable(advanceTable.driverFitnessCertificateIssueDate);
    } else {
      advanceTable.driverFitnessCertificateIssueDate = null;
      advanceTable.driverFitnessCertificateIssueDateString = null;
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Driver)
  {
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.hubID=0;
    if(!advanceTable.hubID){
      advanceTable.hubID=0
    }

    advanceTable.dobString=this.generalService.getTimeApplicable(advanceTable.dob);
    advanceTable.dateOfJoiningString=this.generalService.getTimeApplicable(advanceTable.dateOfJoining);
    if(advanceTable.dateOfLeaving)
    {
      advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
    }
    else
    {
      advanceTable.dateOfLeaving=null;
    }
    advanceTable.drivingSinceDateString=this.generalService.getTimeApplicable(advanceTable.drivingSinceDate);
    if (advanceTable.driverBackGroundVerificationCheckIssueDate) {
      advanceTable.driverBackGroundVerificationCheckIssueDateString =
        this.generalService.getTimeApplicable(advanceTable.driverBackGroundVerificationCheckIssueDate);
    } else {
      advanceTable.driverBackGroundVerificationCheckIssueDate = null;
      advanceTable.driverBackGroundVerificationCheckIssueDateString = null;
    }
    if (advanceTable.driverFitnessCertificateIssueDate) {
      advanceTable.driverFitnessCertificateIssueDateString =
        this.generalService.getTimeApplicable(advanceTable.driverFitnessCertificateIssueDate);
    } else {
      advanceTable.driverFitnessCertificateIssueDate = null;
      advanceTable.driverFitnessCertificateIssueDateString = null;
    }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(driverID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ driverID + '/'+ userID);
  }

  clearIMEI(driverID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ "clearIMEI" + '/'+ driverID + '/'+ userID);
  }
}
