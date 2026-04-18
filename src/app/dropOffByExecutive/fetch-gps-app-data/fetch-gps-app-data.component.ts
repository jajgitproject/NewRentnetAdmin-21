// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { DropOffByExecutiveService } from '../dropOffByExecutive.service';
import { FetchDataFromApp } from 'src/app/fetchDataFromApp/fetchDataFromApp.model';
import { GeneralService } from 'src/app/general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DropOffByExecutive } from '../dropOffByExecutive.model';
@Component({
  standalone: false,
  selector: 'app-fetch-gps-app-data',
  templateUrl: './fetch-gps-app-data.component.html',
  styleUrls: ['./fetch-gps-app-data.component.sass']
})
export class FetchGpsAppDataDialogComponent
{
  displayedColumns = [  
    'pickupKM',  
    'addressString',
    'latitude',
    'longitude',
    'select'   
  ];
  advanceTableForm: FormGroup;
  advanceTable: FetchDataFromApp;
  fetchCurrentDataFromAppList=[];
  // fetchPreviousDataFromAppList:FetchDataFromApp[] | [];
  // fetchNextDataFromAppList:FetchDataFromApp[] | [];
  //dataSource:FetchDataFromApp[] | [];
  reservationID:any;
  action: string;
  
  constructor(
    public dialogRef: MatDialogRef<FetchGpsAppDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public advanceTableService: DropOffByExecutiveService,
    public _generalService: GeneralService
  )
  {
    this.reservationID = data.reservationID;
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

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      pickupDate: [new Date()],
        pickupTime: [new Date()],
    });
  }


  locationTimeSet(event) {
    if (this.action === 'edit') {
      let time = this.advanceTableForm.value.pickupTime;
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
    else {
      let time = event.getTime();
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
  }

  
  GetDataFromApp()
  {
    var pickupDate=moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
    var pickupTime=moment(this.advanceTableForm.value.pickupTime).format('HH:mm')

    this.advanceTableService.getDataFromGPS(pickupDate,pickupTime,this.reservationID).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchCurrentDataFromAppList.push(data)
        // this.fetchCurrentDataFromAppList=data;
        this.dialogRef.close({data:this.fetchCurrentDataFromAppList});
       
        
      }
    );
    }

  // onCurrentClick(item:any)
  // {
  //   this.dialogRef.close({data:this.fetchCurrentDataFromAppList[item]});
  // }

  submit() 
  {

  }

  onNoClick(): void
  {
    this.advanceTableForm.reset();
  }

}



