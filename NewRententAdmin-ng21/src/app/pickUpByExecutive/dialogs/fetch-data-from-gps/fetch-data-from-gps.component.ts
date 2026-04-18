// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { PickUpByExecutiveService } from '../../pickUpByExecutive.service';
import { GeneralService } from 'src/app/general/general.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { FetchDataFromApp, PickUpByExecutive } from '../../pickUpByExecutive.model';

@Component({
  standalone: false,
  selector: 'app-fetch-data-from-gps',
  templateUrl: './fetch-data-from-gps.component.html',
  styleUrls: ['./fetch-data-from-gps.component.sass']
})
export class FetchDataFromGPSComponent implements OnInit {
  displayedColumns = [  
    'pickupKM',  
    'addressString',
    'latitude',
    'longitude',
    'select'   
  ];
  fetchDataFromGPSList=[];
  advanceTableForm: any;
  advanceTable:PickUpByExecutive;
  reservationID: any;
  constructor(
    public dialogRef: MatDialogRef<FetchDataFromGPSComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public advanceTableService: PickUpByExecutiveService,
    public _generalService: GeneralService
  )
  {
    
    this.reservationID=data.reservationID;
    console.log(this.reservationID);
    this.advanceTableForm = this.createContactForm();
  }
  createContactForm(): FormGroup {
    return this.fb.group(
    {
      pickupDate: [new Date()],
      pickupTime: [new Date()],
    });
  }

  GetDataFromGPS()
  {
    debugger;
    var pickupDate=moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
    var pickupTime=moment(this.advanceTableForm.value.pickupTime).format('HH:mm');
    //var reseravtionID = reseravtionID;

    this.advanceTableService.getDataFromGPS(pickupDate,pickupTime,this.reservationID).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchDataFromGPSList.push(data);
        this.dialogRef.close({data:this.fetchDataFromGPSList});
        console.log(this.fetchDataFromGPSList)
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

  onGPSClick(item:any)
  {
    this.dialogRef.close({data:this.fetchDataFromGPSList[item]});
  }
  ngOnInit(): void {
  }

}



