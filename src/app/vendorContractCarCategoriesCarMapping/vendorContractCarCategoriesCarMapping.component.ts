// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VendorContractCarCategoriesCarMappingService } from './vendorContractCarCategoriesCarMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VendorContractCarCategoriesCarMappingModel } from './vendorContractCarCategoriesCarMapping.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
@Component({
  standalone: false,
  selector: 'app-vendorContractCarCategoriesCarMapping',
  templateUrl: './vendorContractCarCategoriesCarMapping.component.html',
  styleUrls: ['./vendorContractCarCategoriesCarMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorContractCarCategoriesCarMappingComponent implements OnInit {
  displayedColumns = [
    'vehicle',
    'vendorVehicleName',
    'vendorVehicleCodeForIntegration',
    'status',
    'actions'
  ];
  dataSource: VendorContractCarCategoriesCarMappingModel[] | null;
  vendorContractCarCategoriesCarMappingID: number;
  advanceTable: VendorContractCarCategoriesCarMappingModel | null;
  searchVehicle: string = '';
  searchVendorVehicleName: string = '';
  searchVendorVehicleCodeForIntegration: string = '';
  searchVendorContractCarCategoriesCarMappingID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  vehicle : FormControl = new FormControl();
  vendorVehicleName : FormControl = new FormControl();
  vendorVehicleCodeForIntegration: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  VendorContractID!: any;
  VendorContractCityTier: any;
  public CityList?: CitiesDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  vendorContractCarCategoryID: any;
  vendorContractCarCategory: any;
  vendorContractName:any;
  vendorContractID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public vendorContractCarCategoriesCarMappingService: VendorContractCarCategoriesCarMappingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedVendorContractCarCategoryID = paramsData.VendorContractCarCategoryID;
      const encryptedVendorContractID = paramsData.VendorContractID;
      const encryptedVendorContractCarCategory = paramsData.VendorContractCarCategory;
      const encryptedVendorContractName = paramsData.VendorContractName;
  
    // Decrypt the parameters if they exist
    this.vendorContractID = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractID));
    this.vendorContractName = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractName));
    this.vendorContractCarCategoryID = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractCarCategoryID));
    this.vendorContractCarCategory = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractCarCategory));
    
    
    // Log the decrypted values to the console for verification
    });

    this.InitCities();
    this.initVehicle();
    this.loadData();
    this.SubscribeUpdateService();
  }


  refresh() 
  {
    this.searchVehicle = '';
    this.searchVendorVehicleName = '';
    this.searchVendorVehicleCodeForIntegration = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.selectedFilter = 'search';
    this.loadData();
  }

  InitCities()
  {
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
      }
    );
  }


  initVehicle()
  {
    this._generalService.GetVehicle().subscribe
    (
      data =>   
      {
        this.VehicleList = data;
      }
    );
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
          vendorContractCarCategoryID: this.vendorContractCarCategoryID,
          vendorContractCarCategory :this.vendorContractCarCategory,
          vendorContractName :this.vendorContractName,
          vendorContractID: this.vendorContractID,
        }
    });
  }


  editCall(row) 
  {
    this.vendorContractCarCategoriesCarMappingID = row.vendorContractCarCategoriesCarMappingID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        vendorContractCarCategoryID: this.vendorContractCarCategoryID,
        vendorContractCarCategory :this.vendorContractCarCategory,
        vendorContractName :this.vendorContractName,
        vendorContractID: this.vendorContractID,
      }
    });
  }


  deleteItem(row)
  {
    this.vendorContractCarCategoriesCarMappingID = row.id;
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
      case 'Vehicle':
        this.searchVehicle = this.searchTerm;
        break;
      case 'VendorVehicleName':
        this.searchVendorVehicleName = this.searchTerm;
        break;
      case 'VehicleCodeForIntegration':
        this.searchVendorVehicleCodeForIntegration = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.vendorContractCarCategoriesCarMappingService.getTableData( this.vendorContractID,this.vendorContractCarCategoryID,this.searchVendorContractCarCategoriesCarMappingID,this.searchVehicle,this.searchVendorVehicleName,this.searchVendorVehicleCodeForIntegration,this.SearchActivationStatus, this.PageNumber).subscribe
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


  onContextMenu(event: MouseEvent, item: VendorContractCarCategoriesCarMappingModel) 
  {
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
          if(this.MessageArray[0]=="VendorContractCarCategoriesCarMappingCreate")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoriesCarMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract Car Categories Car Mapping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCarCategoriesCarMappingUpdate")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoriesCarMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Car Categories Car Mapping  Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCarCategoriesCarMappingDelete")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoriesCarMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Car Categories Car Mapping  Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractCarCategoriesCarMappingAll")
          {
            if(this.MessageArray[1]=="VendorContractCarCategoriesCarMappingView")
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
    this.vendorContractCarCategoriesCarMappingService.getTableDataSort( this.vendorContractID,this.vendorContractCarCategoryID,this.searchVendorContractCarCategoriesCarMappingID,this.searchVehicle,this.searchVendorVehicleName,this.searchVendorVehicleCodeForIntegration,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



