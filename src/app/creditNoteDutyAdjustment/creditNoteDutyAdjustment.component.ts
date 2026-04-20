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
import { CreditNoteDutyAdjustmentService } from './creditNoteDutyAdjustment.service';
import { CreditNoteDutyAdjustmentModel } from './creditNoteDutyAdjustment.model';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { RegistrationDropDown } from '../carPaidTaxMIS/registrationDropDown.model';
import { CreditNoteHistoryComponent } from '../creditnotehistory/creditnotehistory.component';
import { InvoiceBillingHistoryComponent } from '../invoiceBillingHistory/invoiceBillingHistory.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';

@Component({
  standalone: false,
  selector: 'app-creditNoteDutyAdjustment',
  templateUrl: './creditNoteDutyAdjustment.component.html',
  styleUrls: ['./creditNoteDutyAdjustment.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNoteDutyAdjustmentComponent implements OnInit {
  displayedColumns = [
    'BranchName',
    'DutySlipID',
    'InvoiceDate',
    'CityName',
    'Vehicle',
    'PackageType',
    'Package',
    'DutyTotalPackageAmount',
    'Amount',
    'DebitedTo',
    'actions'
  ];

  dataSource: CreditNoteDutyAdjustmentModel[] | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  InvoiceID:number;
  CustomerName: string;
  CreditNoteTotal: number;
  CreditNoteAmount: number;
  CreditNoteNumber: any;
  InvoiceCreditNoteID: any;
  invoiceCreditNoteDutySlipAdjustmentID: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public creditNoteDutyAdjustmentService: CreditNoteDutyAdjustmentService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router: Router,
    public route:ActivatedRoute,
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      this.InvoiceCreditNoteID = paramsData.invoiceCreditNoteID;
      this.CreditNoteNumber = paramsData.invoiceCreditNoteID;
      this.InvoiceID = paramsData.invoiceID;
    });
    this.loadData();
  }

  refresh() 
  {
    this.SearchActivationStatus = true;
    this.PageNumber = 0;  
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
    this.creditNoteDutyAdjustmentService.getTableData(this.InvoiceID,this.InvoiceCreditNoteID,this.SearchActivationStatus,this.PageNumber).subscribe(
    data => 
    {
      //this.dataSource = data.filter(x => x.activationStatus === true || x.activationStatus === null);
      this.dataSource = data;
      this.CustomerName = this.dataSource[0].customerName;
      this.CreditNoteTotal = this.dataSource[0].creditNoteAmount;
      this.CreditNoteAmount = this.dataSource[0].amount;
    },
    (error: HttpErrorResponse) => { this.dataSource = null; });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: CreditNoteDutyAdjustmentModel) {
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
    this.creditNoteDutyAdjustmentService.getTableDataSort(this.InvoiceID,this.InvoiceCreditNoteID,this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
 

 openDutyAdjust(row) 
 {
  if(row.amount === 0)
    {
      this.dialog.open(FormDialogComponent, {
      width: '600px',
      data: {
          action:'add',
          advanceTable: row
        }
      });
    }
    else
    {
      this.dialog.open(FormDialogComponent, {
      width: '600px',
      data: {
          action:'edit',
          advanceTable: row
        }
      });
    }  
  }

  deleteItem(row)
  {
    this.invoiceCreditNoteDutySlipAdjustmentID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

}




