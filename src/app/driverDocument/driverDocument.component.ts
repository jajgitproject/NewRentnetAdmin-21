// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriverDocumentService } from './driverDocument.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DriverDocument } from './driverDocument.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { AllCitiesDropDown } from './allCitiesDropDown.model';
import { FormDialogVerificationsComponent } from '../driverDocumentVerification/dialogs/form-dialog-verifications/form-dialog-verifications.component';
@Component({
  standalone: false,
  selector: 'app-driverDocument',
  templateUrl: './driverDocument.component.html',
  styleUrls: ['./driverDocument.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverDocumentComponent implements OnInit {
  displayedColumns = [
    'driverName',
    'documentName',
    'supplierName',
    // 'documentNumber',
    'documentVerified',
    'status',
    'actions'
  ];
  dataSource: DriverDocument[] | null;
  driverDocumentID: number;
  advanceTable: DriverDocument | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  driverID: any;
  driverName: any;

  searchAddressCity: string = '';
  searchDocumentNumber: string = '';
  searchDocumentIssuingAuthority: string = '';
  searchAddress: string = '';
  addressCity : FormControl = new FormControl();
  documentNumber : FormControl = new FormControl();
  documentIssuingAuthority : FormControl = new FormControl();
  address : FormControl = new FormControl();

  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    //public route:ActivatedRoute,
    public router:Router,
    public route:ActivatedRoute,
    public driverDocumentService: DriverDocumentService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.driverID   = paramsData.DriverID;
      //  this.driverName=paramsData.DriverName;
      const encryptedDriverID = paramsData.DriverID;
      const encryptedDriverName = paramsData.DriverName;
    
    
      if (encryptedDriverID && encryptedDriverName) {
        try {
          const decryptedDriverID = this._generalService.decrypt(decodeURIComponent(encryptedDriverID));
          const decryptedDriverName = this._generalService.decrypt(decodeURIComponent(encryptedDriverName));
    
          if (decryptedDriverID && decryptedDriverName) {
            this.driverID = decryptedDriverID;
            this.driverName = decryptedDriverName;
          } else {
            console.error("Decryption failed: Invalid data received");
          }
        } catch (error) {
          console.error("Error decrypting values:", error);
        }
      }
    
    });
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCities();
    //this.InitIssuingCity();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredOptions = this.addressCity.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  // InitIssuingCity(){
  //   this._generalService.GetCitiessAll().subscribe(
  //     data=>
  //     {
  //       this.CitiesList=data;
  //       this.filteredCityOptions = this.issuingCity.valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filtering(value || ''))
  //       ); 
  //     });
  // }

  private _filtering(value: string): any {
    const filteringValue = value.toLowerCase();
    return this.CitiesList.filter(
      city => 
      {
        return city.geoPointName.toLowerCase().indexOf(filteringValue)===0;
      }
    );
  }

  refresh() {
    this.searchAddressCity = '';
    this.searchDocumentNumber = '';
    this.searchDocumentIssuingAuthority = '';
    this.searchAddress = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  driverDocumentVerification(row)
  { console.log(row)
    const dialogRef = this.dialog.open(FormDialogVerificationsComponent, 
    {
      data: 
        {
          advanceTable: row,
          DriverId:this.driverID,
          DriverName:this.driverName,
        }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          driverID: this.driverID,
          driverName :this.driverName,
        }
    });
  }
  editCall(row) {
     
    this.driverDocumentID = row.driverDocumentID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        driverID: this.driverID,
        driverName :this.driverName,
      }
    });

  }
  deleteItem(row)
  {

    this.driverDocumentID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false && item.verified!=='Verified'; // Only show delete button if activationStatus is not false (not deleted)
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'documentNumber':
        this.searchDocumentNumber = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.driverDocumentService.getTableData(this.driverID,this.searchAddressCity,this.searchDocumentNumber,this.searchDocumentIssuingAuthority,this.searchAddress,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        //   else{
        //     this.activeData="Deleted"
        //   }
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
  onContextMenu(event: MouseEvent, item: DriverDocument) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    
    if (this.dataSource.length>0) 
    {
     
      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
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
          if(this.MessageArray[0]=="DriverDocumentCreate")
          {
            if(this.MessageArray[1]=="DriverDocumentView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Driver Document Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverDocumentUpdate")
          {
            if(this.MessageArray[1]=="DriverDocumentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Document Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverDocumentDelete")
          {
            if(this.MessageArray[1]=="DriverDocumentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Document Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverDocumentAll")
          {
            if(this.MessageArray[1]=="DriverDocumentView")
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

  SortingData(coloumName:any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.driverDocumentService.getTableDataSort(this.driverID,this.searchAddressCity,this.searchDocumentNumber,this.searchDocumentIssuingAuthority,this.searchAddress,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



