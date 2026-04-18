// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { SupplierRequiredDocumentService } from '../../supplierRequiredDocument.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SupplierRequiredDocument } from '../../supplierRequiredDocument.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { DocumentDropDown } from '../../documentDropDown.model';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentHolder 
{
  employeeID:number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public DocumentList?: DocumentDropDown[] = [];
  filteredDocumentOptions: Observable<DocumentDropDown[]>;
  searchDocument: FormControl = new FormControl();
  
  image: any;
  advanceTable: SupplierRequiredDocument;
  documentID: any;
  isLoading: boolean = false; 
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: SupplierRequiredDocumentService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Supplier Required Document';       
          this.dialogTitle ='Supplier Required Document';
          this.advanceTable = data.advanceTable;
          this.searchDocument.setValue(this.advanceTable.documentName);
          let validFrom=moment(this.advanceTable.validFrom).format('DD/MM/yyyy');
                                    let validTo=moment(this.advanceTable.validTo).format('DD/MM/yyyy');
                                    this.onBlurUpdateDateEdit(validFrom);
                                    this.onBlurUpdateEndDateEdit(validTo);
        } else 
        {
          //this.dialogTitle = 'Create Supplier Required Document';
          this.dialogTitle = 'Supplier Required Document';
          this.advanceTable = new SupplierRequiredDocument({});
          this.advanceTable.activationStatus=true;
          this.employeeID=data.employeeID;
         
        }
        this.advanceTableForm = this.createContactForm();
        //console.log(data.lastid);
  }
  public ngOnInit(): void
  {
  this.initDocument(); 
  }

  initDocument(){
  this._generalService.getDocument().subscribe(
    data=>
    {
      this.DocumentList=data;
      this.advanceTableForm.controls['searchDocument'].setValidators([Validators.required,
        this.documentValidator(this.DocumentList)
      ]);
      this.advanceTableForm.controls['searchDocument'].updateValueAndValidity();
      this.filteredDocumentOptions = this.advanceTableForm.controls['searchDocument'].valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || ''))
      ); 
    });
}

private _filter(value: string): any {
  const filterValue = value.toLowerCase();
  if (filterValue.length < 3) {
    return [];
  }
  return this.DocumentList.filter(
    customer => 
    {
      return customer.documentName.toLowerCase().includes(filterValue);
    }
  );
}

onDocumentSelected(selectedDocumentName: string) {
  // Find the selected document from the DocumentList
  const selectedDocument = this.DocumentList.find(
    document => document.documentName === selectedDocumentName
  );

  if (selectedDocument) {
    this.documentID = selectedDocument.documentID; // Set the documentID
    console.log('Document ID:', this.documentID); // Debug log to ensure correct documentID
    this.getTitles(this.documentID); // Call getTitles with the correct documentID
  } else {
    console.error('Selected document not found in the list');
  }
}

getTitles(documentID: any) {
  console.log('Fetching titles for Document ID:', documentID); // Debug log
  this.documentID = documentID;

  // Add your logic to handle the retrieved documentID here
  // For example: Make an API call or update the form field
}

documentValidator(DocumentList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = DocumentList.some(group => group.documentName.toLowerCase() === value);
    return match ? null : { documentInvalid: true };
  };
}

  // initDocument() {
  //   this._generalService.getDocument().subscribe(
  //     data =>
  //     {
  //        ;
  //       this.DocumentList = data;
  //       console.log(this.DocumentList);
  //     },
  //     error =>
  //     {
       
  //     }
  //   );
  //  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      supplierRequiredDocumentsID: [this.advanceTable.supplierRequiredDocumentsID],
      documentID: [this.advanceTable.documentID],
      validFrom: [this.advanceTable.validFrom,],
      validTo: [this.advanceTable.validTo],
      searchDocument:[this.advanceTable.documentName],
      requiredForSoftAttachment: [this.advanceTable.requiredForSoftAttachment,],
      requiredForFullAttachment: [this.advanceTable.requiredForFullAttachment],
      activationStatus: [this.advanceTable.activationStatus],

    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
} 

  submit() 
  {
    // emppty stuff
  }
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
    this.isLoading = true;  // Start loading spinner

    // Patch form values before sending
    this.advanceTableForm.patchValue({ documentID: this.documentID });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;  // Stop loading spinner
          if (response.activationStatus) {
            this.dialogRef.close();
            this._generalService.sendUpdate('SupplierRequiredDocumentCreate:SupplierRequiredDocumentView:Success');
          } else {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          }
          if (this.data.lastid) {
            this.showNotification(
              'snackbar-success',
              'Supplier Required Document Created Successfully...!!!',
              'bottom',
              'center'
            );
          }
        },
        error => {
          this.isLoading = false;  // Stop loading spinner in case of error
          this._generalService.sendUpdate('SupplierRequiredDocumentAll:SupplierRequiredDocumentView:Failure');
        }
      );
  }

  // Put method
  public Put(): void {
    this.isLoading = true;  // Start loading spinner

    // Patch form values before updating
    this.advanceTableForm.patchValue({ documentID: this.documentID || this.advanceTable.documentID });
    this.advanceTableForm.value.validFrom = moment(this.advanceTableForm.value.validFrom).format('DD-MM-YYYY');
    this.advanceTableForm.value.validTo = moment(this.advanceTableForm.value.validTo).format('DD-MMM-YYYY');

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;  // Stop loading spinner
          if (response.activationStatus) {
            this.dialogRef.close();
            this._generalService.sendUpdate('SupplierRequiredDocumentUpdate:SupplierRequiredDocumentView:Success');
          } else {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          }
        },
        error => {
          this.isLoading = false;  // Stop loading spinner in case of error
          this._generalService.sendUpdate('SupplierRequiredDocumentAll:SupplierRequiredDocumentView:Failure');
        }
      );
  }
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
     
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="SupplierRequiredDocumentCreate")
          {
            if(this.MessageArray[1]=="SupplierRequiredDocumentView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.showNotification(
                'snackbar-success',
                'Supplier Required Document Update Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
         
        }
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

  //start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('validFrom')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('validFrom')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.validFrom=formattedDate
  }
  else{
    this.advanceTableForm.get('validFrom')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('validFrom')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm.get('validTo')?.setValue(formattedDate);    
} else {
this.advanceTableForm.get('validTo')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.validTo=formattedDate
}
else{
  this.advanceTableForm.get('validTo')?.setValue(formattedDate);
}

} else {
this.advanceTableForm.get('validTo')?.setErrors({ invalidDate: true });
}
}
}



