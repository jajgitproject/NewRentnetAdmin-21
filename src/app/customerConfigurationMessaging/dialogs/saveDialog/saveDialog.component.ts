// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component,  ElementRef,  Inject } from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { GeneralService } from 'src/app/general/general.service';
import { CustomerConfigurationMessagingService } from '../../customerConfigurationMessaging.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { CustomerConfigurationMessaging } from '../../customerConfigurationMessaging.model';


@Component({
  standalone: false,
  selector: 'app-saveDialog',
  templateUrl: './saveDialog.component.html',
  styleUrls: ['./saveDialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class SaveDialogComponent 
{  
  action: string;
  dialogTitle: string;
  advanceTable: CustomerConfigurationMessaging;
  public DocumentList?: DocumentDropDown[] = [];
  CustomerID: any;
  constructor(

  public dialog: MatDialogRef<SaveDialogComponent>,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerConfigurationMessagingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    
   this.CustomerID=data.customerID;
  }

  public ngOnInit(): void
  {

  }
 

  CloseDialog(){
    this.dialog.close();
  }
 
  public Post(): void
  {
    this.dialog.close();
    this.data.advanceTableForm.patchValue({customerID:this.CustomerID});
    this.advanceTableService.add(this.data.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     

        this.data.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationMessagingCreate:CustomerConfigurationMessagingView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('CustomerConfigurationMessagingAll:CustomerConfigurationMessagingView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.dialog.close();
    this.data.advanceTableForm.patchValue({customerID:this.CustomerID});
    this.advanceTableService.update(this.data.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
      
        this.data.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationMessagingUpdate:CustomerConfigurationMessagingView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerConfigurationMessagingAll:CustomerConfigurationMessagingView:Failure');//To Send Updates  
    }
  )
  }
  public confirmAdd(): void 
  {
       if(this.data.actions==="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
}




