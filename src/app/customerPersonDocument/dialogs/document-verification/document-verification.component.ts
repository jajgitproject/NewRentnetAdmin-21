// @ts-nocheck
		
		import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
    import { Component,  ElementRef,  Inject } from '@angular/core';
    
    import { MAT_DATE_LOCALE } from '@angular/material/core';
    import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
    import { GeneralService } from 'src/app/general/general.service';
    
    import { FormBuilder, FormGroup } from '@angular/forms';
    import { CustomerPersonDocumentService } from '../../customerPersonDocument.service';
    //import { FormDialogComponent } from '../form-dialog/form-dialog.component';
    
    
    
    @Component({
  standalone: false,
      selector: 'app-document-verification',
      templateUrl: './document-verification.component.html',
      styleUrls: ['./document-verification.component.sass'],
      providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
    })
    
    export class DocumentVerificationsComponent 
    {  
      action: string;
      dialogTitle: string;
      advanceTable: CustomerPersonDocumentService;
      public DocumentList?: DocumentDropDown[] = [];
      constructor(
    
      public dialog: MatDialogRef<DocumentVerificationsComponent>,
      //public dialogRef: MatDialogRef<FormDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      public advanceTableService: CustomerPersonDocumentService,
        private fb: FormBuilder,
        private el: ElementRef,
      public _generalService:GeneralService)
      {
        
       
      }
    
      public ngOnInit(): void
      {
    
      }
     
    
      onNoClick(){
        this.dialog.close();
      }
      public Put(): void
      {
        this.dialog.close();
        this.data.advanceTableForm.patchValue({addressCityID:this.data.addressCityID || this.data.advanceTable.addressCityID});
        this.data.advanceTableForm.patchValue({customerPersonID:this.data.advanceTable.customerPersonID});
        this.advanceTableService.update(this.data.advanceTableForm.getRawValue())  
        .subscribe(
        response => 
        {
            this.data.dialogRef.close();
           this._generalService.sendUpdate('CustomerPersonDocumentUpdate:CustomerPersonDocumentView:Success');//To Send Updates 
             
        },
        error =>
        {
         this._generalService.sendUpdate('CustomerPersonDocumentAll:CustomerPersonDocumentView:Failure');//To Send Updates  
        }
      )
      }
     
      
     
    }
    

