// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ShowLateAllotmentMISService } from './showLateAllotmentMIS.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ShowLateAllotmentMISModel } from './showLateAllotmentMIS.model';
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
import { CityDropDown } from '../city/cityDropDown.model';
@Component({
  standalone: false,
  selector: 'app-showLateAllotmentMIS',
  templateUrl: './showLateAllotmentMIS.component.html',
  styleUrls: ['./showLateAllotmentMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ShowLateAllotmentMISComponent implements OnInit {
  displayedColumns = [
    'ReservationID',
    'CustomerName',
    'PickupDate',
    'PickupTime',
    'DateOfAllotment',
    'TimeOfAllotment',
    'TimeDiff',
    'EmployeeName',
    'ServiceLocationName'
  ];
  dataSource: ShowLateAllotmentMISModel[] | null;
  advanceTable: ShowLateAllotmentMISModel | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string = '';

  SearchServiceLocation: FormControl = new FormControl();
  public ServiceLocationList?: CityDropDown[] = [];
  filteredServiceLocationOptions: Observable<CityDropDown[]>;

  SearchFromDate: string = '';
  SearchToDate: string = '';

  SearchTimeDiff:number = 240;
  DiffInMin: string;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyRegisterService: ShowLateAllotmentMISService,
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
  
  public loadData() 
  {
    if(this.SearchFromDate!=="")
    {
      this.SearchFromDate=moment(this.SearchFromDate).format('MMM DD yyyy');
    }
    if(this.SearchToDate!=="")
    {
      this.SearchToDate=moment(this.SearchToDate).format('MMM DD yyyy');
    }
    this.dutyRegisterService.getTableData(this.SearchFromDate,this.SearchToDate,this.SearchServiceLocation.value,this.SearchTimeDiff,this.PageNumber).subscribe
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

  onContextMenu(event: MouseEvent, item: ShowLateAllotmentMISModel) 
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
    this.dutyRegisterService.getTableDataSort(this.SearchFromDate,this.SearchToDate,this.SearchServiceLocation.value,this.SearchTimeDiff,this.PageNumber,coloumName.active,this.sortType).subscribe
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
    this._generalService.GetCitiessAll().subscribe(
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
   if (!value || value.length < 3)
     {
        return [];   
      }
    return this.ServiceLocationList.filter(
    data => 
    {
      return data.geoPointName.toLowerCase().includes(filterValue);
    });
  }



  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}




