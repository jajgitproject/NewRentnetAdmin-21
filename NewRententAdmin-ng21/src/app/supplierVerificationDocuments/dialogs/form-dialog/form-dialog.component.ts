// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SupplierVerificationDocumentsService } from '../../supplierVerificationDocuments.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { SupplierVerificationDocuments } from '../../supplierVerificationDocuments.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
//import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentDocument } from 'src/app/document/dialogs/form-dialog/form-dialog.component';
import moment from 'moment';

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
  public DocumentList?: DocumentDropDown[] = [];
  public employeeLists?:EmployeeDropDown[]=[];
  advanceTable: SupplierVerificationDocuments;
  filteredDocumentOptions: Observable<DocumentDropDown[]>;
  supplierRequiredDocumentsID: any;
  documentName: any;
  isLoading: boolean = false;
  errorMessage: string = ''; 
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  private dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierVerificationDocumentsService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Supplier Verification Document';       
          // this.dialogTitle ='Supplier Verification Document';
          this.dialogTitle ='Upload Document';
          this.advanceTable = data.advanceTable;
          let supplierRequiredDocumentAdditionDate = moment(this.advanceTable.supplierRequiredDocumentAdditionDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(supplierRequiredDocumentAdditionDate);
          let validTillDate = moment(this.advanceTable.validTill).format('DD/MM/yyyy');
          this.onBlurValidTillDateEdit(validTillDate);
          this.ImagePath=this.advanceTable.supplierRequiredDocumentsImage;
          this.documentName?.setValue(this.advanceTable.documentName);
          //this.advanceTableForm.patchValue({supplierRequiredDocumentAddedByEmployeeID:this.data.EmployeeID});
        } else 
        {
          //this.dialogTitle = 'Create Supplier Verification Document';
          // this.dialogTitle = 'Supplier Verification Document';
          this.dialogTitle ='Upload Document';
          this.advanceTable = new SupplierVerificationDocuments({});
          this.advanceTable.activationStatus=true;
         this.advanceTable.supplierName=data.SUPPLIERNAME;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.getEmployee();
    this.InitDocument();
    this._generalService.GetDocumentRequired().subscribe
    (
      data =>   
      {
        //this.DocumentList = data;
     
      }
    );
  }

  documentValidator(DocumentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = DocumentList.some(group => group.documentName.toLowerCase() === value);
      return match ? null : { searchDocumentInvalid: true };
    };
  }
  InitDocument(){
    this._generalService.GetDocumentRequired().subscribe(
      data=>
      {
        this.DocumentList=data;
        this.advanceTableForm.controls['documentName'].setValidators([this.documentValidator(this.DocumentList)
        ]);
        this.advanceTableForm.controls['documentName'].updateValueAndValidity();
        this.filteredDocumentOptions = this.advanceTableForm.controls['documentName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only filter when 3 or more characters are typed
  if (filterValue.length < 3) {
    return [];
  }

  return this.DocumentList.filter(customer =>
    customer.documentName.toLowerCase().indexOf(filterValue) === 0
  );
}

  
  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.DocumentList.filter(
  //     customer => 
  //     {
  //       return customer.documentName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  onDocumentSelected(selectedDocument: string) {
    const selectedValue = this.DocumentList.find(
      data => data.documentName === selectedDocument
    );
  
    if (selectedValue) {
      this.getTitles(selectedValue.documentID);
    }
  }
  
  getTitles(documentID: any) {
    this.supplierRequiredDocumentsID=documentID;
  
    this.advanceTableForm.patchValue({supplierRequiredDocumentsID:this.supplierRequiredDocumentsID });
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      supplierVerificationDocumentsID: [this.advanceTable.supplierVerificationDocumentsID],
      supplierRequiredDocumentsID: [this.advanceTable.supplierRequiredDocumentsID],
      supplierID: [this.advanceTable.supplierID],
      supplierName: [this.advanceTable.supplierName],
      documentName:[this.advanceTable.documentName],
      supplierRequiredDocumentsImage: [this.advanceTable.supplierRequiredDocumentsImage],
      supplierRequiredDocumentsNumber: [this.advanceTable.supplierRequiredDocumentsNumber],
      supplierRequiredDocumentNonAvailabilityReason: [this.advanceTable.supplierRequiredDocumentNonAvailabilityReason],
      supplierRequiredDocumentAddedByEmployeeID: [this.advanceTable.supplierRequiredDocumentAddedByEmployeeID],
      supplierRequiredDocumentAdditionDate: [this.advanceTable.supplierRequiredDocumentAdditionDate,[Validators.required,this._generalService.dateValidator()]],
      activationStatus: [this.advanceTable.activationStatus],
      employeeName: [this.advanceTable.employeeName],
      validTill: [this.advanceTable.validTill,[Validators.required,this._generalService.dateValidator()]]
    });
  }

  //start date
     onBlurUpdateDate(value: string): void {
         value= this._generalService.resetDateiflessthan12(value);
       
       const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
       if (validDate) {
         const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
           this.advanceTableForm.get('supplierRequiredDocumentAdditionDate')?.setValue(formattedDate);    
       } else {
         this.advanceTableForm.get('supplierRequiredDocumentAdditionDate')?.setErrors({ invalidDate: true });
       }
     }
     
     onBlurUpdateDateEdit(value: string): void {  
       const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
       if (validDate) {
         const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
         if(this.action==='edit')
         {
           this.advanceTable.supplierRequiredDocumentAdditionDate=formattedDate
         }
         else{
           this.advanceTableForm.get('supplierRequiredDocumentAdditionDate')?.setValue(formattedDate);
         }
         
       } else {
         this.advanceTableForm.get('supplierRequiredDocumentAdditionDate')?.setErrors({ invalidDate: true });
       }
     }



     //Valid till date
     onBlurValidTillDate(value: string): void {
         value= this._generalService.resetDateiflessthan12(value);
       
       const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
       if (validDate) {
         const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
           this.advanceTableForm.get('validTill')?.setValue(formattedDate);    
       } else {
         this.advanceTableForm.get('validTill')?.setErrors({ invalidDate: true });
       }
     }
     
     onBlurValidTillDateEdit(value: string): void {  
       const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
       if (validDate) {
         const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
         if(this.action==='edit')
         {
           this.advanceTable.validTill=formattedDate
         }
         else{
           this.advanceTableForm.get('validTill')?.setValue(formattedDate);
         }
         
       } else {
         this.advanceTableForm.get('validTill')?.setErrors({ invalidDate: true });
       }
     }
     
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    
  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.ImagePath="";
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void {
    this.isLoading = true;  // Start loading
    this.errorMessage = ''; // Reset any previous error message

    // Patch form with necessary values
    this.advanceTableForm.patchValue({
      supplierID: this.data.SUPPLIERID,
      supplierRequiredDocumentAddedByEmployeeID: this.data.EmployeeID
    });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierVerificationDocumentsCreate:SupplierVerificationDocumentsView:Success');
          this.isLoading = false;  // Stop loading
        },
        error => {
          this.errorMessage = 'Failed to save the document. Please try again later.';  // Show error message
          this._generalService.sendUpdate('SupplierVerificationDocumentsAll:SupplierVerificationDocumentsView:Failure');
          this.isLoading = false;  // Stop loading
        }
      );
  }

  // Function for handling 'Put' request (Update data)
  public Put(): void {
    this.isLoading = true;  // Start loading
    this.errorMessage = ''; // Reset any previous error message

    this.advanceTableForm.patchValue({
      supplierRequiredDocumentAddedByEmployeeID: this.advanceTable.supplierRequiredDocumentAddedByEmployeeID,
      supplierRequiredDocumentsID: this.supplierRequiredDocumentsID || this.advanceTable.supplierRequiredDocumentsID
    });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierVerificationDocumentsUpdate:SupplierVerificationDocumentsView:Success');
          this.isLoading = false;  // Stop loading
        },
        error => {
          this.errorMessage = 'Failed to update the document. Please try again later.';  // Show error message
          this._generalService.sendUpdate('SupplierVerificationDocumentsAll:SupplierVerificationDocumentsView:Failure');
          this.isLoading = false;  // Stop loading
        }
      );
  }

  getEmployee(){
  
    this._generalService.getEmployeeID(this.data.EmployeeID || this.advanceTable.supplierRequiredDocumentAddedByEmployeeID).subscribe(
      data=>{
       this.employeeLists=data;
       this.advanceTableForm.patchValue({employeeName:this.employeeLists[0].firstName+' '+ this.employeeLists[0].lastName});
      }
    )
    }

   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   //public ImagePath1: string = "";
   public uploadFinished = (event) => 
   {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({supplierRequiredDocumentsImage:this.ImagePath})
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

  openDocument()
  {
    const dialogRef = this.dialog.open(FormDialogComponentDocument, 
      {
        data: 
          {
            action: 'fromVD',
          }
      });
      dialogRef.afterClosed().subscribe(res => {
            this.InitDocument();
      })
  }
}



