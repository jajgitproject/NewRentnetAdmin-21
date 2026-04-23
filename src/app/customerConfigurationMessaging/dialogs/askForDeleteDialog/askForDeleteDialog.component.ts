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
  selector: 'app-askForDeleteDialog',
  templateUrl: './askForDeleteDialog.component.html',
  styleUrls: ['./askForDeleteDialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class AskForDeleteDialogComponent 
{  
  action: string;
  dialogTitle: string;
  advanceTable: CustomerConfigurationMessaging;
  public DocumentList?: DocumentDropDown[] = [];
  constructor(

  public dialog: MatDialogRef<AskForDeleteDialogComponent>,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerConfigurationMessagingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    
   
  }

  public ngOnInit(): void
  {

  }
 

  CloseDialog(){
    this.dialog.close();
  }
  confirmDelete()
  {
   this.dialog.close();
    this.advanceTableService.delete(this.data.CustomerConfigurationMessagingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerConfigurationMessagingDelete:CustomerConfigurationMessagingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerConfigurationMessagingAll:CustomerConfigurationMessagingView:Failure');//To Send Updates  
    }
    )
  }
  
}




