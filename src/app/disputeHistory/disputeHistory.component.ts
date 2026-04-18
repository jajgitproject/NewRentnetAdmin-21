// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DisputeHistoryService } from './disputeHistory.service';
import { DisputeHistory } from './disputeHistory.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { GeneralService } from '../general/general.service';
import { DisputeService } from '../dispute/dispute.service';
import { ActivatedRoute } from '@angular/router';
import { Dispute } from '../dispute/dispute.model';

@Component({
  standalone: false,
  selector: 'app-disputeHistory',
  templateUrl: './disputeHistory.component.html',
  styleUrls: ['./disputeHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DisputeHistoryComponent {
  dataSource: DisputeHistory[] = [];

  dialogTitle: string;
  reservationID: number;
  PageNumber: number = 0;
  DutySlipForBillingID: number;
    public EmployeeList?: EmployeeDropDown[] = [];
  disputeHistoryBy:string;
noRecords: any;
  DutySlipID: any;
  disputeAdvanceTable:Dispute[] | null;

  constructor(
    public dialogRef: MatDialogRef<DisputeHistoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    public disputeHistoryService: DisputeHistoryService,
    public _generalService:GeneralService,
    private disputeService: DisputeService,
    private route:ActivatedRoute
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Dispute History';
    this.reservationID = data.reservationID;
    this.DutySlipForBillingID = data.dutySlipForBillingID;
    console.log(this.reservationID, this.DutySlipForBillingID)
  }

  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedDutySlipID = paramsData.dutySlipID;
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));         
    });
    this.DisputeLoadData();
    this.uploadedByName();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadedByName(){
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>{
        this.EmployeeList=data;
        this.disputeHistoryBy=this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName;
        console.log(this.disputeHistoryBy)
      }
    );
  }
  public disputeLoadData() 
  {
    
    console.log(this.DutySlipForBillingID);
    this.disputeService.getTableData(this.DutySlipForBillingID, this.PageNumber, 'Descending').subscribe
    (
      data => 
        {
        
          if(data !== null && data.length > 0)
            {
              this.dataSource = data;
            } else {
              this.dataSource = [];
              this.noRecords = 'No Records Found';
            }
        },
      (error: HttpErrorResponse) => { 
        console.error('API Error:', error);
      this.dataSource = [];
      this.noRecords = 'Error loading data';
      }
    );
  }


  public DisputeLoadData() 
  {
    debugger
    this.disputeService.getDisputeInfo(this.DutySlipID).subscribe
    (
      data => 
        {
        
          if(data !== null && data.length > 0)
            {
              this.dataSource = data;
            } else {
              this.dataSource = [];
              this.noRecords = 'No Records Found';
            }
        },
      (error: HttpErrorResponse) => { this.disputeAdvanceTable = null;}
    );
  }

}


