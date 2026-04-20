// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrganizationalEntityService } from './organizationalEntity.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrganizationalEntity } from './organizationalEntity.model';
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
import { OrganizationalEntityDropDown } from './organizationalEntityDropDown.model';
import { CitiesDropDown } from './citiesDropDown.model';
import { FormDialogLutComponent } from '../lut/dialogs/form-dialog/form-dialog.component';
import { LutService } from '../lut/lut.service';
import { ActivatedRoute, Router } from '@angular/router';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-organizationalEntity',
  templateUrl: './organizationalEntity.component.html',
  styleUrls: ['./organizationalEntity.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class OrganizationalEntityComponent implements OnInit {
  displayedColumns = [
    'organizationalEntityName',
    'organizationalEntityType',
    'parent',
    'geoPointName',
    'organizationalEntityOwnership',
    'operationalStatus',
    'status',
    'actions'
  ];
  dataSource: OrganizationalEntity[] | null;
  organizationalEntityID: number;
  advanceTable: OrganizationalEntity | null;
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  operationalData: string;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchParent: string = '';
  parent : FormControl = new FormControl();

  SearchCity: string = '';
  city : FormControl = new FormControl();

  SearchOrganizationalType: string = '';
  organizationalType : FormControl = new FormControl();

  SearchOperationalStatus: any = '';
  operationalStatus : FormControl = new FormControl();

  SearchOwner: any = '';
  organizationalEntityOwnership : FormControl = new FormControl();

  menuItems: any[] = [
    { label: 'Lut',  },
   
  ];
  organizationalEntityName: any;
  searchTerm: any = '';
  searchOperationalStatus: any;
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public organizationalEntityService: OrganizationalEntityService,
    public lutService: LutService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,

    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      this.organizationalEntityID = paramsData.organizationalEntityID;
      this.organizationalEntityName = paramsData.organizationalEntityName;
    });
    this.loadData();
    // this.LutloadData();
    this.SubscribeUpdateService();
    this.InitOrganizationalEntity();
    this.InitCities();
  }

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  // filterGrid() 
  // {
  //   if(this.searchTerm) 
  //   { 
  //     const searchTermLower = this.searchTerm.toLowerCase();
  //     this.dataSource = this.dataSource.filter(item =>
  //     {
  //       const operationalStatusStr = item.operationalStatus ? 'operational' : 'non-operational';

  //       switch (this.selectedFilter) 
  //       {
  //         case 'name':
  //           return item.organizationalEntityName.toLowerCase().includes(searchTermLower);
  //         case 'type':
  //           return item.organizationalEntityType.toLowerCase().includes(searchTermLower);
  //         case 'parent':
  //           return item.parent.toLowerCase().includes(searchTermLower);
  //         case 'city':
  //           return item.city.toLowerCase().includes(searchTermLower);
  //         case 'owner':
  //             return item.organizationalEntityOwnership.toLowerCase().includes(searchTermLower);
  //         case 'operational':
  //             return operationalStatusStr.includes(searchTermLower)
  //         default:
  //           return (
  //             item.organizationalEntityName.toLowerCase().includes(searchTermLower) ||
  //             item.parent.toLowerCase().includes(searchTermLower) ||
  //             item.city.toLowerCase().includes(searchTermLower) ||
  //             item.organizationalEntityType.toLowerCase().includes(searchTermLower) ||
  //             item.organizationalEntityOwnership.toLowerCase().includes(searchTermLower) ||
  //             operationalStatusStr.includes(searchTermLower)
  //           );
  //       }
  //     });      
  //   }
  // }

  // filterGrid() 
  // {
  //   debugger
  //   if(this.searchTerm) 
  //   {      
  //     if(this.searchTerm === 'Operational' || this.searchTerm === 'operational')
  //     {
  //       this.searchOperationalStatus = 'true';
  //     }
  //     else if(this.searchTerm === 'Non-Operational' || this.searchTerm === 'non-operational')
  //     {
  //       this.searchOperationalStatus = 'false';
  //     }
  //     this.dataSource = this.dataSource.filter(
  //     item =>
  //     {
  //       //const operationalStatusStr = item.operationalStatus === true ? 'Operational' : 'Non-Operational';
  //       return(
  //         (item.organizationalEntityName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
  //         (item.parent.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
  //         (item.city.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
  //         (item.organizationalEntityType.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
  //         (item.organizationalEntityOwnership.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
  //         (item.operationalStatus.toString().includes(this.searchOperationalStatus.toLowerCase()))
  //         //(item.operationalStatus.toString().toLowerCase().includes(searchOperationalStatus.toString()))
  //         //(operationalStatusStr.toLowerCase().includes(this.searchTerm.toLowerCase()))
  //         );
  //     });      
  //   }
  // }

  InitOrganizationalEntity(){
    this._generalService.GetOrganizationalEntity().subscribe(
      data=>
      {
        this.OrganizationalEntityList=data;
        this.filteredOrganizationalEntityOptions = this.parent.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.OrganizationalEntityList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredCityOptions = this.city.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.CityList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  refresh() {
    this.SearchName = '';
    this.parent.setValue(''),
    this.city.setValue(''),
    this.SearchOrganizationalType= '',
    this.SearchOperationalStatus= '',
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.SearchOwner='';
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
      //  alert(row.id);
      console.log(row)
    this.organizationalEntityID = row.organizationalEntityID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  deleteItem(row)
  {

    this.organizationalEntityID = row.id;
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
      case 'type':
        this.SearchOrganizationalType = this.searchTerm;
        break;
      case 'parent':
        this.parent.setValue(this.searchTerm);
        break;
      case 'city':
        this.city.setValue(this.searchTerm);
        break;
      case 'name':
        this.SearchName = this.searchTerm;
        break;
      case 'owner':
        this.SearchOwner = this.searchTerm;
        break;
      case 'operationalStatus':
        const lowerSearchTerm = this.searchTerm.toLowerCase();
        if (lowerSearchTerm.includes('oper'))
        {
          this.SearchOperationalStatus = true;
        } 
        else if (lowerSearchTerm.includes('non')) 
        {
          this.SearchOperationalStatus = false;
        }
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.organizationalEntityService.getTableData(this.SearchName,
        this.parent.value,
        this.city.value,
        this.SearchOrganizationalType,
        this.SearchOperationalStatus,
        this.SearchOwner,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data => {
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
  onContextMenu(event: MouseEvent, item: OrganizationalEntity, row: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
    // this.openFormIfBranch(row);
  }

//  openFormIfBranch(row: any){
//     this.dialog.open(FormDialogLutComponent, {
//       data: {
//         advanceTable: row,
//         action: 'branch'
//       }
//     });
//   }

  // openInNewTab(menuItem: any, rowItem: any) {
  //   let baseUrl = this._generalService.FormURL;
  //   if(menuItem.label.toLowerCase() === 'lut') {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/lut'], { queryParams: {
  //       organizationalEntityID: rowItem.organizationalEntityID,
  //       organizationalEntityName: rowItem.organizationalEntityName,
       
  //       // CustomerName: rowItem.customerName
  //     } }));
  //     console.log(rowItem)
  //     window.open(baseUrl + url, '_blank'); 
  //     // this.router.navigate(['/customerAddress'], {
  //     //   queryParams: {
  //     //     CustomerID: rowItem.customerID,
  //     //     CustomerName: rowItem.customerName
  //     //   }
  //     // });
  //   }
  // }

  openInNewTab(menuItem: any, rowItem: any) {
    let baseUrl = this._generalService.FormURL;
  
    if(menuItem.label.toLowerCase() === 'lut') {
      // Encrypt the organizational entity ID and name
      const encryptedOrganizationalEntityID = this._generalService.encrypt(encodeURIComponent(rowItem.organizationalEntityID));
      const encryptedOrganizationalEntityName = this._generalService.encrypt(encodeURIComponent(rowItem.organizationalEntityName));
  
      // Construct the URL with the encrypted parameters
      const url = this.router.serializeUrl(this.router.createUrlTree(['/lut'], {
        queryParams: {
          organizationalEntityID: encryptedOrganizationalEntityID,
          organizationalEntityName: encryptedOrganizationalEntityName,
        }
      }));
  
      console.log(rowItem); // Log rowItem for debugging
  
      // Open the new tab with the encrypted URL
      window.open(baseUrl + url, '_blank');
    }
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
          if(this.MessageArray[0]=="OrganizationalEntityCreate")
          {
            if(this.MessageArray[1]=="OrganizationalEntityView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Organizational Entity Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityUpdate")
          {
            if(this.MessageArray[1]=="OrganizationalEntityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Organizational Entity Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityDelete")
          {
            if(this.MessageArray[1]=="OrganizationalEntityView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Organizational Entity Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityAll")
          {
            if(this.MessageArray[1]=="OrganizationalEntityView")
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
    this.organizationalEntityService.getTableDataSort(this.SearchName,
      this.SearchParent,
      this.SearchCity,
      this.SearchOrganizationalType,
      this.SearchOperationalStatus,
      this.SearchOwner,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  // OpenStakeHolder(item:any)
  // {
  //   let baseUrl =  this._generalService.FormURL;
  //   const url = this.router.serializeUrl(this.router.createUrlTree(['/organizationalEntityStakeHolders'], { queryParams: {
  //     OrganizationalEntityID: item.organizationalEntityID,
  //     OrganizationalEntity: item.organizationalEntityName,
  //    } }));
  //   window.open(baseUrl + url, '_blank'); 
  
  // }

  OpenStakeHolder(item: any) {
    // Log the original values before encryption
    console.log('Original OrganizationalEntityID:', item.organizationalEntityID);
    console.log('Original OrganizationalEntityName:', item.organizationalEntityName);
    
    // Encrypt the required values
    const encryptedOrganizationalEntityID = this._generalService.encrypt(encodeURIComponent(item.organizationalEntityID));
    const encryptedOrganizationalEntityName = this._generalService.encrypt(encodeURIComponent(item.organizationalEntityName));
    
    // Log the encrypted values
    console.log('Encrypted OrganizationalEntityID:', encryptedOrganizationalEntityID);
    console.log('Encrypted OrganizationalEntityName:', encryptedOrganizationalEntityName);
    
    let baseUrl = this._generalService.FormURL;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/organizationalEntityStakeHolders'], { queryParams: {
      OrganizationalEntityID: encryptedOrganizationalEntityID,
      OrganizationalEntity: encryptedOrganizationalEntityName,
    } }));
    
    window.open(baseUrl + url, '_blank');
  }
  
}



