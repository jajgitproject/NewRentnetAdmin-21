// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrentyDutyForAppModel, CurrentyDutyForDriverModel, CurrentyDutyForGPSModel } from './currentDutyDetails.model';
import { ActivatedRoute } from '@angular/router';
import { CurrentDutyDetailsService } from './currentDutyDetails.service';

@Component({
  standalone: false,
  selector: 'app-currentDutyDetails',
  templateUrl: './currentDutyDetails.component.html',
  styleUrls: ['./currentDutyDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CurrentDutyDetailsComponent implements OnInit {
  @Input() AllotmentID;
  advanceTableAppTab: CurrentyDutyForAppModel | null;
  advanceTableDriverTab: CurrentyDutyForDriverModel | null;
  advanceTableGPSTab: CurrentyDutyForGPSModel | null;
  selectedTab: string = 'App';
  appData: any;
  driverData: any;
  gpsData: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    public route:ActivatedRoute,
    public currentDutyDetailsService: CurrentDutyDetailsService,
  ) {
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    // this.route.queryParams.subscribe(paramsData =>{
    //   const encryptedAllotmentID = paramsData.allotmentID;
    //   this.AllotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID));            
    // });

    this.loadDataForAppTab();
  }
   //---------UP and Down Key Work------------------
  
 scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  onTabChangeByRadio(event: any)
  {
    switch (event.value) 
    {
      case 'App':
      if (!this.appData) 
        {
          this.loadDataForAppTab();
        }
        break;
    
      case 'Driver':
      if (!this.driverData) 
        {
          this.loadDataForDriverTab();
        }
        break;
    
      case 'GPS':
      if (!this.gpsData) 
        {
          this.loadDataForGPSTab();
        }
        break;
      }
    }
  
    public loadDataForAppTab() 
    {
      this.currentDutyDetailsService.getTableDataForApp(this.AllotmentID).subscribe
      (
        (data: CurrentyDutyForAppModel)=>   
        {
          this.advanceTableAppTab = data;    
        },
        (error: HttpErrorResponse) => { this.advanceTableAppTab = null;}
      );
    }
    
    public loadDataForDriverTab() 
    {  
      this.currentDutyDetailsService.getTableDataForDriver(this.AllotmentID).subscribe
      (
        (data: CurrentyDutyForDriverModel)=>   
        {
          this.advanceTableDriverTab = data;     
        },
        (error: HttpErrorResponse) => { this.advanceTableDriverTab = null;}
      );
    }
    
    public loadDataForGPSTab() 
    {
      this.currentDutyDetailsService.getTableDataForGPS(this.AllotmentID).subscribe
      (
        (data: CurrentyDutyForGPSModel)=>   
        {
          this.advanceTableGPSTab = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableGPSTab = null;}
      );
    }
  
  

}



