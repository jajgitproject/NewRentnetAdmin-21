// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarAndDriverAllotmentTemp} from './CarAndDriverAllotmentTemp.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable({
  providedIn: 'root'
})

export class CarAndDriverAllotmentTempService 
{
  private API_URL:string = '';
  private User_API_URL:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  Trip:string;
  constructor(private httpClient: HttpClient,public datepipe: DatePipe, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "CarAndDriverAllotmentTemp";
    this.User_API_URL=generalService.BaseURL+ "reservationBookerID";
  }
  /** CRUD METHODS */
  // getTableData(SearchTripDate:string,SearchStatus:string,SearchVehicle :string,SearchCity:string,SearchPackageTypeID:number,SearchPackage :string,SearchBooker:string,bUserID:number,
  //   SearchActivationStatus:string, PageNumber: number, 
  //   ):  Observable<any> 
  // {
  //   // if(SearchCarAndDriverAllotmentTemp==="")
  //   // {
  //   //   SearchCarAndDriverAllotmentTemp="null";
  //   // }
  //   this.Trip = this.datepipe.transform(SearchTripDate, 'yyyy-MM-dd')
  //   if (this.Trip === "") {
  //     this.Trip = "null";
  //   }
  //   if(SearchStatus==="")
  //   {
  //     SearchStatus="null";
  //   }
  //   if(SearchVehicle==="")
  //   {
  //     SearchVehicle="null";
  //   }
  //   if(SearchCity==="")
  //   {
  //     SearchCity="null";
  //   }
    
  //   if(SearchPackageTypeID=== 0)
  //   {
  //     SearchPackageTypeID= 0;
  //   }
  //   if(SearchPackage==="")
  //   {
  //     SearchPackage="null";
  //   }
  //   if(SearchBooker==="")
  //   {
  //     SearchBooker="null";
  //   }
  //   if(bUserID===0)
  //   {
  //     bUserID=0;
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //  
  //   return this.httpClient.get(this.API_URL + "/"  +this.Trip+'/'+SearchStatus+'/' + SearchVehicle +'/'  + SearchCity +'/' + SearchPackageTypeID +'/' + SearchPackage + '/' + SearchBooker + '/' + bUserID + '/'+ SearchActivationStatus +'/' + PageNumber + '/BookerName/Descending');
  // }

  // getTableDataSort(SearchTripDate:string,SearchStatus:string,SearchVehicle :string,SearchCity:string,SearchPackageTypeID:number,SearchPackage :string,SearchBooker:string,bUserID:number,
  //   SearchActivationStatus:string, PageNumber: number, columnName:any,sortType:string
  //   ):  Observable<any> 
  // {
  //   // if(SearchCarAndDriverAllotmentTemp==="")
  //   // {
  //   //   SearchCarAndDriverAllotmentTemp="null";
  //   // }
  //   this.Trip = this.datepipe.transform(SearchTripDate, 'yyyy-MM-dd')
  //   if (this.Trip === "") {
  //     this.Trip = "null";
  //   }
  //   if(SearchStatus==="")
  //   {
  //     SearchStatus="null";
  //   }
  //   if(SearchVehicle==="")
  //   {
  //     SearchVehicle="null";
  //   }
  //   if(SearchCity==="")
  //   {
  //     SearchCity="null";
  //   }
    
  //   if(SearchPackageTypeID=== 0)
  //   {
  //     SearchPackageTypeID= 0;
  //   }
  //   if(SearchPackage==="")
  //   {
  //     SearchPackage="null";
  //   }
  //   if(SearchBooker==="")
  //   {
  //     SearchBooker="null";
  //   }
  //   if(bUserID===0)
  //   {
  //     bUserID=0;
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   //console.log(this.API_URL + "/"  +SearchTripDate+'/'+SearchStatus+'/' + SearchVehicle +'/'  + SearchCity +'/' + SearchPackageTypeID +'/' + SearchPackage + '/' + SearchBooker + '/'+ SearchActivationStatus +'/' + PageNumber + '/BookerName/Descending');
  //   return this.httpClient.get(this.API_URL + "/"  +this.Trip+'/'+SearchStatus+'/' + SearchVehicle +'/'  + SearchCity +'/' + SearchPackageTypeID +'/' + SearchPackage + '/' + SearchBooker + '/' + bUserID + '/'+ SearchActivationStatus +'/' + PageNumber + '/' + columnName + '/'+sortType);
  // }
  // GetUserData(bookerUserID: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.User_API_URL + '/'+ bookerUserID);
  // }

  // add(advanceTable: CarAndDriverAllotmentTemp) 
  // {
  //   
  //   advanceTable.reservationBookerID=-1;    
  //   advanceTable.updatedBy=this.generalService.getUserID();
  //   advanceTable.updateDateTime= this.generalService.getTodaysDate();
  //  
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  // update(advanceTable: CarAndDriverAllotmentTemp)
  // {
  //   advanceTable.updatedBy=this.generalService.getUserID();
  //   advanceTable.updateDateTime= this.generalService.getTodaysDate();
  //   return this.httpClient.put<any>(this.API_URL , advanceTable);
  // }
  // delete(CarAndDriverAllotmentTempID: number):  Observable<any> 
  // {
  //   return this.httpClient.delete(this.API_URL + '/'+ CarAndDriverAllotmentTempID);
  // }
}
