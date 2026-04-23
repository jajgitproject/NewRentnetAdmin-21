// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { VendorContractService } from './vendorContract.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VendorContractDropDown, VendorContractModel } from './vendorContract.model';
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
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CurrencyDropDown } from '../general/currencyDropDown.model';
import moment from 'moment';
import { Router } from '@angular/router';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-vendorContract',
  templateUrl: './vendorContract.component.html',
  styleUrls: ['./vendorContract.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class VendorContractComponent implements OnInit {
  @Input() action:any;
  
  displayedColumns = [
    'VendorContractName',
    'CopiedFrom',
    'VendorContractValidFrom',
    'CurrencyName',
    'status',
    'actions'
  ];
  dataSource: VendorContractModel[] | null;
  vendorContractID: number;
  advanceTable: VendorContractModel | null;
  SearchActivationStatus : boolean = true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  SearchName: string = '';
  searchName : FormControl = new FormControl();

  SearchValidFrom: string = '';
  validFrom : FormControl = new FormControl();

  SearchValidTo: string = '';
  validTo : FormControl = new FormControl();

  searchTerm: any = '';
  selectedFilter: string = 'search';

  menuItems: any[] = [
    { label: 'Car Category Mapping', },
    { label: 'City Tiers Mapping',  },
    { label: 'Package Type Mapping',  },    
    { label: 'Payment Mapping', }, 
    { label: 'Local Rate',  },
    { label: 'Local Transfer Rate', },
    { label: 'Local Lumpsum Rate', },
    { label: 'OutStationOne Way Trip Rate', tooltip: 'OutStation One Way Trip Rate' }, 
    { label: 'OutStationRound Trip Rate', tooltip: 'OutStation Round Trip Rate' }, 
    { label: 'Long Term Rental Rate',  tooltip: 'Long Term Rental Rate' },    
  ];

  visibleMenuItems: any[] = [];
  public packageType?: PackageTypeDropDown[] = [];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public vendorContractService: VendorContractService,
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
    this.loadData();
    this.SubscribeUpdateService();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
  }
  

  refresh() 
  {
    this.searchName.setValue('');
    this.SearchValidFrom='';
    this.SearchValidTo='';
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

  editCall(row) 
  {
    this.vendorContractID = row.vendorContractID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }

  deleteItem(row)
  {
    this.vendorContractID = row.id;
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
    if(this.SearchValidFrom!==""){
      this.SearchValidFrom=moment(this.SearchValidFrom).format('MMM DD yyyy');
    }
    if(this.SearchValidTo!==""){
      this.SearchValidTo=moment(this.SearchValidTo).format('MMM DD yyyy');
    }
    switch (this.selectedFilter)
    {
      case 'contractName':
        this.searchName.setValue(this.searchTerm);
        break;
      case 'validFrom':
        this.SearchValidFrom = this.searchTerm;
        break;
      case 'validTo':
        this.SearchValidTo = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }  
      this.vendorContractService.getTableData(this.searchName.value,
        this.SearchValidFrom,
        this.SearchValidTo,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

 getPackageType(item: any): Promise<void> {
    return new Promise((resolve) => {
        this._generalService.getPackageTypeByVendorID(item.vendorContractID).subscribe(
            data => {
                this.packageType = data;
                this.updateMenuItems();
                resolve();
            },
            (error: HttpErrorResponse) => {
                this.dataSource = null;
                resolve();
            });
          });
        }

  private updateMenuItems() 
  {
    this.visibleMenuItems = [];
    const alwaysVisibleItems = this.getAlwaysVisibleItems();
    if(this.packageType && this.packageType.length>0)
    {
      const conditionalItems = this.packageType
      .map(pt => {
        const normalizedPackage = pt.packageType
          .toLowerCase()
          .replace(/\s+/g, '');

        return this.menuItems.find(item =>
          item.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(normalizedPackage)
        );
      })
      .filter(Boolean);
      //const conditionalItems = this.menuItems;
      this.visibleMenuItems = [...alwaysVisibleItems, ...conditionalItems];
    }
    else
    {
      this.visibleMenuItems = [...alwaysVisibleItems];
    }
    this.sortMenuItems();
  }

  private getAlwaysVisibleItems() 
  {
    return this.menuItems.filter(item => 
      ['City Tiers Mapping', 'Package Type Mapping', 'Car Category Mapping','Payment Mapping',].includes(item.label)
    );
  }

  private sortMenuItems() 
  {
    this.visibleMenuItems.sort((a, b) => a.label.localeCompare(b.label));
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

  onContextMenu(event: MouseEvent, item: VendorContractModel) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      
      this.contextMenu.menuData = { item: item };
  
      // Fetch package type and then open the menu
      this.getPackageType(item).then(() => {
          this.contextMenu.menu.focusFirstItem('mouse');
          this.contextMenu.openMenu();
      });
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

  openInNewTab(menuItem: any, rowItem: any) 
  {
    let baseUrl =  this._generalService.FormURL;
    const encryptedVendorContractID = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractID.toString()));
    const encryptedVendorContractName = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractName || ''));
    const encryptedStartDate = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractValidFrom || ''));
    const encryptedEndDate = encodeURIComponent(this._generalService.encrypt(rowItem.vendorContractValidTo || ''));


    if(menuItem.label.toLowerCase() === 'car category mapping') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorContractCarCategory'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }

    else if(menuItem.label.toLowerCase() === 'city tiers mapping') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorContractCityTiers'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }
    
    else if(menuItem.label.toLowerCase() === 'package type mapping') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorContractPackageTypeMapping'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }

    else if(menuItem.label.toLowerCase() === 'payment mapping') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorPaymentMapping'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }

    else if(menuItem.label.toLowerCase() === 'local rate') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorContractLocalRate'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }

    else if(menuItem.label.toLowerCase() === 'local lumpsum rate') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorLocalLumpsumRate'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }
    
    else if(menuItem.label.toLowerCase() === 'local transfer rate') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorLocalTransferRate'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }

    else if(menuItem.label.toLowerCase() === 'outstationone way trip rate') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorOutStationOneWayTripRate'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }

    else if(menuItem.label.toLowerCase() === 'outstationround trip rate') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree([ '/vendorOutStationRoundTripRate'], { queryParams: {
        VendorContractID: encryptedVendorContractID,
        VendorContractName: encryptedVendorContractName,
        StartDate: encryptedStartDate,
        EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
    }

    else if(menuItem.label.toLowerCase() === 'long term rental rate') 
    {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/vendorLongTermRentalRate'], { queryParams: {
      VendorContractID: encryptedVendorContractID,
      VendorContractName: encryptedVendorContractName,
      StartDate: encryptedStartDate,
      EndDate: encryptedEndDate
      } }));
      window.open(baseUrl + url, '_blank'); 
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
          if(this.MessageArray[0]=="VendorContractCreate")
          {
            if(this.MessageArray[1]=="VendorContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Vendor Contract Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractUpdate")
          {
            if(this.MessageArray[1]=="VendorContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractDelete")
          {
            if(this.MessageArray[1]=="VendorContractView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Vendor Contract Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="VendorContractAll")
          {
            if(this.MessageArray[1]=="VendorContractView")
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
    this.vendorContractService.getTableDataSort(this.SearchName,
      this.SearchValidFrom,
      this.SearchValidTo,
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
}



