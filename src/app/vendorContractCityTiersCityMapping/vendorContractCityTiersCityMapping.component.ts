// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { VendorContractCityTiersCityMappingService } from './vendorContractCityTiersCityMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VendorContractCityTiersCityMappingModel } from './vendorContractCityTiersCityMapping.model';
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
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
@Component({
  standalone: false,
  selector: 'app-vendorContractCityTiersCityMapping',
  templateUrl: './vendorContractCityTiersCityMapping.component.html',
  styleUrls: ['./vendorContractCityTiersCityMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorContractCityTiersCityMappingComponent implements OnInit {
  displayedColumns = [
    'GeoPoint.GeoPointName',
    'status',
    'actions'
  ];
  dataSource: VendorContractCityTiersCityMappingModel[] | null;
  advanceTable: VendorContractCityTiersCityMappingModel | null;
  SearchName: string = '';
  SearchVendorContractCityTiersCityMappingID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  searchCity : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  VendorContractID!: any;
  VendorContractCityTier: any;
  //public CityList?: CitiesDropDown[] = [];
  vendorContractCityTiersID: any;
  vendorContractCityTier: any;
  vendorContractName:any;
  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  VendorContractCityTiersCityMappingID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public vendorContractCityTiersCityMappingService: VendorContractCityTiersCityMappingService,
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
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedVendorContractCityTiersID = paramsData.VendorContractCityTiersID;
      const encryptedVendorContractCityTier = paramsData.VendorContractCityTier;
      const encryptedVendorContractName = paramsData.VendorContractName;
      this.vendorContractCityTiersID = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractCityTiersID));
      this.vendorContractCityTier = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractCityTier));
      this.vendorContractName = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractName));
    });
    this.InitCities()
    this.loadData();
    this.SubscribeUpdateService();
  }

  refresh() 
  {
    this.searchCity.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }


  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
          vendorContractCityTiersID: this.vendorContractCityTiersID,
          vendorContractCityTier :this.vendorContractCityTier,
          vendorContractName :this.vendorContractName,
          
        }
    });
  }


  editCall(row)
  {
    this.VendorContractCityTiersCityMappingID = row.vendorContractCityTiersCityMappingID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        vendorContractCityTiersID: this.vendorContractCityTiersID,
        vendorContractCityTier :this.vendorContractCityTier,
        vendorContractName :this.vendorContractName,
      }
    });
  }


  deleteItem(row)
  {
    this.VendorContractCityTiersCityMappingID = row.id;
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
    debugger
    switch (this.selectedFilter)
    {
      case 'city':
        this.searchCity.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
    this.vendorContractCityTiersCityMappingService.getTableData(this.vendorContractCityTiersID,this.SearchVendorContractCityTiersCityMappingID,this.searchCity.value,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  SortingData(coloumName:any) 
  {
    if (this.sortingData == 1) 
    {
      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else 
    {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.vendorContractCityTiersCityMappingService.getTableDataSort(this.vendorContractCityTiersID,this.SearchVendorContractCityTiersCityMappingID,this.searchCity.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }


  showNotification(colorName, text, placementFrom, placementAlign) 
  {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }


  onContextMenu(event: MouseEvent, item: VendorContractCityTiersCityMappingModel) 
  {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  InitCities()
  {
    this._generalService.GetCitiessAll().subscribe(
    data=>
    {
      this.CityList=data;
      this.filteredCityOptions = this.searchCity.valueChanges.pipe(
        startWith(""),
        map(value => this._filterCity(value || ''))
      ); 
    });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CityList.filter(
      vendor =>
      {
        return vendor.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  NextCall()
  {
    if (this.dataSource.length>0) 
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
          if(this.MessageArray[0]=="VendorContractCityTiersCityMappingCreate")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersCityMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract City Tiers City Mapping Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCityTiersCityMappingUpdate")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersCityMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract City Tiers City Mapping Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCityTiersCityMappingDelete")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersCityMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract City Tiers City Mapping Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCityTiersCityMappingAll")
          {
            if(this.MessageArray[1]=="VendorContractCityTiersCityMappingView")
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



  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



