// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FetchDataRBEService } from '../../fetchDataRBE.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { FetchDataRBE } from '../../fetchDataRBE.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import moment from 'moment';


@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  displayedColumns = [
    'pickupAddressString',
    'pickupKM',
    'pickupLatitude',
    'pickupLongitude',
    'select'
  ];

  fetchPreviousDataFromAppList:FetchDataRBE[] | [];
  fetchCurrentDataFromAppList:FetchDataRBE[] | [];
  fetchNextDataFromAppList:FetchDataRBE[] | [];

  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: FetchDataRBE;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: FetchDataRBEService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // // Set the defaults
        // this.action = data.action;
        // if (this.action === 'edit') 
        // {
        //   this.dialogTitle ='Fetch Data RBE';       
        //   this.advanceTable = data.advanceTable;
        // } else 
        // {
        //   this.dialogTitle = 'Fetch Data RBE';
        //   this.advanceTable = new FetchDataRBE({});
        //   //this.advanceTable.activationStatus=true;
        // }
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

  GetDataFromApp()
  {
    var pickupDate=moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
    var pickupTime=moment(this.advanceTableForm.value.pickupTime).format('HH:mm');
    console.log(pickupDate,pickupTime);

    this.advanceTableService.fetchAppCurrentData(pickupDate,pickupTime).subscribe(
      (data:FetchDataRBE[])=>
      {
        this.fetchCurrentDataFromAppList=data;
        console.log(this.fetchCurrentDataFromAppList);
      }
    );

    this.advanceTableService.fetchAppPreviousData(pickupDate,pickupTime).subscribe(
      (data:FetchDataRBE[])=>
      {
        this.fetchPreviousDataFromAppList=data;
        console.log(this.fetchPreviousDataFromAppList);
      }
    );

    this.advanceTableService.fetchAppNextData(pickupDate,pickupTime).subscribe(
      (data:FetchDataRBE[])=>
      {
        this.fetchNextDataFromAppList=data;
        console.log(this.fetchNextDataFromAppList);
      }
    );

  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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



