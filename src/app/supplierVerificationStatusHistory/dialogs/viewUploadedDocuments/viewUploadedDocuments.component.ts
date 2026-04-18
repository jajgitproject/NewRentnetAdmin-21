// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component,  Inject } from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { GeneralService } from 'src/app/general/general.service';
import { SupplierRequiredDocument } from 'src/app/supplierRequiredDocument/supplierRequiredDocument.model';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SupplierVerificationDocumentsService } from 'src/app/supplierVerificationDocuments/supplierVerificationDocuments.service';
import { SupplierVerificationDocuments } from 'src/app/supplierVerificationDocuments/supplierVerificationDocuments.model';

@Component({
  standalone: false,
  selector: 'app-viewUploadedDocuments',
  templateUrl: './viewUploadedDocuments.component.html',
  styleUrls: ['./viewUploadedDocuments.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ViewUploadedDocumentsComponent 
{
  displayedColumns: string[] = [
    'documentName',
    'supplierRequiredDocumentsImage',
    'supplierRequiredDocumentsNumber',
    'supplierRequiredDocumentAdditionDate',
    'supplierRequiredDocumentNonAvailabilityReason',
    'activationStatus',
  ];
  SearchValidTo: string = '';
  SearchValidFrom: string = '';
  ActiveStatus: any;
  supplier_ID: any;
  Employee_ID: any;
  supplier_Name: any;
  SearchNumbers: string = '';
  SearchReasonNon:string='';
  dataSource: SupplierVerificationDocuments[] | null;
  public DocumentList?: DocumentDropDown[] = [];
  search : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number=0;
  SearchsupplierRequiredDocumentAdditionDatethis:string='';
  constructor(
    public _generalService:GeneralService,
    public supplierVerificationDocumentsService: SupplierVerificationDocumentsService,
  public dialog: MatDialogRef<ViewUploadedDocumentsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.supplier_ID=data.supplier_ID;
    console.log(this.supplier_ID)   
  }

  public ngOnInit(): void
  {
    this.loadData();
  }

  public loadData() 
   {
      this.supplierVerificationDocumentsService.getTableData(this.supplier_ID,this.search.value,this.SearchNumbers,this.SearchReasonNon, this.SearchsupplierRequiredDocumentAdditionDatethis,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
          this.dataSource.forEach((element)=>{
            if(element.activationStatus===true){
              this.ActiveStatus="Active"
            }
            else{
              this.ActiveStatus="Deleted"
            }
       
          })
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
  }
 
  InitRequiredData(){
    this._generalService.GetViewRequiredDocument(this.data.supplier_ID).subscribe
    (
      data =>   
      {
        this.DocumentList = data;
      }
    );
  }
}




