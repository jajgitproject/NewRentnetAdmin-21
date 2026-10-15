// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FeedBackAttachment } from './feedBackAttachment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FeedBackAttachmentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "feedBackAttachment";
  }
  /** CRUD METHODS */
  getTableData(tripFeedBack_ID:number,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    if(tripFeedBack_ID===0)
    {
      tripFeedBack_ID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +tripFeedBack_ID + '/' + SearchActivationStatus +'/' + PageNumber + '/tripFeedBackAttachmentID/Ascending');
  }
  getTableDataSort(SearchRate:string,Service_ID:number, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchRate==="")
    {
      SearchRate="null";
    }
    if(Service_ID===0)
    {
      Service_ID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchRate + '/'+Service_ID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  private buildFormData(advanceTable: FeedBackAttachment, file?: File | null): FormData {
    const formData = new FormData();
    const attachmentId = advanceTable.tripFeedBackAttachmentID ?? -1;
    formData.append('tripFeedBackAttachmentID', String(attachmentId));
    formData.append('tripFeedBackID', String(advanceTable.tripFeedBackID ?? ''));
    if (advanceTable.activationStatus !== undefined && advanceTable.activationStatus !== null && advanceTable.activationStatus !== '') {
      formData.append('activationStatus', String(advanceTable.activationStatus));
    }
    if (!file && advanceTable.tripFeedBackAttachment) {
      formData.append('tripFeedBackAttachment', String(advanceTable.tripFeedBackAttachment));
    }
    if (file) {
      formData.append('file', file, file.name);
      formData.append('File', file, file.name);
    }
    return formData;
  }

  private logFormDataPayload(action: string, advanceTable: FeedBackAttachment, file?: File | null): void {
    console.log(`[FeedBackAttachmentService] ${action} multipart payload`, {
      tripFeedBackAttachmentID: advanceTable.tripFeedBackAttachmentID,
      tripFeedBackID: advanceTable.tripFeedBackID,
      activationStatus: advanceTable.activationStatus,
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      hasExistingPath: !!advanceTable.tripFeedBackAttachment,
    });
  }

  add(advanceTable: FeedBackAttachment, file?: File | null) 
  {
    advanceTable.tripFeedBackAttachmentID=-1;
    const formData = this.buildFormData(advanceTable, file);
    this.logFormDataPayload('POST', advanceTable, file);
    return this.httpClient.post<any>(this.API_URL, formData);
  }
  update(advanceTable: FeedBackAttachment, file?: File | null)
  {
    const formData = this.buildFormData(advanceTable, file);
    this.logFormDataPayload('PUT', advanceTable, file);
    return this.httpClient.put<any>(this.API_URL, formData);
  }
  delete(tripFeedBackAttachmentID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ tripFeedBackAttachmentID);
  }
}
