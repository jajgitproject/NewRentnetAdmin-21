// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { PickUpByExecutiveService } from '../../pickUpByExecutive.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FetchDataFromApp, PickUpByExecutive } from '../../pickUpByExecutive.model';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  standalone: false,
  selector: 'app-fetch-pickup-app-data',
  templateUrl: './fetch-pickup-app-data.component.html',
  styleUrls: ['./fetch-pickup-app-data.component.sass']
})
export class FetchPickupAppDataDialogComponent
{
  displayedColumns = [  
    'pickupKM',  
    'addressString',
    'latitude',
    'longitude',
    'select'   
  ];
  advanceTableForm: FormGroup;
  advanceTable:PickUpByExecutive;
  fetchCurrentDataFromAppList:FetchDataFromApp[] | [];
  fetchPreviousDataFromAppList:FetchDataFromApp[] | [];
  fetchNextDataFromAppList:FetchDataFromApp[] | [];
  constructor(
    public dialogRef: MatDialogRef<FetchPickupAppDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public advanceTableService: PickUpByExecutiveService,
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
      }
    );

    this.advanceTableService.fetchAppPreviousData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchPreviousDataFromAppList=data;
      }
    );

    this.advanceTableService.fetchAppNextData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchNextDataFromAppList=data;
      }
    );
  }

  submit() 
  {
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



