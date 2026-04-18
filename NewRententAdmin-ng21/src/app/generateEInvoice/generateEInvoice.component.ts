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
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import moment from 'moment';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { GenerateEInvoiceService } from './generateEInvoice.service';
import { GenerateEInvoiceModel } from './generateEInvoice.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { Router } from '@angular/router';
import { FormDialogComponent } from '../generateEInvoice/dialogs/form-dialog/form-dialog.component';
import Swal from 'sweetalert2';
import { ConfirmGenerateEInvoiceComponent } from './dialogs/confirmGenerateEInvoice/confirmGenerateEInvoice.component';
import { DynamicEInvoiceComponent } from '../dynamicEInvoice/dynamicEInvoice.component';
import { DynamicEInvoiceService } from '../dynamicEInvoice/dynamicEInvoice.service';

@Component({
  standalone: false,
  selector: 'app-generateEInvoice',
  templateUrl: './generateEInvoice.component.html',
  styleUrls: ['./generateEInvoice.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class GenerateEInvoiceComponent implements OnInit {
  displayedColumns = [
    'actions',
    'CustomerName',
    'InvoiceTotalAmount',
    'InvoiceNumberWithPrefix',
    'InvoiceDate',
    //'IRN',
    'IRNStatus',
    'AcknowledgementDate',
    'CancelationReason',
    'CancelationDateTime'
  ];

  dataSource: GenerateEInvoiceModel[] | null;
  employeeID: number;
  row: GenerateEInvoiceModel | null;
  SearchName: string = '';
  IsLockedOut:boolean=true;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  userType:string='Employee';
  dialogRef: MatDialogRef<any>;
  ActiveStatus: any;
  last: any;

  filteredCustomerOptions:Observable<CustomerDropDown[]>;
  public CustomerList?:CustomerDropDown[]=[];

  searchCustomerName:string='';
  customer : FormControl=new FormControl();

  SearchInvoiceNumber: string = '';
  SearchFromDate: string = '';
  startDate : FormControl = new FormControl();

  SearchToDate: string = '';
  endDate : FormControl = new FormControl();
  SearchIRNStatus: string = '';
  invoiceID: any;
  irn: any;
  image: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public generateEInvoiceService: GenerateEInvoiceService,
     public dynamicEInvoiceService: DynamicEInvoiceService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public router:Router,
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
    this.InitCustomer();
  }
  
  //-------Customer-------
  InitCustomer()
  {
    this._generalService.GetCustomers().subscribe(
    data=>
    {
      this.CustomerList=data;
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomer(value || ''))
      ); 
    });
  }

  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CustomerList.filter(
      data => 
      {
        return data.customerName.toLowerCase().includes(filterValue);
      }
    );
  }

  onCustomerSelected(customer: string) 
  {
    const selectedCustomer = this.CustomerList.find(
      data => data.customerName === customer);
  }


  refresh() 
  {
    this.customer.setValue('');
    this.SearchInvoiceNumber = '';
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchIRNStatus = '';
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
    if(this.SearchFromDate!=="")
    {
      this.SearchFromDate=moment(this.SearchFromDate).format('yyyy-MM-DD');
    }
    if(this.SearchToDate!=="")
    {
      this.SearchToDate=moment(this.SearchToDate).format('yyyy-MM-DD');
    }
    this.generateEInvoiceService.getTableData(this.SearchInvoiceNumber.replace(/\//g, '-'),this.SearchFromDate,this.SearchToDate,this.customer.value,this.SearchIRNStatus,this.PageNumber).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
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

  onContextMenu(event: MouseEvent, item: GenerateEInvoiceModel) {
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

  SortingData(coloumName: any) 
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
    this.generateEInvoiceService.getTableDataSort(this.SearchInvoiceNumber.replace(/\//g, '-'),this.SearchFromDate,this.SearchToDate,this.customer.value,this.SearchIRNStatus,this.PageNumber,coloumName.active, this.sortType).subscribe
    (
      data => {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }


  ViewEInvoice(item: any) 
  {
    this.generateEInvoiceService.viewEInvoice(item.irn).subscribe(
      (data: Blob) => {
          const url = URL.createObjectURL(data);
          if (data.type.startsWith('image/')  || data.type === 'application/pdf') 
          {
            const url = URL.createObjectURL(data);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 10000);
          } 
          else 
          {
            const reader = new FileReader();
            reader.onload = () => {
            try {
                  const errorResponse = JSON.parse(reader.result as string);
                  Swal.fire({
                            title: errorResponse.result || 'Invoice not found',
                            icon: 'error'
                            });
                } 
                catch (e) 
                {
                  Swal.fire({
                            title: 'Failed to load invoice',
                            icon: 'error'
                          });
                }
              };
            reader.readAsText(data);
          };
    },
    (error) => {
      console.error("Error loading invoice", error);
    });
  }


  ConfirmGenerateEInvoice(row)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to generate this E-Invoice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      customClass: {
        cancelButton: 'btn btn-danger',
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: true // Let Bootstrap classes apply fully
    }).then((result) => {
      if (result.isConfirmed) 
      {
        let requestPayload = new GenerateEInvoiceModel;
        requestPayload.invoiceNo   = row.invoiceNumberWithPrefix;
        requestPayload.invoiceType = row.invoiceType === 'InvoiceGeneral' ? 'General' : 'Corporate';
        this.generateEInvoiceService.generateEInvoice(requestPayload).subscribe(
        response => 
        {
          if (response?.result) 
          {
            Swal.fire({
                  title: response.result,
                  //icon: 'error'
                });
          } 
          else 
          {
            this.dialogRef.close(true);
            this.showNotification(
              'snackbar-success',
              'E - Invoice Generated Successfully...!!!',
              'bottom',
              'center'
            );
          }
          this.loadData();
        },
        error => {
            this.showNotification(
              'snackbar-danger',
              'Operation Failed...!!!',
              'bottom',
              'center'
            );
          }
        );
      }
    });
  }

  
  ConfirmCancelEInvoice(row)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel this E-Invoice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      customClass: {
        cancelButton: 'btn btn-danger',
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: true // Let Bootstrap classes apply fully
    }).then((result) => {
      if (result.isConfirmed) 
      {
        const dialogRef = this.dialog.open(FormDialogComponent, 
        {
          data: 
          {
            data:row,
            action:'cancel',
          }
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          if (res === true) 
          {
           this.loadData();
          }
        });
      }
    });
  }


dynamicEInvoice(item: any) {
  console.log(item);

  let baseUrl = this._generalService.FormURL;

  const url = this.router.serializeUrl(
    this.router.createUrlTree(['/dynamicEInvoice'], {
      queryParams: {
        invoiceID: item?.invoiceID,
        invoiceNo: item?.invoiceNumberWithPrefix
      }
    })
  );

  window.open(baseUrl + url, '_blank');
}

}




