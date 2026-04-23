// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ModeOfPaymentChangeService } from './modeOfPaymentChanges.service';
import { ModeOfPaymentChange } from './modeOfPaymentChanges.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { GeneralService } from '../general/general.service';

@Component({
  standalone: false,
  selector: 'app-modeOfPaymentChanges',
  templateUrl: './modeOfPaymentChanges.component.html',
  styleUrls: ['./modeOfPaymentChanges.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ModeOfPaymentChangeComponent {
  dialogTitle: string;
  reservationID: number;
    public EmployeeList?: EmployeeDropDown[] = [];
  dataSource: ModeOfPaymentChange | null;
  modeOfPaymentChangeBy:string;
noRecords: any;

  constructor(
    public dialogRef: MatDialogRef<ModeOfPaymentChangeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public modeOfPaymentChangeService: ModeOfPaymentChangeService,
    public _generalService:GeneralService
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Mode Of Payment History';
    this.reservationID = data.reservationID;
  
  }

  ngOnInit() {
    this.ModeOfPaymentChangeLoadData();
    this.uploadedByName();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadedByName(){
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>{
        this.EmployeeList=data;
        this.modeOfPaymentChangeBy=this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName;
      }
    );
  }
  public ModeOfPaymentChangeLoadData() 
  {
     this.modeOfPaymentChangeService.getModeOfPaymentChangeDetails(this.reservationID).subscribe
     (
      (data) =>   
        {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource=null }
    );
  }

}


