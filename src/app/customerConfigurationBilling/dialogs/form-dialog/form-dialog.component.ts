// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerConfigurationBillingService } from '../../customerConfigurationBilling.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerConfigurationBilling } from '../../customerConfigurationBilling.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerConfigurationBillingDropDown } from '../../customerConfigurationBillingDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
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

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerConfigurationBilling;
  CustomerID:number;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  //public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredCompanyOptions: Observable<OrganizationalEntityDropDown[]>;
  searchCompany: FormControl = new FormControl();
  // public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  filteredBillingOptions: Observable<OrganizationalEntityDropDown[]>;
  searchBilling: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  CustomerName: any;
  organizationalEntityID: any;
  fixBillingBranchID: any;
  ecoCompanyID: any;
  saveDisabled :boolean= true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public dialog:MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerConfigurationBillingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Billing Configuration For';       
          this.advanceTable = data.advanceTable;
          this.searchCompany.setValue(this.advanceTable.ecoCompany);
          this.searchBilling.setValue(this.advanceTable.fixBillingBranch);
        } else 
        {
          this.dialogTitle = 'Billing Configuration For';
          this.advanceTable = new CustomerConfigurationBilling({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerID=this.data.CustomerID;
        this.CustomerName=this.data.CustomerName;
  }
  public ngOnInit(): void
  {
    this.InitCompany();
    this.InitBranch();
    this.advanceTableForm.controls["activationStatus"].disable();
  }
  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  InitCompany(){
    this._generalService.GetCompany().subscribe(
      data=>{
        this.OrganizationalEntityList=data;
        this.filteredCompanyOptions = this.advanceTableForm.controls['ecoCompany'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCategory(value || ''))
        ); 
      }
    )
  }
  private _filterCategory(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.OrganizationalEntityList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getTitles(ecoCompanyID: any) {
    this.ecoCompanyID=ecoCompanyID;
    this.advanceTableForm.patchValue({ecoCompanyID:this.ecoCompanyID});
  }

  billingBranchValidator(OrganizationalEntitiesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntitiesList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { billingBranchInvalid: true };
    };
  }

  InitBranch(){
    this._generalService.GetOrganizationalBranch().subscribe(
      data=>{
        this.OrganizationalEntitiesList=data;
        this.advanceTableForm.controls['fixBillingBranch'].setValidators([this.billingBranchValidator(this.OrganizationalEntitiesList)]);
        this.advanceTableForm.controls['fixBillingBranch'].updateValueAndValidity();
        this.filteredBillingOptions = this.advanceTableForm.controls['fixBillingBranch'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterBranch(value || ''))
        ); 
      })
  }
  private _filterBranch(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.OrganizationalEntitiesList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  }
  OnBillingBranchSelect(selectedBillingBranch: string)
  {
    const BillingBranchName = this.OrganizationalEntitiesList.find(
      data => data.organizationalEntityName === selectedBillingBranch
    );
    if (selectedBillingBranch) 
    {
      this.getfixBillingBranchID(BillingBranchName.organizationalEntityID);
    }
  }
  getfixBillingBranchID(fixBillingBranchID: any) {
    this.fixBillingBranchID=fixBillingBranchID;
    this.advanceTableForm.patchValue({fixBillingBranchID:this.fixBillingBranchID});
  }
  // InitCompany(){
  //   this._generalService.GetCompany().subscribe(
  //     data=>{
  //       this.OrganizationalEntityList=data;
  //     }
  //   )
  // }

  // InitBranch(){
  //   this._generalService.GetOrganizationalBranch().subscribe(
  //     data=>{
  //       this.OrganizationalEntitiesList=data;
  //     }
  //   )
  // }

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
      customerConfigurationBillingID: [this.advanceTable.customerConfigurationBillingID],
      customerID: [this.advanceTable.customerID],
      ecoCompanyID: [this.advanceTable.ecoCompanyID],
      ecoCompany: [this.advanceTable.ecoCompany],
      fixBillingBranchID: [this.advanceTable.fixBillingBranchID],
      fixBillingBranch: [this.advanceTable.fixBillingBranch],
      misRequired: [this.advanceTable.misRequired],
      //documentRequired: [this.advanceTable.documentRequired],
      useOnlyAppDataForBilling: [this.advanceTable.useOnlyAppDataForBilling],
      mapMandatoryWithDutySlip: [this.advanceTable.mapMandatoryWithDutySlip],
      runningDetailsMandatoryWithDutySlip: [this.advanceTable.runningDetailsMandatoryWithDutySlip],
      // fuelSurchargeFormula: [this.advanceTable.fuelSurchargeFormula],
      // fuelSurchargeOnBasePackageRate: [this.advanceTable.fuelSurchargeOnBasePackageRate],
      // fuelSurchargeOnExtraKM: [this.advanceTable.fuelSurchargeOnExtraKM],
      // fuelSurchargeOnExtraHour: [this.advanceTable.fuelSurchargeOnExtraHour],
      isSEZCustomer: [this.advanceTable.isSEZCustomer],
      useDataFromAppToPrintOnDutySlip: [this.advanceTable.useDataFromAppToPrintOnDutySlip],
      runningDetailsSource:[this.advanceTable.runningDetailsSource],
      activationStatus: [this.advanceTable.activationStatus]
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
  // public Post(): void
  // {
  //   this.advanceTableForm.patchValue({customerID:this.customerID});
  //   this.advanceTableService.add(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //   response => 
  //   {
  //       this.dialogRef.close();
  //      this._generalService.sendUpdate('CustomerConfigurationBillingCreate:CustomerConfigurationBillingView:Success');//To Send Updates  
    
  //   },
  //   error =>
  //   {
  //      this._generalService.sendUpdate('CustomerConfigurationBillingAll:CustomerConfigurationBillingView:Failure');//To Send Updates  
  //   }
  // )
  // }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  openSaveDialog()
  {
    const dialogRef = this.dialog.open(SaveDialogComponent, 
    {
      data:
      {
        advanceTableForm:this.advanceTableForm,
        customerID:this.CustomerID,
        ecoCompanyID:this.advanceTableForm.value.ecoCompanyID,
        fixBillingBranchID:this.advanceTableForm.value.fixBillingBranchID,
        dialogRef:this.dialogRef,
        saveDisabled:this.saveDisabled,
        action:this.action,
        advanceTable:this.data.advanceTable
      } 
    });
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

//   if (/[a-zA-Z]/.customerConfigurationBilling(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }
}

