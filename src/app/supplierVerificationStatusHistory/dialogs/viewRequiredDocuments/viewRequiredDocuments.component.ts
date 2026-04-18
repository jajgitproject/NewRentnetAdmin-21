// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component,  Inject } from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { GeneralService } from 'src/app/general/general.service';
import { SupplierRequiredDocument } from 'src/app/supplierRequiredDocument/supplierRequiredDocument.model';
import moment from 'moment';
import { SupplierRequiredDocumentService } from 'src/app/supplierRequiredDocument/supplierRequiredDocument.service';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SupplierVerificationStatusHistoryService } from '../../supplierVerificationStatusHistory.service';


@Component({
  standalone: false,
  selector: 'app-viewRequiredDocuments',
  templateUrl: './viewRequiredDocuments.component.html',
  styleUrls: ['./viewRequiredDocuments.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ViewRequiredDocumentsComponent 
{
  displayedColumns: string[] = [
    'documentName',
    'RequiredForSoftAttachment', 
    'RequiredForFullAttachment',
    'validFrom',
    'validTo',
    'activationStatus',
  ];
  SearchValidTo: string = '';
  SearchValidFrom: string = '';
  dataSource: SupplierRequiredDocument[] | null;
  public DocumentList?: DocumentDropDown[] = [];
  search : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number=0;
  StatusDate: string = '';
  constructor(
    public _generalService:GeneralService,
    public supplierRequiredDocumentService: SupplierRequiredDocumentService,
    public supplierVerificationStatusHistoryService:SupplierVerificationStatusHistoryService,
  public dialog: MatDialogRef<ViewRequiredDocumentsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.SearchValidFrom = data.SearchValidFrom;   
  }

  public ngOnInit(): void
  {
    this.loadData();
    //this.loadDataByDate();
  }

  public loadData() 
  {
      this.supplierRequiredDocumentService.viewSRD(this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
     
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
   
  }

  public loadDataByDate() 
  {
    this.supplierVerificationStatusHistoryService.getDataByDate(this.StatusDate).subscribe
    (
      data =>   
      {
        this.dataSource = data;
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





