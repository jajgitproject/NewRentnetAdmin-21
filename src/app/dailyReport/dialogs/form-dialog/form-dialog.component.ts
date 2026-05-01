// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DailyReportService } from '../../dailyReport.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DailyReport } from '../../dailyReport.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DailyReport;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DailyReportService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='ACRISS Code';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'ACRISS Code';
          this.advanceTable = new DailyReport({});
          this.advanceTable.activationStatus=true;
        }
        //this.advanceTableForm = this.createContactForm();
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
  
  // createContactForm(): FormGroup 
  // {
  //   return this.fb.group(
  //   {
  //     dailyReportDetailsID: [this.advanceTable.dailyReportDetailsID],
  //     dailyReportType: [this.advanceTable.dailyReportType],
  //     dailyReport: [this.advanceTable.dailyReport],
  //     dailyReportValue: [this.advanceTable.dailyReportValue],
  //     activationStatus: [this.advanceTable.activationStatus],
  //   });
  // }


  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  // public Post(): void
  // {
  //   this.advanceTableService.add(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //     response => 
  //     {
  //       
  
      
  //         this.dialogRef.close();
  //        this._generalService.sendUpdate('DailyReportCreate:DailyReportView:Success');//To Send Updates  
      
  //   },
  //   error =>
  //   {
  //      this._generalService.sendUpdate('DailyReportAll:DailyReportView:Failure');//To Send Updates  
  //   }
  // )
  // }
  // public Put(): void
  // {
  //   this.advanceTableService.update(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //     response => 
  //     {
  //       
  
      
  //         this.dialogRef.close();
  //        this._generalService.sendUpdate('DailyReportUpdate:DailyReportView:Success');//To Send Updates  
      
  //   },
  //   error =>
  //   {
  //    this._generalService.sendUpdate('DailyReportAll:DailyReportView:Failure');//To Send Updates  
  //   }
  // )
  // }
  // public confirmAdd(): void 
  // {
  //      if(this.action=="edit")
  //      {
  //         this.Put();
  //      }
  //      else
  //      {
  //         this.Post();
  //      }
  // }
}


