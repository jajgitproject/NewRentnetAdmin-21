// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { FormBuilder, FormGroup } from '@angular/forms';

import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { FetchDataFromApp } from '../../garageIn.model';
import { GarageInService } from '../../garageIn.service';
@Component({
  standalone: false,
  selector: 'app-fetch-garageIn-app-data',
  templateUrl: './fetch-garageIn-app-data.component.html',
  styleUrls: ['./fetch-garageIn-app-data.component.sass']
})
export class FetchGarageInAppDataDialogComponent
{
  displayedColumns = [  
    'pickupKM',  
    'addressString',
    'latitude',
    'longitude',
    'select'   
  ];
  advanceTableForm: FormGroup;
  fetchCurrentDataFromAppList:FetchDataFromApp[] | [];
  fetchPreviousDataFromAppList:FetchDataFromApp[] | [];
  fetchNextDataFromAppList:FetchDataFromApp[] | [];
  constructor(
    public dialogRef: MatDialogRef<FetchGarageInAppDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public advanceTableService: GarageInService,
    public _generalService: GeneralService
  )
  {
    this.advanceTableForm = this.createContactForm();
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, item: FetchDataFromApp) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  createContactForm(): FormGroup {
    return this.fb.group(
    {
      pickupDate: [new Date()],
      pickupTime: [new Date()],
    });
  }

  GetDataFromApp()
  {
    var pickupDate=moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
    var pickupTime=moment(this.advanceTableForm.value.pickupTime).format('HH:mm')

    this.advanceTableService.fetchAppCurrentData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchCurrentDataFromAppList=data;
        console.log(this.fetchCurrentDataFromAppList)
      }
    );

    this.advanceTableService.fetchAppPreviousData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchPreviousDataFromAppList=data;
        console.log(this.fetchPreviousDataFromAppList)
      }
    );

    this.advanceTableService.fetchAppNextData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchNextDataFromAppList=data;
        console.log(this.fetchNextDataFromAppList)
      }
    );
  }

  submit() 
  {
    console.log(this.advanceTableForm.value);
  }

  onNoClick(): void
  {
    this.advanceTableForm.reset();
  }

  onCurrentClick(item:any)
  {
    this.dialogRef.close({data:this.fetchCurrentDataFromAppList[item]});
  }

  onPreviousClick(item:any)
  {
    this.dialogRef.close({data:this.fetchPreviousDataFromAppList[item]});
  }

  onNextClick(item:any)
  {
    this.dialogRef.close({data:this.fetchNextDataFromAppList[item]});
  }
}



