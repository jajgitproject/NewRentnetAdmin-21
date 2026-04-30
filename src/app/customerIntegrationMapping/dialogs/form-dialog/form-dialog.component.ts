
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerIntegrationMappingService } from '../../customerIntegrationMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerIntegrationMapping, CustomerIntegrationMappingForDropDown } from '../../customerIntegrationMapping.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, Observable, startWith } from 'rxjs';

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
  advanceTable: CustomerIntegrationMapping;
  saveDisabled:boolean=true;
  public CustomerList?: CustomerIntegrationMappingForDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerIntegrationMappingForDropDown[]>;
  customerID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerIntegrationMappingService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='CustomerIntegrationMapping';       
          this.advanceTable = data.advanceTable;
          this.advanceTable.customerName = data.advanceTable.customerName + '' + data.advanceTable.tallyCustomerID;
        } else 
        {
          this.dialogTitle = 'CustomerIntegrationMapping';
          this.advanceTable = new CustomerIntegrationMapping({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }

  ngOnInit(): void 
  {
    this.InitCustomerAndTallyCode();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerIntegrationMappingID: [this.advanceTable.customerIntegrationMappingID],
      customerID: [this.advanceTable.customerID],
      customerName: [this.advanceTable.customerName],
      userID: [this.advanceTable.userID],
      tallyCode: [this.advanceTable.tallyCode],
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

  //------------ Customer -----------------
  InitCustomerAndTallyCode() {
    this.advanceTableService.GetCustomerAndTallyCode().subscribe(
      data => {
        this.CustomerList = data;
        console.log(this.CustomerList);
        this.advanceTableForm.controls['customerName'].setValidators([Validators.required,
        this.primaryCustomerValidator(this.CustomerList)
        ]);
        this.advanceTableForm.controls['customerName'].updateValueAndValidity();
        this.filteredCustomerOptions = this.advanceTableForm.controls['customerName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      });
  }

  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerList?.filter(
      customer => {
        return customer.tallyCustomerID?.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
          customer.tallyCustomerID?.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
          customer.customerName?.toLowerCase().includes(filterValue);
      }
    );
  }

  onCustomerSelected(selectedCustomerName: string) {
    const selectedCustomer = this.CustomerList.find(
      data => 
        data.customerName === selectedCustomerName
    );

    if (selectedCustomer) {
      this.getCustomerID(selectedCustomer);
    }
  }

  getCustomerID( data : any) {
    this.customerID = data.customerID;
    this.advanceTableForm.patchValue({ customerID: this.customerID });
  }

  primaryCustomerValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList.some(option =>
        (option.customerName + '' + option.tallyCustomerID)?.toLowerCase() === value
      );
      return match ? null : { primaryCustomerInvalid: true };
    };
  }


  public Post(): void
  {
   
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerIntegrationMappingCreate:CustomerIntegrationMappingView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
  },
    error =>
    {
       this._generalService.sendUpdate('CustomerIntegrationMappingAll:CustomerIntegrationMappingView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
   
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerIntegrationMappingUpdate:CustomerIntegrationMappingView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerIntegrationMappingAll:CustomerIntegrationMappingView:Failure');//To Send Updates 
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
}


