// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdditionalServiceService } from './additionalService.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdditionalService } from './additionalService.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../additionalService/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceTypeDropDown } from '../general/serviceTypeDropDown.model';
import { UomDropDown } from './uomDropDown.model';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
@Component({
  standalone: false,
  selector: 'app-additionalService',
  templateUrl: './additionalService.component.html',
  styleUrls: ['./additionalService.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AdditionalServiceComponent implements OnInit {
  displayedColumns = [
    'additionalService',
    'serviceType',
    'uom',
    'activationStatus',
    'actions'
  ];
  public UOMList?: UomDropDown[] = [];
  searchUomTerm : FormControl = new FormControl();
  filteredUomOptions: Observable<UomDropDown[]>;
  
  public ServiceTypeList?: ServiceTypeDropDown[] = [];
  filteredOptions: Observable<ServiceTypeDropDown[]>;
  searchTypeTerm : FormControl = new FormControl();
  dataSource: AdditionalService[] | null;
  additionalServiceID: number;
  advanceTable: AdditionalService | null;
  SearchAdditionalService: string = '';
  SearchServiceType: string = '';
  SearchUom: string = '';
  // SearchServiceTypeID: number = 0;
  // SearchUomID: number = 0;
  SearchActivationStatus :boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  activation: string;
  search : FormControl = new FormControl();
  serviceType : FormControl = new FormControl();
  uom : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public additionalServiceService: AdditionalServiceService,
    private snackBar: MatSnackBar,
    private router:Router,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.InitServiceTypes();
    this.InitGetUOMAll();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.selectedFilter='search';
    this.searchTerm='';
    this.SearchAdditionalService = '';
    this.uom.setValue('') ;
   this.serviceType.setValue('') ;
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.additionalServiceID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.additionalServiceID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'AdditionalService':
        this.SearchAdditionalService = this.searchTerm;
        break;
      case 'ServiceType':
        this.serviceType.setValue(this.searchTerm);
        break;
      case 'Uom':
        this.uom.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.additionalServiceService.getTableData(this.SearchAdditionalService,this.serviceType.value,this.uom.value,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
          
          // this.dataSource.forEach((ele)=>{
          //   if(ele.activationStatus===true){
          //    this.activation="Active"
          //   }
          //   if(ele.activationStatus===false){
          //     this.activation="Deleted"
          //    }
          // })
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: AdditionalService) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource?.length>0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchAdditionalService='';
    
  }

  // additionalServiceRate(row) {
   
  //   this.additionalServiceID = row.additionalServiceID;
  //   //alert(row.vendorID);
  //   this.router.navigate([
  //     '/additionalServiceRate',       
     
  //   ],{
  //     queryParams: {
  //       additionalServiceRateID: this.additionalServiceID,
  //       uomid:row.uomid,
  //       // serviceTypeid:row.serviceid,

  //     }
  //   });
  // }

  additionalServiceRate(row) {
    // Encrypt both additionalServiceID and uomid before passing them to the query parameters
    const encryptedAdditionalServiceID = this._generalService.encrypt(encodeURIComponent(row.additionalServiceID));
    const encryptedUOMID = this._generalService.encrypt(encodeURIComponent(row.uomid));
  
    this.router.navigate([
      '/additionalServiceRate',
    ], {
      queryParams: {
        additionalServiceRateID: encryptedAdditionalServiceID,
        uomid: encryptedUOMID,
        // serviceTypeid: row.serviceid, // Uncomment if needed
      }
    });
  }
  
  InitServiceTypes() {
    //
     this._generalService.GetServiceType().subscribe(
       data =>
       {
         this.ServiceTypeList = data;
         this.filteredOptions = this.serviceType.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
       },
       error =>
       {
        
       }
     );
  }

   private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.ServiceTypeList?.filter(
      customer => 
      {
        return customer.serviceType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitGetUOMAll()
  {
    this._generalService.GetUOM().subscribe(
      data =>
       {
        this.UOMList = data;  
        this.filteredUomOptions = this.uom.valueChanges.pipe(
          startWith(""),
          map(value => this._filterUom(value || ''))
        );     
       },
       error =>
       {
       }
    );
  }

   private _filterUom(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.UOMList?.filter(
      customer => 
      {
        return customer.uom.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }
/////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="AdditionalServiceCreate")
          {
            if(this.MessageArray[1]=="AdditionalServiceView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Additional Service Created ...!!!!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalServiceUpdate")
          {
            if(this.MessageArray[1]=="AdditionalServiceView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Additional Service Updated ...!!!!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalServiceDelete")
          {
            if(this.MessageArray[1]=="AdditionalServiceView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Additional Service Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="AdditionalServiceAll")
          {
            if(this.MessageArray[1]=="AdditionalServiceView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.refresh();
               this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               this.refresh();
               this.showNotification(
                'snackbar-danger',
                'Duplicate Value Found.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
        }
      }
    );
  }

  // InitServiceTypes() {
  //   //
  //    this._generalService.GetServiceType().subscribe(
  //      data =>
  //      {
  //        this.ServiceTypeList = data;
  //        
  //      },
  //      error =>
  //      {
        
  //      }
  //    );
  // }

  // InitGetUOMAll()
  // {
  //   this._generalService.GetUOM().subscribe(
  //     data =>
  //      {
  //       this.UOMList = data;      
  //      },
  //      error =>
  //      {
  //      }
  //   );
  // }

  SortingData(coloumName:any) {
   
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.additionalServiceService.getTableDataSort(this.SearchAdditionalService,this.SearchServiceType,this.SearchUom,this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



