// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierCustomerFixedForAllPercentageService } from '../../supplierCustomerFixedForAllPercentage.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SupplierCustomerFixedForAllPercentage } from '../../supplierCustomerFixedForAllPercentage.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerDropDown } from '../../customerDropDown.model';
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
  advanceTable: SupplierCustomerFixedForAllPercentage;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;

 
   public CustomerList?: CustomerDropDown[] = [];
   filteredCustomerOptions: Observable<CustomerDropDown[]>;
   searchCustomer: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  customerID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierCustomerFixedForAllPercentageService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Wise Fixed Percentage For All Suppliers';       
          this.advanceTable = data.advanceTable;
          this.searchCustomer.setValue(this.advanceTable.customerName);
        } else 
        {
          this.dialogTitle = 'Customer Wise Fixed Percentage For All Suppliers';
          this.advanceTable = new SupplierCustomerFixedForAllPercentage({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitCustomer();
  }

  InitCustomer(){
    this._generalService.GetCustomers().subscribe(
      data=>
      {
        this.CustomerList=data;
        this.filteredCustomerOptions = this.searchCustomer.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCustomerSelected(selectedCustomer: string) {
    const selectedValue = this.CustomerList.find(
      data => data.customerName === selectedCustomer
    );
  
    if (selectedValue) {
      this.getTitles(selectedValue.customerID);
    }
  }
  getTitles(customerID: any) {
    
    this.customerID=customerID;
  }
  // InitCustomer(){
  //   this._generalService.GetCustomers().subscribe(
  //     data=>{
  //       this.CustomerList=data;
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
      supplierCustomerFixedPercentageForAllID: [this.advanceTable.supplierCustomerFixedPercentageForAllID],
      customerID: [this.advanceTable.customerID],
      fromDate: [this.advanceTable.fromDate],
      toDate: [this.advanceTable.toDate],
      supplierPercentage: [this.advanceTable.supplierPercentage],
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
  onNoClick():void
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.isLoading = true;
  
    this.advanceTableForm.patchValue({customerID:this.customerID})
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.isLoading = false;
        this.dialogRef.close();
       this._generalService.sendUpdate('SupplierCustomerFixedForAllPercentageCreate:SupplierCustomerFixedForAllPercentageView:Success');//To Send Updates  
    
    },
    error =>
    {
      this.isLoading = false;
       this._generalService.sendUpdate('SupplierCustomerFixedForAllPercentageAll:SupplierCustomerFixedForAllPercentageView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.isLoading = true;
    this.advanceTableForm.patchValue({customerID:this.customerID || this.advanceTable.customerID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {  
      this.isLoading = false;
        
      this.dialogRef.close();
       this._generalService.sendUpdate('SupplierCustomerFixedForAllPercentageUpdate:SupplierCustomerFixedForAllPercentageView:Success');//To Send Updates  
       
    },
    error =>
    {
      this.isLoading = false;
     this._generalService.sendUpdate('SupplierCustomerFixedForAllPercentageAll:SupplierCustomerFixedForAllPercentageView:Failure');//To Send Updates  
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
  
  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
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

}


