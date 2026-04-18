// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import moment from 'moment';
import { Router } from '@angular/router';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../carPaidTaxMIS/registrationDropDown.model';
import { CreditNoteHistoryComponent } from '../creditnotehistory/creditnotehistory.component';
import { InvoiceBillingHistoryComponent } from '../invoiceBillingHistory/invoiceBillingHistory.component';
import { InventoryComplianceDashboardService } from './inventoryComplianceDashboard.service';
import { InventoryComplianceDashboardModel } from './inventoryComplianceDashboard.model';

@Component({
  standalone: false,
  selector: 'app-inventoryComplianceDashboard',
  templateUrl: './inventoryComplianceDashboard.component.html',
  styleUrls: ['./inventoryComplianceDashboard.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InventoryComplianceDashboardComponent implements OnInit {
  displayedColumns = [
    'registrationNumber',
    'documentType',
    'documentName',
    'documentExpiry',
    'daysRemaining',
    'documentStatus',
    'organizationalEntityName',
  ];

  dataSource: InventoryComplianceDashboardModel[] | null;
  status: string = 'Active';
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  dialogRef: MatDialogRef<any>;
  SearchRequestFromDate: string = '';
  SearchRequestToDate: string = '';
  SearchTRN:string ='';
  SearchEcoBookingNo: string = '';
  SearchStatus:string ='';
  searchLocation: string = '';
  searchinvoiceStatusActiveOrVoid: string = '';
  public DocumentList?:InventoryComplianceDashboardModel[]=[];
  filteredDocumentOption: Observable<InventoryComplianceDashboardModel[]>;
  documentType : FormControl=new FormControl();
  filteredBillingOptions: Observable<OrganizationalEntityDropDown[]>;
  filteredVOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  searchOwnedSupplier:string='';
  searchDocumentType:string='';
  searchDaysRemaning:string='';
  location : FormControl=new FormControl();
  branch:FormControl=new FormControl();
  searchActivationStatus : string= 'Active';
  searchTerm: any = '';
  selectedFilter: string = 'search';
  advanceTableForm: any;
  public DocumentNameList?:InventoryComplianceDashboardModel[]=[];
  filteredDocumentNameOption: Observable<InventoryComplianceDashboardModel[]>;
  documentName : FormControl=new FormControl();
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public inventoryComplianceDashboardService: InventoryComplianceDashboardService,
    private snackBar: MatSnackBar,
    public router:Router,
    public _generalService: GeneralService,
    public route: Router,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.loadData();
    this.InitDocumentType();
    this.InitLocation();
    this.InitDocumentName();
  }

   //------------- Document Type ------------------
   InitDocumentType()
   {
    this.inventoryComplianceDashboardService.GetDocumentType().subscribe(
    data=>
    {                
      this.DocumentList=data;
      this.filteredDocumentOption = this.documentType.valueChanges.pipe(
        startWith(""),
        map(value => this._filterDocumentType(value || ''))
      );
    });
  }
  private _filterDocumentType(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.DocumentList?.filter(
      data => 
      {
        return data.documentType.toLowerCase().includes(filterValue);
      }
    );
  }

  //------------- Document Name ------------------
   InitDocumentName()
   {
    this.inventoryComplianceDashboardService.GetDocumentName().subscribe(
    data=>
    {                
      this.DocumentNameList=data;
      this.filteredDocumentNameOption = this.documentName.valueChanges.pipe(
        startWith(""),
        map(value => this._filterDocumentName(value || ''))
      );
    });
  }
  private _filterDocumentName(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.DocumentNameList?.filter(
      data => 
      {
        return data.documentName.toLowerCase().includes(filterValue);
      }
    );
  }

  refresh() 
  {
    this.documentName.setValue('');
    this.status = 'Active';
    this.searchOwnedSupplier = '';
    this.searchActivationStatus = '';
    this.PageNumber = 0;
    this.documentType.setValue('');
    this.location.setValue('');
    this.searchDaysRemaning = "";
    this.branch.setValue('');
    this.searchTerm = '';
    this.selectedFilter = 'search'; 
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();
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
    this.inventoryComplianceDashboardService.getTableData(this.documentType.value, this.documentName.value ,this.searchOwnedSupplier,  this.location.value, this.searchDaysRemaning,this.status,this.PageNumber).subscribe(
    data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }

  onContextMenu(event: MouseEvent, item: InventoryComplianceDashboardModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() 
  {
    if (this.dataSource.length > 0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall() 
  {
    if (this.PageNumber > 0)
    {
      this.PageNumber--;
      this.loadData();
    }
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
    this.inventoryComplianceDashboardService.getTableDataSort(this.searchDocumentType, this.documentName.value, this.searchOwnedSupplier, this.searchLocation, this.searchDaysRemaning, this.status, this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }


  //---------- Location ----------
  InitLocation()
  {
    this.inventoryComplianceDashboardService.GetLocation().subscribe(
    data=>
    {
      this.OrganizationalEntityList=data;
      this.filteredOrganizationalEntityOptions = this.location.valueChanges.pipe(
        startWith(""),
        map(value => this._filterOrganizationalEntity(value || ''))
      ); 
    });
  }
  private _filterOrganizationalEntity(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.OrganizationalEntityList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      });
    }

}




