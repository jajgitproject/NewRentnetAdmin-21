// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { GeneralService } from 'src/app/general/general.service';
import { FetchDataFromApp } from 'src/app/fetchDataFromApp/fetchDataFromApp.model';
import { DispatchByExecutiveService } from '../../dispatchByExecutive.service';
@Component({
  standalone: false,
  selector: 'app-fetch-data-from-gps',
  templateUrl: './fetch-data-from-gps.component.html',
  styleUrls: ['./fetch-data-from-gps.component.sass']
})
export class FetchDataFromGPSComponent implements OnInit {

  displayedColumns = [
    'pickupAddressString',
    'pickupKM',
    'pickupLatitude',
    'pickupLongitude',
    'select'
  ];
  advanceTableForm: any;
  fetchDataFromGPSList = [];
  dialogTitle: string;
  ReservationID: any;

  constructor(public dialogRef: MatDialogRef<FetchDataFromGPSComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DispatchByExecutiveService,
      private fb: FormBuilder,
    public _generalService:GeneralService) 
    { 
      this.dialogTitle = "Fetch GPS Data";
      this.ReservationID = data.reservationID;
      console.log(this.ReservationID)
      this.advanceTableForm = this.createContactForm();
    }
    createContactForm(): FormGroup
    {
      return this.fb.group(
      {
        pickupDate: [new Date()],
        pickupTime: [new Date()],
      });
    }

    onGPSDataClick()
  {
    var pickupDate=moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
    var pickupTime=moment(this.advanceTableForm.value.pickupTime).format('HH:mm');
   
    console.log(pickupDate,pickupTime,this.ReservationID);

    this.advanceTableService.getDataFromGPS(pickupDate,pickupTime,this.ReservationID).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchDataFromGPSList.push(data);
        this.dialogRef.close({data:this.fetchDataFromGPSList});
        console.log(this.fetchDataFromGPSList);
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

  // onGPSClick(item:any)
  // {
  //   this.dialogRef.close({data:this.fetchDataFromGPSList[item]});
  // }

  ngOnInit(): void {
  }

}



