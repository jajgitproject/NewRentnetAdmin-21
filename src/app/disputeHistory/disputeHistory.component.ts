// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  standalone: true,
  selector: 'app-disputeHistory',
  templateUrl: './disputeHistory.component.html',
  styleUrls: ['./disputeHistory.component.sass'],
  imports: [CommonModule, MatDialogModule, MatCardModule, MatIconModule, MatButtonModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisputeHistoryComponent {
  dataSource: DisputeHistory[] = [];
  historyReady: boolean = false;

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
    private route:ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Dispute History';
    this.reservationID = data.reservationID;
    this.DutySlipForBillingID = data.dutySlipForBillingID;
  }

  ngOnInit() 
  {
    this.historyReady = false;
    this.noRecords = 'No Records Found';
    const dutySlipIDFromDialog = this.data?.dutySlipID;
    if (dutySlipIDFromDialog) {
      this.DutySlipID = dutySlipIDFromDialog;
      setTimeout(() => this.DisputeLoadData());
    } else {
      this.route.queryParams.subscribe(paramsData =>{
        const encryptedDutySlipID = paramsData.dutySlipID;
        if (encryptedDutySlipID) {
          this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));
          setTimeout(() => this.DisputeLoadData());
        } else {
          this.dataSource = [];
          this.noRecords = 'No dispute history available';
          this.historyReady = true;
        }
      });
    }
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
      }
    );
  }
  public disputeLoadData() 
  {
    
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
    this.historyReady = false;
    this.disputeService.getDisputeInfo(this.DutySlipID).subscribe
    (
      data => 
        {
          const normalizedData = Array.isArray(data) ? [...data] : [];
          setTimeout(() => {
            if(normalizedData.length > 0) {
              this.dataSource = normalizedData;
            } else {
              this.dataSource = [];
              this.noRecords = 'No Records Found';
            }
            this.historyReady = true;
            this.cdr.markForCheck();
          });
        },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.disputeAdvanceTable = null;
          this.dataSource = [];
          this.noRecords = 'Error loading dispute history';
          this.historyReady = true;
          this.cdr.markForCheck();
        });
      }
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

}


