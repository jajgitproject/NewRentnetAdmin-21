// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SendSMS } from '../../sendSMS.model';
import { SendSMSService } from '../../sendSMS.service';
import { GeneralService } from 'src/app/general/general.service';

@Component({
  standalone: false,
  selector: 'app-passenger-email',
  templateUrl: './passenger-email.component.html',
  styleUrls: ['./passenger-email.component.sass']
})
export class PassengerEmailComponent implements OnInit {
    showError: string;
    action: string;
    dialogTitle: string;
    advanceTableForm: FormGroup;
    advanceTable: SendSMS;
    formsData: any;
    formDataArray = [];
  constructor(public dialogRef: MatDialogRef<PassengerEmailComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: SendSMSService,
      private fb: FormBuilder,
    private formBuilder: FormBuilder,
    public _generalService:GeneralService)
    {
          // Set the defaults
          this.action = data.action;
          this.advanceTableForm = this.formBuilder.group({
            primaryEmail: ['', Validators.required]

          });
      
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
    submit() 
    {
    }


    saveData() {
        if (this.advanceTableForm.valid) {
          const email = this.advanceTableForm.get('primaryEmail').value;
          this.formDataArray.push({

            email: email
          });
          this.dialogRef.close(this.formDataArray);
        }
      }
  ngOnInit(): void {
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      
        primaryEmail: [this.formsData?.customerEmail],
    
    });
  }


  
  onNoClick(){

  }
  confirmAdd(){

  }

}


