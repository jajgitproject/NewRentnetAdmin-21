// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BankBranch } from './bankBranch.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BankBranchService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "bankBranch";
  }
  /** CRUD METHODS */
  getTableData(SearchBankBranch:string,SearchBank:string,SearchBankBranchIFSCCode:string,SearchBankBranchSwiftCode:string,SearchBankBranchAddress:string,SearchCity:string,SearchIBAN:string,SearchRoutingCode:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchBankBranch==="")
    {
      SearchBankBranch="null";
    }
    if(SearchBank=="")
    {
      SearchBank="null";
    }
    if(SearchBankBranchIFSCCode==="")
    {
      SearchBankBranchIFSCCode="null";
    }
    if(SearchBankBranchAddress==="")
    {
      SearchBankBranchAddress="null";
    }
    if(SearchBankBranchSwiftCode==="")
    {
      SearchBankBranchSwiftCode="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchIBAN==="")
    {
      SearchIBAN="null";
    }
    if(SearchRoutingCode==="")
    {
      SearchRoutingCode="null";
    }
    
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBankBranch + '/' + SearchBank +'/' + SearchBankBranchIFSCCode +'/'+ SearchBankBranchSwiftCode +'/'+SearchBankBranchAddress+'/'+SearchCity+'/'+SearchIBAN+'/'+SearchRoutingCode +'/'  + SearchActivationStatus +'/'  + PageNumber + '/BankBranch/Ascending');
  }
  getTableDataSort(SearchBankBranch:string,SearchBank:string,SearchBankBranchIFSCCode:string,SearchBankBranchAddress:string,SearchBankBranchSwiftCode:string,SearchCity:string,SearchIBAN:string,SearchRoutingCode:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchBankBranch==="")
    {
      SearchBankBranch="null";
    }
    if(SearchBank==="")
    {
      SearchBank="null";
    }
    if(SearchBankBranchIFSCCode==="")
    {
      SearchBankBranchIFSCCode="null";
    }
    if(SearchBankBranchAddress==="")
    {
      SearchBankBranchAddress="null";
    }
    if(SearchBankBranchSwiftCode==="")
    {
      SearchBankBranchSwiftCode="null";
    }
    if(SearchCity==="")
      {
        SearchCity="null";
      }
      if(SearchIBAN==="")
      {
        SearchIBAN="null";
      }
      if(SearchRoutingCode==="")
      {
        SearchRoutingCode="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBankBranch + '/' +SearchBank + '/'+SearchBankBranchIFSCCode + '/'+SearchBankBranchAddress + '/'+SearchBankBranchSwiftCode+ '/'+SearchCity+ '/'+SearchIBAN+ '/'+SearchRoutingCode + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: BankBranch) 
  {
    advanceTable.bankBranchID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BankBranch)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(bankBranchID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ bankBranchID+ '/'+ userID);
  }

}
  

