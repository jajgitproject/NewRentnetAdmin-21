// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SpotInCityService } from './spotInCity.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SpotInCity } from './spotInCity.model';
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
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { SpotInCityDropDown } from './spotInCityDropDown.model';
import { SpotTypeDropDown } from './spotTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-spotInCity',
  templateUrl: './spotInCity.component.html',
  styleUrls: ['./spotInCity.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SpotInCityComponent implements OnInit {
   displayedColumns = [
    'geoPointName',
    'parent',
    'icon',
    'geoPointType',
    'geoSearchString',
    'actions'
  ];
  dataSource: SpotInCity[] | null;
  geoPointID: number;
  advanceTable: SpotInCity | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData:any;
  public SpotInCityList?: SpotInCityDropDown[] = [];
  filteredSpotInCityOptions: Observable<SpotInCityDropDown[]>;
  public SpotTypeList?: SpotTypeDropDown[] = [];
  filteredSpotTypeOptions: Observable<SpotTypeDropDown[]>;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchSpotType: string = '';
  spotType : FormControl = new FormControl();

  SearchParent: string = '';
  parent : FormControl = new FormControl();

  SearchGeoString: string = '';
  geoSearchString : FormControl = new FormControl();

  SearchAPIIntegration: string = '';
  APIIntegration : FormControl = new FormControl();
  
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  options: any = {
    componentRestrictions: { country: 'IN' }
  }

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public spotInCityService: SpotInCityService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.SubscribeUpdateService();
    this.InitSpotInCities();
    this.InitSpotCities();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  InitSpotInCities(){
    this._generalService.GetAllGeoPointData().subscribe(
      data=>
      {
        this.SpotInCityList=data;
        this.filteredSpotInCityOptions = this.parent.valueChanges.pipe(
          startWith(""),
          map(value => this._filterSpotInCity(value || ''))
        ); 
      });
  }
  private _filterSpotInCity(value: string): any {

  // 👉 3 characters se kam likhne par list empty
  if (!value || value.length < 3) {
    return [];
  }

  const filterValue = value.toLowerCase();

  return this.SpotInCityList.filter(customer => {
    return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
  });

}

  
  // private _filterSpotInCity(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.SpotInCityList.filter(
  //     customer => 
  //     {
  //       return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
   
   InitSpotCities(){
    this._generalService.GetSpotCity().subscribe(
      data=>
      {
        this.SpotTypeList=data;
        this.filteredSpotTypeOptions = this.spotType.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // 3 characters se kam ho toh empty list return karo
  if (filterValue.length < 3) {
    return [];
  }

  return this.SpotTypeList.filter(customer =>
    customer.geoPointType.toLowerCase().indexOf(filterValue) === 0
  );
}

  
  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.SpotTypeList.filter(
  //     customer => 
  //     {
  //       return customer.geoPointType.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  
  refresh() {
    this.SearchName = '';
    this.spotType.setValue(''),
    this.parent.setValue(''),
    this.geoSearchString.setValue(''),
    this.SearchAPIIntegration= '',
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
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
          action: 'add'
        }
    });
  }
  editCall(row) {
     
    //console.log(row)
      //  alert(row.id);
    this.geoPointID = row.geoPointID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: 
      {
        advanceTable: row,
        action: 'edit'        
      }
    });
    
  }
  deleteItem(row)
  {

    this.geoPointID = row.id;
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
    switch (this.selectedFilter)
    {
      case 'spotInCity':
        this.SearchName = this.searchTerm;
        break;
      case 'spotType':
        this.spotType.setValue(this.searchTerm);
        break;
        case 'parent':
        this.parent.setValue(this.searchTerm);
        break;
        case 'geoSearchString':
          this.geoSearchString.setValue(this.searchTerm);
          break;
          case 'SearchAPIIntegration':
            this.SearchAPIIntegration = this.searchTerm;
            break;
      default:
        this.searchTerm = '';
        break;
    }
      this.spotInCityService.getTableData(this.SearchName,
        this.spotType.value,
        this.parent.value,
        this.geoSearchString.value,
        this.SearchAPIIntegration,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {
         
        this.dataSource = data;
        //console.log(this.dataSource)
    
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
  onContextMenu(event: MouseEvent, item: SpotInCity) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    //console.log(this.dataSource.length>0)
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
          if(this.MessageArray[0]=="SpotInCityCreate")
          {
            if(this.MessageArray[1]=="SpotInCityView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Spot In City Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SpotInCityUpdate")
          {
            if(this.MessageArray[1]=="SpotInCityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Spot In City Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SpotInCityDelete")
          {
            if(this.MessageArray[1]=="SpotInCityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Spot In City Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SpotInCityAll")
          {
            if(this.MessageArray[1]=="SpotInCityView")
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
     ;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.spotInCityService.getTableDataSort(this.SearchName,
      this.SearchSpotType,
      this.SearchParent,
      this.SearchGeoString,
      this.SearchAPIIntegration,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       //console.log(this.dataSource);
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



