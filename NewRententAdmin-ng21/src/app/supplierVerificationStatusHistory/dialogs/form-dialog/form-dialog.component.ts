// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierVerificationStatusHistoryService } from '../../supplierVerificationStatusHistory.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SupplierVerificationStatusHistory } from '../../supplierVerificationStatusHistory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { ViewRequiredDocumentsComponent } from '../viewRequiredDocuments/viewRequiredDocuments.component';
import { SupplierRequiredDocument } from 'src/app/supplierRequiredDocument/supplierRequiredDocument.model';
import moment from 'moment';
import { SupplierRequiredDocumentService } from 'src/app/supplierRequiredDocument/supplierRequiredDocument.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewUploadedDocumentsComponent } from '../viewUploadedDocuments/viewUploadedDocuments.component';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SupplierVerificationStatusHistory;
  SearchValidTo: any;
  SearchValidFrom: string = '';
  isLoading: boolean = false;
  dataSource: SupplierRequiredDocument[] | null;
  search : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number=0;
  constructor(
    public ViewRequiredDocumentDialog: MatDialog,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierVerificationStatusHistoryService,
  public supplierRequiredDocumentService: SupplierRequiredDocumentService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Supplier Verification Status History';       
          this.dialogTitle ='Supplier History';
          this.advanceTable = data.advanceTable;
          this.SearchValidTo=this.advanceTable.supplierVerificationStatusDate
        } else 
        {
          //this.dialogTitle = 'Create Supplier Verification Status History';
          this.dialogTitle = 'Supplier History';
          this.advanceTable = new SupplierVerificationStatusHistory({});
          this.advanceTable.supplierID=data.SUPPLIERID;
         this.advanceTable.supplierName=data.SUPPLIERNAME;
        }
        this.advanceTableForm = this.createContactForm();
  }
  openViewRequiredDocument(){
    this.ViewRequiredDocumentDialog.open(ViewRequiredDocumentsComponent, 
    {
      width: '60%',
      data: 
        {
          supplier_ID:this.advanceTable.supplierID,
          SearchValidFrom:this.advanceTable.supplierVerificationStatusDate,
        }
    });

  }
  
  openViewUploadedDocument(){
    this.ViewRequiredDocumentDialog.open(ViewUploadedDocumentsComponent, 
      {
        width: '60%',
        data: 
          {
            supplier_ID:this.advanceTable.supplierID,
          }
      });
  }
  
  public loadData() 
  {
    if(this.SearchValidTo!==""){
      this.SearchValidTo=moment(this.SearchValidTo).format('MMM DD yyyy');
    }
    if(this.SearchValidFrom!==""){
      this.SearchValidFrom=moment(this.SearchValidFrom).format('MMM DD yyyy');
    } 

      this.supplierRequiredDocumentService.getTableData(this.search.value,this.SearchValidFrom,this.SearchValidTo,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
     
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
   
  }

  public ngOnInit(): void
  {
    //this.loadData();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      //supplierVerificationStatusHistoryID: [this.advanceTable.supplierVerificationStatusHistoryID],
      supplierID: [this.advanceTable.supplierID],
      supplierVerificationStatus: [this.advanceTable.supplierVerificationStatus],
      supplierVerificationStatusRemark: [this.advanceTable.supplierVerificationStatusRemark],
      supplierVerificationStatusByEmployeeID: [this.advanceTable.supplierVerificationStatusByEmployeeID],
      supplierName: [this.advanceTable.supplierName],
      supplierVerificationStatusDate: [this.advanceTable.supplierVerificationStatusDate]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() {}
  
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void {
    this.isLoading = true;  // Start loading

    // Patch form with necessary values
    this.advanceTableForm.patchValue({ supplierID: this.data.SUPPLIERID });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierVerificationStatusHistoryCreate:SupplierVerificationStatusHistoryView:Success');
          this.isLoading = false;  // Stop loading
        },
        error => {
          this._generalService.sendUpdate('SupplierVerificationStatusHistoryAll:SupplierVerificationStatusHistoryView:Failure');
          this.isLoading = false;  // Stop loading
        }
      );
  }

  // Function for handling 'Put' request (Update data)
  public Put(): void {
    this.isLoading = true;  // Start loading

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierVerificationStatusHistoryUpdate:SupplierVerificationStatusHistoryView:Success');
          this.isLoading = false;  // Stop loading
        },
        error => {
          this._generalService.sendUpdate('SupplierVerificationStatusHistoryAll:SupplierVerificationStatusHistoryView:Failure');
          this.isLoading = false;  // Stop loading
        }
      );
  }
  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
}



