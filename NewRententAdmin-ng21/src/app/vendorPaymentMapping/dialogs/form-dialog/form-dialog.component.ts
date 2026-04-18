// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ModeOfPaymentDropDown } from 'src/app/modeOfPayment/modeOfPaymentDropDown.model';
import { VendorPaymentMapping } from '../../vendorPaymentMapping.model';
import { VendorPaymentMappingService } from '../../vendorPaymentMapping.service';



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
  advanceTable: VendorPaymentMapping;
  public ModeOfPaymentList?: ModeOfPaymentDropDown[] = [];
  searchModeTerm:  FormControl = new FormControl();
  filteredModeOptions: Observable<ModeOfPaymentDropDown[]>;
  selectedModes: string[] = [];
  selectedModeIDs: any[] = [];
  contractID:number;
  modeOfPaymentID: number[] = [];
  existPaymentMessage: boolean = false;
  isSaveDisabled: boolean = false;
  saveDisabled:boolean = true;
  vendorContractID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VendorPaymentMappingService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {

        // Set the defaults
        this.action = data.action;
        this.advanceTable = data.advanceTable;
        this.advanceTableForm = this.createContactForm();
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Vendor Contract Payment Mapping';  
          this.advanceTableForm.patchValue({modeOfPayment:this.advanceTable?.modeOfPayment });     
         
          
        } else 
        {
          this.dialogTitle = 'Vendor Contract Payment Mapping';
          this.advanceTable = new VendorPaymentMapping({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.vendorContractID = data.vendorContract_ID;
        console.log(this.vendorContractID);
        // Set vendorcontractID in the form
        this.advanceTableForm.patchValue({ vendorcontractID: this.vendorContractID });
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vendorContractPaymentMappingID: [this.advanceTable?.vendorContractPaymentMappingID],
      modeOfPaymentID: [[], Validators.required],
      vendorcontractID: [this.advanceTable?.vendorcontractID],
     modeOfPayment: [this.advanceTable?.modeOfPayment],
      activationStatus: [this.advanceTable?.activationStatus],
    });
  }


  ngOnInit() {  
    this.InitModeOfPayment();
    if(this.action==='edit'){
      this.InitModeOfPaymentEdit();
    }
  
  }
 
  
   InitModeOfPayment(){
    this._generalService.getPaymentModeByVendorContractID(this.vendorContractID).subscribe
    (
      data =>   
      {
        if(data){
          this.ModeOfPaymentList = data;
          this.existPaymentMessage=false;
        }
       else
       {
        this.existPaymentMessage=true;
        this.advanceTableForm.controls['modeOfPaymentID'].disable();
        this.isSaveDisabled=true;
       }
      }
    );
  }
  modeOfPaymentValidator(ModeOfPaymentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ModeOfPaymentList.some(group => group.modeOfPayment.toLowerCase() === value);
      return match ? null : { invalidModeOfPaymentSelection: true };
    };
  }
  InitModeOfPaymentEdit(){
    this._generalService.getPaymentModeByVendorContractID(this.vendorContractID).subscribe
    (
      data =>   
      {
        if(data)
          {
          this.ModeOfPaymentList = data; 
        this.advanceTableForm.controls['modeOfPayment'].setValidators([Validators.required,
          this.modeOfPaymentValidator(this.ModeOfPaymentList)
        ]);
        this.advanceTableForm.controls['modeOfPayment'].updateValueAndValidity();
        this.filteredModeOptions = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterMode(value || ''))
        );
      }
       else{
        this.existPaymentMessage=true;
        this.advanceTableForm.controls['modeOfPayment'].disable();
       }

        }
    );
  }
private _filterMode(value: string): any {
     const filterValue = value.toLowerCase();
     return this.ModeOfPaymentList.filter(
       customer => 
       {
         return customer.modeOfPayment.toLowerCase().indexOf(filterValue)===0;
       }
     );
     
   };
   getModeID(modeOfPaymentID: any) {
     this.modeOfPaymentID=modeOfPaymentID;
     this.advanceTableForm.patchValue({modeOfPaymentID:this.modeOfPaymentID || this.advanceTable.modeOfPaymentID});
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
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorPaymentMappingCreate:VendorPaymentMappingView:Success');//To Send Updates  
      this.saveDisabled = true;
    
  },
    error =>
    {
      this._generalService.sendUpdate('VendorPaymentMappingAll:VendorPaymentMappingView:Failure');//To Send Updates  
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
      this._generalService.sendUpdate('VendorPaymentMappingUpdate:VendorPaymentMappingView:Success');//To Send Updates  
      this.saveDisabled = true;       
    },
    error =>
    {
     this._generalService.sendUpdate('VendorPaymentMappingAll:VendorPaymentMappingView:Failure');//To Send Updates  
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


