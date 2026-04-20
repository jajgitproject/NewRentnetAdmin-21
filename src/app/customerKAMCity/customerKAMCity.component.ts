// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { CustomerKAMCityService } from './customerKAMCity.service';
import { CustomerKAMCity } from './customerKAMCity.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
@Component({
  standalone: false,
  selector: 'app-customerKAMCity',
  templateUrl: './customerKAMCity.component.html',
  styleUrls: ['./customerKAMCity.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerKAMCityComponent implements OnInit {
  displayedColumns = [
    'GeoPointName',
    'status',
    'actions'
  ];
  dataSource: CustomerKAMCity[] | null;
  customerKAMCityID: number;
  advanceTable: CustomerKAMCity | null;
  SearchCustomerKAMCity: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  city: string = '';
  searchcity : FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;
  customerKeyAccountManagerID: any;
  public CityList?: CitiesDropDown[] = [];
  employeeName: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerKAMCityService: CustomerKAMCityService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public router:Router,
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
      this.customerKeyAccountManagerID   = paramsData.customerKeyAccountManagerID;
      this.employeeName = paramsData.employeeName;
    });
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCities();
  }
  refresh() {
    this.searchcity.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
   data =>
   {
     this.CityList = data;  
     this.filteredCityOptions =  this.searchcity.valueChanges.pipe(
       startWith(""),
       map(value => this._filterCity(value || ''))
     );                  
   },
   error=>
   {

   }
    )
  }
private _filterCity(value: string): any {
 const filterValue = value.toLowerCase();
 return this.CityList.filter(
   customer =>
   {
     return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
   }
 );
}

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerKeyAccountManagerID:this.customerKeyAccountManagerID
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.customerKAMCityID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      customerKeyAccountManagerID:this.customerKeyAccountManagerID
    }
  });

}
deleteItem(row)
{
  this.customerKAMCityID = row.id;
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
   public loadData() 
   {
      this.customerKAMCityService.getTableData(this.customerKeyAccountManagerID,this.searchcity.value,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
         
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
  onContextMenu(event: MouseEvent, item: CustomerKAMCity) {
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
      this.loadData(); 
    } 
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchBank='';
    
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
          if(this.MessageArray[0]=="CustomerKAMCityCreate")
          {
            if(this.MessageArray[1]=="CustomerKAMCityView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer KAM City Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerKAMCityUpdate")
          {
            if(this.MessageArray[1]=="CustomerKAMCityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer KAM City Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerKAMCityDelete")
          {
            if(this.MessageArray[1]=="CustomerKAMCityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer KAM City Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerKAMCityAll")
          {
            if(this.MessageArray[1]=="CustomerKAMCityView")
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
    this.customerKAMCityService.getTableDataSort(this.customerKeyAccountManagerID,this.city,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



