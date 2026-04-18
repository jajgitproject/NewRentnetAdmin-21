// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RateViewForOutstationRoundTripVendorContractModel } from './rateViewForOutstationRoundTripVendorContract.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDialogComponent as CDCLocalFixedDetailsFormDialogComponent} from '../cdcLocalFixedDetails/dialogs/form-dialog/form-dialog.component';
import { CDCLocalFixedDetailsService } from '../cdcLocalFixedDetails/cdcLocalFixedDetails.service';
import { CDCLocalFixedDetails } from '../cdcLocalFixedDetails/cdcLocalFixedDetails.model';
import { DatePipe } from '@angular/common';
import { RateViewForOutstationRoundTripVendorContractService } from './rateViewForOutstationRoundTripVendorContract.service';

@Component({
  standalone: false,
  selector: 'app-rateViewForOutstationRoundTripVendorContract',
  templateUrl: './rateViewForOutstationRoundTripVendorContract.component.html',
  styleUrls: ['./rateViewForOutstationRoundTripVendorContract.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class RateViewForOutstationRoundTripVendorContractComponent implements OnInit {
  displayedColumns = [
    'Package',
    'VendorContractCityTier',
    // 'City',    
    'VendorContractCarCategory',
    'Car',
    'MinimumKmsPerDay',
    'RatePerDay',
    'ExtraKMRate',
    'NightCharge',
    'DriverAllowance',
    'BillFromTo'
  ];

  dataSource: RateViewForOutstationRoundTripVendorContractModel[] | null;
  CustomerContract_ID: any;
  PackageName: string;
  advanceTable: RateViewForOutstationRoundTripVendorContractModel | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;

  SearchBillFromTo: string='';
  SearchPackageJumpCriteria: string='';
  SearchNextPackageCriteria:string='';
  advanceTableForFRD: CDCLocalFixedDetails | null;
  CurrentDateTime: string;
  ContractName: string;
  
  sortingData: number;
  sortType: string;
  VendorContractName: any;
  VendorContract_ID: any;
  vendorContract_ID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public rateViewForOutstationRoundTripVendorContractService: RateViewForOutstationRoundTripVendorContractService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    private datePipe: DatePipe
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
      const encryptedVendorContractID = paramsData.vendorContractID;
      this.vendorContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedVendorContractID));
    });

    this.loadData();
  }

  refresh() 
  {
    this.SearchActivationStatus = true;
    this.PageNumber=0;
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

   public loadData() 
   {
      this.rateViewForOutstationRoundTripVendorContractService.getTableData(this.vendorContract_ID).subscribe
      (
        data =>   
        {
          this.dataSource = data;
          this.VendorContractName = this.dataSource[0].vendorContractName;
          const dt = this.dataSource[0].currentDateTime;
          this.CurrentDateTime = this.datePipe.transform(dt, 'dd-MM-yyyy HH:mm');
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  onContextMenu(event: MouseEvent, item: RateViewForOutstationRoundTripVendorContractModel) {
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
}



