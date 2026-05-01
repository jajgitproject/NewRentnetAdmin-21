// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
// import { PersonShortService } from '../../personShort.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { PersonShort } from '../../personShort.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { SalutationDropDown } from 'src/app/salutation/salutationDropDown.model';
import { CustomerDesignationDropDown } from 'src/app/customerDesignation/customerDesignationDropDown.model';
import { CustomerDepartmentDropDown } from 'src/app/customerDepartment/customerDepartmentDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonShortService } from '../../personShort.service';
import { CustomerGroupDropDown } from 'src/app/customerGroup/customerGroupDropDown.model';
import { CustomerDropDown } from 'src/app/customer/customerDropDown.model';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogPersonShortComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: PersonShort;
 
  public SalutationList?: SalutationDropDown[] = [];
  filteredSalutationOptions: Observable<SalutationDropDown[]>;
  searchSalutationBy: FormControl = new FormControl();

  public CustomerDesignationList?: CustomerDesignationDropDown[] = [];
  filteredDesignationOptions: Observable<CustomerDesignationDropDown[]>;
  searchDesignationBy: FormControl = new FormControl();
  public CustomerDepartmentList?: CustomerDepartmentDropDown[] = [];
  filteredDepartmentOptions: Observable<CustomerDepartmentDropDown[]>;
  searchDepartmentBy: FormControl = new FormControl();
  public customerGroupList?: CustomerGroupDropDown[] = [];
  public customerList?: CustomerDropDown[] = [];
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

  image: any;
  fileUploadEl: any;
  customerGroupName: any;
  salutationID: any;
  customerDesignationID: any;
  customerDepartmentID: any;
  customerGroupID: any;
  customerID: any;
  customerGroup: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogPersonShortComponent>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PersonShortService,
    private fb: FormBuilder,
    private el: ElementRef,
 
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Personal Short for';       
          this.advanceTable = data.advanceTable;
          this.searchSalutationBy.setValue(this.advanceTable.salutation)
          this.searchDesignationBy.setValue(this.advanceTable.customerDesingationName)
          this.searchDepartmentBy.setValue(this.advanceTable.customerDepartment)
        } else 
        {
          this.dialogTitle = 'Customer Person for';
          this.advanceTable = new PersonShort({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();
        this.customerGroup=data?.advanceTable?.customerGroup;
  }
  public ngOnInit(): void
  {
    this.InitSalutation();
    this.InitCustomerDesignation();
    this.InitCustomerDepartment();
    this.initCustomerGroup();
    this.initCustomer();
  }

  // initCustomerGroup(){
  //   this._generalService.getCustomerGroup().subscribe(
  //     data=>{
  //       this.customerGroupList=data;
  //     }
  //   )
  // }

  // initCustomer(){
  //   this._generalService. getCustomers().subscribe(
  //     data=>{
  //       this.customerList=data;
  //     }
  //   )
  // }

  initCustomerGroup(){
    this._generalService.getCustomerGroup().subscribe(
      data=>{
        this.customerGroupList=data;``
        this.filteredOptions = this.advanceTableForm.controls['customerGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      }
    )
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getTierID(customerGroupID: any) {
    debugger
    this.customerGroupID=customerGroupID;
  }

  initCustomer(){
    this._generalService.getCustomers().subscribe(
      data=>{
        this.customerList=data;``
        this.filteredCustomerOptions = this.advanceTableForm.controls['customerName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      }
    )
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    return this.customerList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getCustomerTierID(customerID: any) {
    debugger
    this.customerID=customerID;
  }

  // InitSalutation(){
  //   this._generalService. GetSalutations().subscribe(
  //     data=>{
  //       this.SalutationList=data;
  //     }
  //   )
  // }

  InitSalutation(){
    this._generalService.GetSalutations().subscribe
    (
      data=>{
        this.SalutationList=data;
        this.filteredSalutationOptions = this.advanceTableForm.controls['salutation'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSalutation(value || ''))
        ); 
      }
    );
  }
  private _filterSalutation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.SalutationList.filter(
      customer => 
      {
        return customer.salutation.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getTitles(salutationID: any) {
    
    this.salutationID=salutationID;
  }

  InitCustomerDesignation(){
    this._generalService.GetCustomerDesignation().subscribe
    (
      data=>{
        this.CustomerDesignationList=data;
        this.filteredDesignationOptions = this.searchDesignationBy.valueChanges.pipe(
          startWith(""),
          map(value => this._filterDesgination(value || ''))
        ); 
      }
    );
  }

  private _filterDesgination(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerDesignationList.filter(
      customer => 
      {
        return customer.customerDesignation.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getDesignation(customerDesignationID: any) {
    
    this.customerDesignationID=customerDesignationID;
  }
  InitCustomerDepartment(){
    this._generalService.GetCustomerDepartment().subscribe
    (
      data=>{
        this.CustomerDepartmentList=data;
        this.filteredDepartmentOptions = this.searchDepartmentBy.valueChanges.pipe(
          startWith(""),
          map(value => this._filterDepartment(value || ''))
        ); 
      }
    );
  }
  private _filterDepartment(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerDepartmentList.filter(
      customer => 
      {
        return customer.customerDepartment.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getDepartment(customerDepartmentID: any) {
    
    this.customerDepartmentID=customerDepartmentID;
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerPersonID: [this.advanceTable.customerPersonID],
      customerGroupID: [this.advanceTable.customerGroupID],
      customerID: [this.advanceTable.customerID],
      customerName: [this.advanceTable.customerName],
      salutationID: [this.advanceTable.salutationID],
      salutation:[this.advanceTable.salutation],
      customerPersonName: [this.advanceTable.customerPersonName],
      gender: [this.advanceTable.gender],
      importance: [this.advanceTable.importance],
      primaryEmail: [this.advanceTable.primaryEmail],
      primaryMobile: [this.advanceTable.primaryMobile],
      sendEmail: [this.advanceTable.sendEmail],
      customerGroup: [this.advanceTable.preferAppBasedDriver],
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
    this.advanceTableForm.patchValue({customerID:this.customerID});
    this.advanceTableForm.patchValue({salutationID:this.salutationID});
    this.advanceTableForm.patchValue({customerDesignationID:this.customerDesignationID});
    this.advanceTableForm.patchValue({customerDepartmentID:this.customerDepartmentID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
          this.dialogRef.close();
          this.showNotification(
            'snackbar-success',
            'Person Short Successfully...!!!',
            'bottom',
            'center'
          );
         this._generalService.sendUpdate('PersonShortUpdate:CustomerPersonUpdate:Success');//To Send Updates  
         
      },
      error =>
      {
       this._generalService.sendUpdate('PersonShortUpdate:CustomerPersonUpdate:Failure');//To Send Updates 
       this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
      }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerGroupID:this.advanceTable.customerGroupID});
    this.advanceTableForm.patchValue({salutationID:this.salutationID || this.advanceTable.salutationID});
    this.advanceTableForm.patchValue({customerDesignationID:this.customerDesignationID || this.advanceTable.customerDesignationID});
    this.advanceTableForm.patchValue({customerDepartmentID:this.customerDepartmentID || this.advanceTable.customerDepartmentID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonUpdate:CustomerPersonView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerPersonAll:CustomerPersonView:Failure');//To Send Updates  
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

//   if (/[a-zA-Z]/.customerPerson(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


