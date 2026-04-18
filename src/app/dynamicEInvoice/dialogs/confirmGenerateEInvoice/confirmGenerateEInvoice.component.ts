// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { GenerateEInvoiceService } from '../../../generateEInvoice/generateEInvoice.service';
import { GenerateEInvoiceModel } from '../../../generateEInvoice/generateEInvoice.model';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-confirmGenerateEInvoice',
  templateUrl: './confirmGenerateEInvoice.component.html',
  styleUrls: ['./confirmGenerateEInvoice.component.sass']
})
export class ConfirmGenerateEInvoiceComponent
{
  dataSource: GenerateEInvoiceModel[] | null;
  action: any;
  SearchFromDate: string;
  SearchToDate: string;
  SearchInvoiceNumber: any;
  customer: any;
  SearchIRNStatus: string;
  PageNumber: number = 0;
  constructor(
    public dialogRef: MatDialogRef<ConfirmGenerateEInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public generateEInvoiceService: GenerateEInvoiceService,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  )
  {
    this.data = data.data;
    this.action = data.action;
    this.SearchInvoiceNumber = data.SearchInvoiceNumber;
    this.SearchFromDate = data.SearchFromDate;
    this.SearchToDate = data.SearchToDate;
    this.customer = data.customer;
    this.SearchIRNStatus = data.SearchIRNStatus;
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public GenerateEInvoice()
  {
    let requestPayload = new GenerateEInvoiceModel;
    requestPayload.invoiceNo   = this.data.invoiceNumberWithPrefix;
    requestPayload.invoiceType = this.data.invoiceType === 'InvoiceGeneral' ? 'General' : 'Corporate';
    this.generateEInvoiceService.generateEInvoice(requestPayload).subscribe(
    response => 
    {
      if (response?.result) 
      {
        Swal.fire({
                  title: response.result,
                  //icon: 'error'
                });
      } 
      else 
      {
        this.dialogRef.close(true);
        this.showNotification(
          'snackbar-success',
          'E - Invoice Generated Successfully...!!!',
          'bottom',
          'center'
        );
      }
      this.loadData();
    },
    error =>
    {
      const errorMessage = error || 'Operation Failed.....!!!';
      Swal.fire({
                title: errorMessage,
                icon: 'error'
              });
    })
  }


  CancelEInvoice()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: this.data
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === true) 
      {
        this.loadData();
      }
    });
  }

  public loadData() 
  {
    if(this.SearchFromDate!=="")
    {
      this.SearchFromDate=moment(this.SearchFromDate).format('yyyy-MM-DD');
    }
    if(this.SearchToDate!=="")
    {
      this.SearchToDate=moment(this.SearchToDate).format('yyyy-MM-DD');
    }
    this.generateEInvoiceService.getTableData(this.SearchInvoiceNumber.replace(/\//g, '-'),this.SearchFromDate,this.SearchToDate,this.customer,this.SearchIRNStatus,this.PageNumber).subscribe
    (
      data => {
          this.dataSource = data;
        },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
}



