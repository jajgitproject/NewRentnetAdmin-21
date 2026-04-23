// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Supplier } from '../../supplier.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { SupplierActivationStatusHistoryService } from 'src/app/supplierActivationStatusHistory/supplierActivationStatusHistory.service';
import { SupplierActivationStatusHistory } from 'src/app/supplierActivationStatusHistory/supplierActivationStatusHistory.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: false,
  selector: 'app-supplier-status',
  templateUrl: './supplier-status.component.html',
  styleUrls: ['./supplier-status.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class SupplierStatusComponent 
{
  displayedColumns = [
    'supplierName',
    'supplierStatus',
    'supplierStatusReason',
    'statusBy',
    'supplierStatusDate'
  ];
  dataSource: SupplierActivationStatusHistory[] | null;
  supplierStatus: string = '';
  PageNumber: number = 0;
  Supplier_ID: any;
  
  supplierStatusReason: string = '';
  supplierStatusByEmployeeName: string = '';
  supplierStatusDate: string = '';
  constructor(
  public supplierActivationStatusHistoryService: SupplierActivationStatusHistoryService,
  public dialog: MatDialogRef<SupplierStatusComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any)
  {
       this.Supplier_ID=data.supplier_ID
  }
  public ngOnInit(): void
  {
    this.loadData();
  }

  public loadData() 
   {
      this.supplierActivationStatusHistoryService.getTableData(this.supplierStatus,this.Supplier_ID,this.supplierStatusReason,this.supplierStatusByEmployeeName,this.supplierStatusDate, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



