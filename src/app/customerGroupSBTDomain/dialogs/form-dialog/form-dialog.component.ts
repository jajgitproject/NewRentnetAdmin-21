// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerGroupSBTDomainService } from '../../customerGroupSBTDomain.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { CustomerGroupSBTDomain } from '../../customerGroupSBTDomain.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { CustomerCategoryDropDown } from 'src/app/customerCategory/customerCategoryDropDown.model';
import { CustomerPersonModel, CustomerPersonModels } from 'src/app/customerCorporateIndividual/customerCorporateIndividual.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: CustomerGroupSBTDomain;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 saveDisabled:boolean = true;
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
    filteredCustomerPersonNameOptions: Observable<CustomerPersonModels[]>;
    public CustomerPersonList?: CustomerPersonModels[] = [];

  image: any;
  fileUploadEl: any;
  CustomerGroupID!: number;
  CustomerGroup!: string;
  customerGroupID: number;
  approveCustomerPersonID: any;
  approvarCustomerPersonID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerGroupSBTDomainService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.CustomerGroupID= data.customerGroupID,
        this.CustomerGroup =data.customerGroup,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='SBT Domain';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'SBT Domain';
          this.advanceTable = new CustomerGroupSBTDomain({});
          this.advanceTable.status=true;
          //this.advanceTable.supplierName=data.SUPPLIERNAME;
        }
        this.advanceTableForm = this.createContactForm();
  }
 ngOnInit(): void {
  this.initCustomerCategory();
  this.InitCustomerPerson(this.data.customerGroupID);

  // Patch sbtDomain for edit mode
  if (this.action === 'edit' && this.advanceTable?.sbtDomain) {
    this.advanceTableForm.patchValue({
      sbtDomain: this.advanceTable.sbtDomain
    });
  }
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

  initCustomerCategory(){
    this._generalService.getCustomerCategory().subscribe(
      data=>{
        this.customerCategoryList=data;
      }
    )
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
     customerGroupSBTDomainID: [this.advanceTable.customerGroupSBTDomainID],
customerGroupID: [this.advanceTable.customerGroupID],
approvarCustomerPersonID: [this.advanceTable.approvarCustomerPersonID],
allowCDPLogin: [this.advanceTable.allowCDPLogin],
sbtDomain: [this.advanceTable?.sbtDomain || '',
  [
    Validators.required,
    Validators.pattern(/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/),
    this.noWhitespaceValidator
  ]
],

allowPassengerToMakeReservation: [this.advanceTable.allowPassengerToMakeReservation],
requireApprovalOnReservation: [this.advanceTable.requireApprovalOnReservation],
singleApproverOrPersonSpecificApprover: [this.advanceTable.singleApproverOrPersonSpecificApprover],
status: [this.advanceTable.status],
allowAllCars: [this.advanceTable.allowAllCars],
approverCustomerPersonName: [this.advanceTable.approverCustomerPersonName],
allowAllDutyTypes: [this.advanceTable.allowAllDutyTypes],
designationSpecificCars: [this.advanceTable.designationSpecificCars],
designationSpecificDutyTypes: [this.advanceTable.designationSpecificDutyTypes],
allowPassengerToLoginCDP: [this.advanceTable.allowPassengerToLoginCDP],
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
  onNoClick()
  {
    this.dialogRef.close();
    this.ImagePath="";
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({ customerGroupID:this.data.customerGroupID });
    
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerGroupSBTDomainCreate:CustomerGroupSBTDomainView:Success');//To Send Updates  
       this.saveDisabled = true;
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerGroupSBTDomainAll:CustomerGroupSBTDomainView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({ customerGroupID:this.advanceTable.customerGroupID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerGroupSBTDomainUpdate:CustomerGroupSBTDomainView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerGroupSBTDomainAll:CustomerGroupSBTDomainView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
  }
public confirmAdd(): void {
  if (this.advanceTableForm.invalid) {
    this.advanceTableForm.markAllAsTouched();
    return;
  }

  this.saveDisabled = false;

  if (this.action === 'edit') {
    this.Put();
  } else {
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

//   if (/[a-zA-Z]/.customerGroupSBTDomain(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }


   
 // ------------ Customer Person -----------------
// ------------ Customer Person -----------------

CustomerPersonValidator(CustomerPersonList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const value = control.value.toLowerCase();

    const match = CustomerPersonList.some(
      x => x.approverCustomerPersonName?.toLowerCase() === value
    );

    return match ? null : { CustomerPersonInvalid: true };
  };
}

InitCustomerPerson(customerGroupID: number) {
  if (!customerGroupID) return;

  this.advanceTableService
    .getCustomerForApproval(customerGroupID)
    .subscribe(data => {


      this.CustomerPersonList = data || [];

      const control =
        this.advanceTableForm.controls['approverCustomerPersonName'];

      control?.setValidators([
        Validators.required,
        this.CustomerPersonValidator(this.CustomerPersonList)
      ]);
      control.updateValueAndValidity();

      this.filteredCustomerPersonNameOptions =
        control.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCustomerPerson(value))
        );
        
    });
}

private _filterCustomerPerson(value: any): any[] {
  if (!value) return this.CustomerPersonList;

  const filterValue =
    typeof value === 'string'
      ? value.toLowerCase()
      : value.approverCustomerPersonName?.toLowerCase();

  return this.CustomerPersonList.filter(data =>
    data.approverCustomerPersonName
      ?.toLowerCase()
      .includes(filterValue)
  );
}

OnCustomerPerson(selectedCustomerPerson: string) {
  const CustomerPerson = this.CustomerPersonList.find(
    data =>
      data.approverCustomerPersonName === selectedCustomerPerson
  );

  if (CustomerPerson) {
    this.getCustomerPersonID(
      CustomerPerson.approvarCustomerPersonID
    );
  }
}

getCustomerPersonID(approvarCustomerPersonID: any) {
  this.approvarCustomerPersonID = approvarCustomerPersonID;

  this.advanceTableForm.patchValue({
    approvarCustomerPersonID: this.approvarCustomerPersonID
  });
}


}


