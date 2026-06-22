// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';

import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { CustomerCategoryDropDown } from 'src/app/customerCategory/customerCategoryDropDown.model';
import { CustomerContractDropDown } from 'src/app/customerContract/customerContractDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerContractPackageTypeService } from '../../customerContractPackageType.service';
import { CustomerContractPackageType } from '../../customerContractPackageType.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PackageTypeDropDown } from 'src/app/general/PackageTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-importFromContract',
  templateUrl: './importFromContract.component.html',
  styleUrls: ['./importFromContract.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ImportFromContractComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: any;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading = false;
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
  public CustomerList?: CustomerContractDropDown[] = [];
  filteredOptions: Observable<CustomerContractDropDown[]>;
    packageTypeList: CustomerContractPackageType[] | null;
     advanceTableFormData: CustomerContractPackageType[] = [];

  image: any;
  fileUploadEl: any;
  CustomerContractID!: number;
  CustomerContractName!: string;
  saveDisabled:boolean = true;
  customerContractID: any;
  constructor(
  public dialogRef: MatDialogRef<ImportFromContractComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerContractPackageTypeService,
    private fb: FormBuilder,
    private el: ElementRef,
    public dialog: MatDialog,
  public _generalService:GeneralService)
  {
    this.CustomerContractID= data.customerContractID,
        this.CustomerContractName =data.customerContractName,
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Import From Customer Contract';       
      this.advanceTable = data.advanceTable;
    } else 
    {
      this.dialogTitle = 'Import From Customer Contract';
      this.advanceTable = new CustomerContractPackageType({});
      this.advanceTable.activationStatus=true;
      //this.advanceTable.supplierName=data.SUPPLIERNAME;
    }
      this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.initCustomerCategory();
    this.InitCustomerContract();
    
  }

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
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
    );
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      CustomerContractPackageTypeID: [this.advanceTable.CustomerContractPackageTypeID],
      customerContractID: [this.advanceTable.customerContractID],
      customerContractName: [this.advanceTable.CustomerContractPackageType],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

   //------------- Contract --------------
    InitCustomerContract(){
      this._generalService.GetCustomerContract().subscribe
      (
        data =>   
        {
          this.CustomerList = data; 
          this.filteredOptions = this.advanceTableForm.controls['customerContractName'].valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          );      
        }
       
      );
    }
    private _filter(value: any): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 1) {
        return [];   
      }
      return this.CustomerList.filter(
        customer =>
        {
          return customer.customerContractName.toLowerCase().includes(filterValue);
        });
    }
    OnCustomerContractNameSelect(selectedCustomerContract: string)
    {
      const CustomerContractName = this.CustomerList.find(
        data => data.customerContractName === selectedCustomerContract
      );
      if (selectedCustomerContract) 
      {
        this.GetID(CustomerContractName.customerContractID);
      }
    }
    GetID(customerContractID :any)
    {
      this.customerContractID=customerContractID;
    }

      onImportClick() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Are you sure you want to import package types?'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // User clicked Yes - Proceed with import
            this.saveDisabled = false;  // Show spinner
            this.getPackageType();  // Fetch the package types
          } else {
            // User clicked No - Do nothing
          }
        });
      }

      // Fetch package types from the service
getPackageType() {
  debugger
    this.advanceTableService.GetPackageTypeToImportFromContractPackageType(this.customerContractID).subscribe(
        data => {
            this.packageTypeList = data;
            this.advanceTableFormData = this.packageTypeList.map(packageType =>
                new CustomerContractPackageType({
                    customerContractPackageTypeID: -1,
                    customerContractID: this.CustomerContractID,
                    customerContractPackageType: packageType.customerContractPackageType,
                    activationStatus: true,
                    userID: this._generalService.getUserID(),
                    packageTypeID: packageType.customerContractPackageTypeID
                })
            );
            
            // Save the customer contract Package Type once the categories are fetched
            this.saveCustomerContractPackageType();
        },
        error => {
            console.error('Error fetching package types', error);
            this.isLoading = false;  // Hide spinner in case of error
        }
    );
}

// Save the customer contract Package Type
saveCustomerContractPackageType() {
    this.advanceTableService.ImportFromCustomerContract(this.advanceTableFormData).subscribe(
        response => {
          if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
            this.saveDisabled = true;
        } else {
            this.dialogRef.close();
            this._generalService.sendUpdate('CustomerContractPackageTypeCreate:CustomerContractPackageTypeView:Success');
            this.saveDisabled = true;
        }
           
        },
        error => {
            console.error('Error saving customer contract Package Type', error);
            this._generalService.sendUpdate('CustomerContractPackageTypeAll:CustomerContractPackageTypeView:Failure');  // Hide spinner in case of error
            this.saveDisabled = true
        }
    );
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
    this.advanceTableForm.patchValue({ customerContractID:this.data.customerContractID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('CustomerContractCityTiersCreate:CustomerContractCityTiersView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerContractCityTiersAll:CustomerContractCityTiersView:Failure');//To Send Updates  
      this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    //this.advanceTableForm.patchValue({ customerContractID:this.advanceTable.customerContractID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('CustomerContractCityTiersUpdate:CustomerContractCityTiersView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerContractCityTiersAll:CustomerContractCityTiersView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
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

//   if (/[a-zA-Z]/.customerContractCityTiers(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


