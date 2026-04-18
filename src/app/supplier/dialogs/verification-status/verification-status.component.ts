// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component,  Inject } from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SupplierVerificationStatusHistory } from 'src/app/supplierVerificationStatusHistory/supplierVerificationStatusHistory.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SupplierVerificationStatusHistoryService } from 'src/app/supplierVerificationStatusHistory/supplierVerificationStatusHistory.service';

@Component({
  standalone: false,
  selector: 'app-verification-status',
  templateUrl: './verification-status.component.html',
  styleUrls: ['./verification-status.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class VerificationstatusComponent 
{
  displayedColumns = [
    'supplierName',
    'supplierVerificationStatus',
    'supplierVerificationStatusDate'
  ];
  dataSource: SupplierVerificationStatusHistory[] | null;
  Supplier_ID:any;
  SearchStatus: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  constructor(
    public supplierVerificationStatusHistoryService: SupplierVerificationStatusHistoryService,
  public dialog: MatDialogRef<VerificationstatusComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.Supplier_ID=data.supplier_ID
    console.log(this.Supplier_ID)   
  }

  public ngOnInit(): void
  {
    this.loadData();
  }

  public loadData() 
  {
     this.supplierVerificationStatusHistoryService.getTableData(this.SearchStatus,this.Supplier_ID, this.SearchActivationStatus, this.PageNumber).subscribe
     (
       data =>   
       {
         this.dataSource = data;

       },
       (error: HttpErrorResponse) => { this.dataSource = null;}
     );
 }
  
}




