// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RateViewForLocalContractModel } from './rateViewForLocalContract.model';
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
import { RateViewForLocalContractService } from './rateViewForLocalContract.service';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-rateViewForContract',
  templateUrl: './rateViewForLocalContract.component.html',
  styleUrls: ['./rateViewForLocalContract.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class RateViewForLocalContractComponent implements OnInit {
  displayedColumns = [
    'Package',
    'CustomerContractCityTier',
    'City',    
    'CustomerContractCarCategory',
    'Car',
    'MinimumHours',
    'MinimumHours',
    'MinimumKM',
    'BaseRate',
    'ExtraHRRate',
    'ExtraKMRate',
    'NightCharge',
    'DriverAllowance',
    'FGR',
    'FGRCharges',
    'BillFromTo'
  ];

  displayColumnsOfFRD = [
    'BillFromTo',
    'PackageGraceKms',
    'PackageGraceMinutes',
    'PackageJumpCriteria',
    'NextPackageSelectionCriteria',
    'AddtionalKms',
    'AddtionalMinutes',
    'ShowAddtionalKMAndHours'
  ];

  dataSource: RateViewForLocalContractModel[] | null;
  CustomerContract_ID: any;
  PackageName: string;
  advanceTable: RateViewForLocalContractModel | null;
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

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public rateViewForLocalContractService: RateViewForLocalContractService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public cdcLocalFixedDetailsService: CDCLocalFixedDetailsService,
    private datePipe: DatePipe
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
      const encryptedCustomerContractID = paramsData.customerContractID;
      this.CustomerContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
    });

    this.loadData();
    this.loadDataForFixedDetails();
  }

  public loadDataForFixedDetails() 
   {
      this.cdcLocalFixedDetailsService.getTableData(this.CustomerContract_ID,this.SearchBillFromTo,this.SearchPackageJumpCriteria,this.SearchNextPackageCriteria, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.advanceTableForFRD = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }



  refresh() 
  {
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
    this.loadDataForFixedDetails();
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
      this.rateViewForLocalContractService.getTableData(this.CustomerContract_ID).subscribe
      (
        data =>   
        {
          this.dataSource = data;
          this.ContractName = this.dataSource[0].customerContractName;
          const dt = this.dataSource[0].currentDateTime;
          this.CurrentDateTime = this.datePipe.transform(dt, 'dd-MM-yyyy HH:mm');        
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  onContextMenu(event: MouseEvent, item: RateViewForLocalContractModel) {
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


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



