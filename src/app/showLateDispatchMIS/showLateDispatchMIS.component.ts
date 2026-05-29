// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShowLateDispatchMISService } from './showLateDispatchMIS.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ShowLateDispatchMISModel } from './showLateDispatchMIS.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { Form, FormControl } from '@angular/forms';
import moment from 'moment';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';
import { MatRadioButton } from '@angular/material/radio';
@Component({
  standalone: false,
  selector: 'app-showLateDispatchMIS',
  templateUrl: './showLateDispatchMIS.component.html',
  styleUrls: ['./showLateDispatchMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ShowLateDispatchMISComponent implements OnInit {
  displayedColumns = [
    'ReservationID',
    'CustomerName',
    'LocationOutDate',
    'LocationOutTime',
    'DispatchDate',
    'DispatchTime',
    'TimeDiff',
    'EmployeeName',
    'ServiceLocationName'
  ];
  dataSource: ShowLateDispatchMISModel[] | null;
  advanceTable: ShowLateDispatchMISModel | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string = '';

  SearchServiceLocation: FormControl = new FormControl();
  public ServiceLocationList?: OrganizationalEntityDropDown[] = [];
  filteredServiceLocationOptions: Observable<OrganizationalEntityDropDown[]>;

  SearchFromDate: string = '';
  SearchToDate: string = '';

  SearchTimeDiff:number = 240;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyRegisterService: ShowLateDispatchMISService,
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
    //this.loadData();
    this.InitServiceLocation();
    //this.SubscribeUpdateService();
  }

  refresh() 
  {
    this.SearchServiceLocation.setValue('');
    this.SearchFromDate = '';
    this.SearchToDate = '';
    this.SearchTimeDiff = 240;
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  
  private formatSearchDate(date: string | Date | null | undefined): string
  {
    if (!date || date === '')
    {
      return '';
    }
    return moment(date).format('MMM DD yyyy');
  }

  private getSearchParams()
  {
    return {
      fromDate: this.formatSearchDate(this.SearchFromDate),
      toDate: this.formatSearchDate(this.SearchToDate),
      serviceLocation: this.SearchServiceLocation.value || '',
      timeDiff: this.SearchTimeDiff
    };
  }

  public loadData() 
  {
    const searchParams = this.getSearchParams();
    this.dutyRegisterService.getTableData(searchParams.fromDate, searchParams.toDate, searchParams.serviceLocation, searchParams.timeDiff, this.PageNumber).subscribe
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

  onContextMenu(event: MouseEvent, item: ShowLateDispatchMISModel) 
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
    if (this.dataSource?.length>0) 
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

  public SearchData()
  {
    this.loadData();    
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
    const searchParams = this.getSearchParams();
    this.dutyRegisterService.getTableDataSort(searchParams.fromDate, searchParams.toDate, searchParams.serviceLocation, searchParams.timeDiff, this.PageNumber, coloumName.active, this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  //---------- Service Location ----------
  InitServiceLocation()
  {
    this._generalService.GetLocation().subscribe(
    data=>
    {
      this.ServiceLocationList=data;
      this.filteredServiceLocationOptions = this.SearchServiceLocation.valueChanges.pipe(
      startWith(""),
      map(value => this._filterServiceLocation(value || ''))
      ); 
    });
  }
  private _filterServiceLocation(value: string): any {
  const filterValue = value.toLowerCase();
  if (filterValue.length < 3) {
    return [];
  }

  return this.ServiceLocationList.filter(data => 
    data.organizationalEntityName.toLowerCase().includes(filterValue)
  );
}

  // private _filterServiceLocation(value: string): any {
  // const filterValue = value.toLowerCase();
  //   return this.ServiceLocationList.filter(
  //   data => 
  //   {
  //     return data.geoPointName.toLowerCase().includes(filterValue);
  //   });
  // }

  downloadCsv()
  {
    const searchParams = this.getSearchParams();
    this.dutyRegisterService.downloadCsv(
      searchParams.fromDate,
      searchParams.toDate,
      searchParams.serviceLocation,
      searchParams.timeDiff
    ).subscribe(
      (blob: Blob) =>
      {
        const fileUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.download = `ShowLateDispatchMIS_${moment().format('YYYYMMDD_HHmmss')}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(fileUrl);
        this.showNotification('snackbar-success', 'CSV downloaded successfully', 'top', 'center');
      },
      (error: HttpErrorResponse) =>
      {
        this.showNotification('snackbar-danger', 'Failed to download CSV', 'top', 'center');
      }
    );
  }

}




