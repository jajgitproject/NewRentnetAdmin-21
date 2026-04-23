// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FetchDataFromAppService } from '../../fetchDataFromApp.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { FetchDataFromApp } from '../../fetchDataFromApp.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogPickupExecutiveComponent 
{
  private API_URL:string = '';
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: FetchDataFromApp;
  fetchCurrentDataFromAppList:FetchDataFromApp[] | [];
  fetchPreviousDataFromAppList:FetchDataFromApp[] | [];
  fetchNextDataFromAppList:FetchDataFromApp[] | [];
  displayedColumns: string[] = ['pickupAddressString', 'pickupKM', 'pickupLatitude', 'pickupLongitude', 'selectRow'];
  dataSource;
  constructor(
  public dialogRef: MatDialogRef<FormDialogPickupExecutiveComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private fetchDataService: FetchDataFromAppService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Fetch Data From App';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Fetch Data From App';
          this.advanceTable = new FetchDataFromApp({});
          //this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup {
    return this.fb.group(
    {
      pickupDate: [this.advanceTable.pickupDate],
      pickupTime: [this.advanceTable.pickupTime],
    });
  }

  onNoClick() {
    if(this.action==='add'){
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  submit() {

  }

  // searchData() {
  //   //console.log(this.advanceTableForm.controls['pickupDate'].value, this.advanceTableForm.controls['pickupTime'].value);
  //   var pickupDate = moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
  //   var pickupTime = moment(this.advanceTableForm.value.pickupTime).format('HH:mm:ss');
  //   this.fetchDataService.getTableData(pickupDate, pickupTime).subscribe((result: any) => {
  //     let dataTableRecords = [];
  //     result?.forEach(element => {
  //       dataTableRecords.push({
  //         pickupAddressString: element.pickupAddressString,
  //         pickupKM: element.pickupKM,
  //         pickupLatitude: element.pickupLatitude,
  //         pickupLongitude: element.pickupLongitude
  //       });
  //     });
  //     this.dataSource = dataTableRecords;
  //   }, (error: HttpErrorResponse) => {
  //  });
  // }

  GetDataFromApp()
  {
    var pickupDate=moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
    var pickupTime=moment(this.advanceTableForm.value.pickupTime).format('HH:mm')

    this.fetchDataService.fetchAppCurrentData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchCurrentDataFromAppList=data;
      }
    );

    this.fetchDataService.fetchAppPreviousData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchPreviousDataFromAppList=data;
      }
    );

    this.fetchDataService.fetchAppNextData(pickupDate,pickupTime).subscribe(
      (data:FetchDataFromApp[])=>
      {
        this.fetchNextDataFromAppList=data;
      }
    );
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

  setData(item: any) {
    this.dialogRef.close(item);
  }
}



