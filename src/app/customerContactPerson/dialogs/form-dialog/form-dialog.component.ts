// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerContactPersonService } from '../../customerContactPerson.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerContactPerson } from '../../customerContactPerson.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { CustomerCategoryDropDown } from 'src/app/customerCategory/customerCategoryDropDown.model';
import { CustomerDepartmentDropDown } from 'src/app/customerDepartment/customerDepartmentDropDown.model';
import { CurrentDesginationDropDown } from 'src/app/currentDesgination/currentDesginationDropDown.model';
//import { CustomerDesignationDropDown, CustomerDesignationtDropDown } from 'src/app/customerDesignation/customerDesignationDropDown.model';
import { SalutationDropDown } from 'src/app/general/salutationDropDown.model';
import { CustomerDesignationDropDown } from 'src/app/customerDesignation/customerDesignationDropDown.model';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerContactPerson;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  //public customerCategoryList?: CustomerCategoryDropDown[] = [];
  public DepartmentList?: CustomerDepartmentDropDown[] = [];
  public DesginationList?:CustomerDesignationDropDown[]=[];
  public SalutationList?:SalutationDropDown[]=[];

  image: any;
  fileUploadEl: any;
  CustomerID!: number;
  CustomerName!: string;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerContactPersonService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.CustomerID= data.customerID,
        this.CustomerName =data.customerName,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Contact Person';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Contact Person';
          this.advanceTable = new CustomerContactPerson({});
          this.advanceTable.isActive=true;
          //this.advanceTable.supplierName=data.SUPPLIERNAME;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.initCustomerDepartment();
    this.initCustomerDesignation();
    this.initgetSalutations();
    
  }
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

  initCustomerDepartment(){
    this._generalService.getCustomerDepartments().subscribe
    (
      data =>   
      {
        this.DepartmentList = data;
       
      }
    );
  }

  initCustomerDesignation(){
    this._generalService.getCustomerDesignations().subscribe
    (
      data =>   
      {
        this.DesginationList = data;
       
      }
    );
  }

  initgetSalutations(){
    this._generalService.GetSalutations().subscribe
    (
      data =>   
      {
        this.SalutationList = data;
       
      }
    );
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerContactPersonID: [this.advanceTable.customerContactPersonID],
      customerID: [this.advanceTable.customerID],
      salutationID: [this.advanceTable.salutationID],
      email: [this.advanceTable.email],
      customerDesignationID: [this.advanceTable.customerDesignationID],
      customerDepartmentID: [this.advanceTable.customerDepartmentID],
      contactPersonName: [this.advanceTable.contactPersonName],
      isMPOC: [this.advanceTable.isMPOC],
      mobile: [this.advanceTable.mobile],
      isActive: [this.advanceTable.isActive]
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
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({ customerID:this.data.customerID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerContactPersonCreate:CustomerContactPersonView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerContactPersonAll:CustomerContactPersonView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    //this.advanceTableForm.patchValue({ customerID:this.advanceTable.customerID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerContactPersonUpdate:CustomerContactPersonView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerContactPersonAll:CustomerContactPersonView:Failure');//To Send Updates  
    }
  )
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
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

/////////////////for Image Upload ends////////////////////////////

// Only Numbers with Decimals
// keyPressNumbersDecimal(event) {
//   var charCode = (event.which) ? event.which : event.keyCode;
//   if (charCode != 46 && charCode > 31
//     && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

// Only AlphaNumeric
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.customerContactPerson(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


