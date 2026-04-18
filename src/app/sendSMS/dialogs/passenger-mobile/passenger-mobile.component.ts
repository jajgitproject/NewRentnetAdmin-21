// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { SendSMSService } from '../../sendSMS.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from 'src/app/general/general.service';
import { SendSMS } from '../../sendSMS.model';

@Component({
  standalone: false,
  selector: 'app-passenger-mobile',
  templateUrl: './passenger-mobile.component.html',
  styleUrls: ['./passenger-mobile.component.sass']
})
export class PassengerMobileComponent implements OnInit {

  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SendSMS;
  formsData: any;
  formDataArray = [];
  constructor(public dialogRef: MatDialogRef<PassengerMobileComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: SendSMSService,
      private fb: FormBuilder,
    public _generalService:GeneralService)
    {
          // Set the defaults
          this.action = data.action;
          // if (this.action === 'edit') 
          // {
          //   this.dialogTitle ='SendSMS';       
          //   this.advanceTable = data.advanceTable;
          // } else 
          // {
          //   this.dialogTitle = 'SendSMS';
          //   this.advanceTable = new SendSMS({});
        
          // }

          this.formsData = data;
          this.advanceTableForm = this.createContactForm();
       
    }
  
    onNoClick(){

    }
    confirmAdd(){
      
    }
    submit() 
    {
      //console.log(this.advanceTableForm.value);
    }
  ngOnInit(): void {
  }
  submitData() {
    if (this.advanceTableForm.valid) {
      const mobile = this.advanceTableForm.get('primarymobile').value;
      this.formDataArray.push({
        mobile: mobile,
      });
      this.dialogRef.close(this.formDataArray);
    }
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      
      primarymobile: [this.formsData?.customerMobile],
    });
}
}


