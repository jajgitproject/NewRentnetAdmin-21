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
import { ContractPaymentMapping } from '../../contractPaymentMapping.model';
import { ContractPaymentMappingService } from '../../contractPaymentMapping.service';
import { ModeOfPaymentDropDown } from 'src/app/modeOfPayment/modeOfPaymentDropDown.model';


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
  advanceTable: ContractPaymentMapping;
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

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ContractPaymentMappingService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {

        // Set the defaults
        this.action = data.action;
        this.advanceTable = data.advanceTable;
        this.advanceTableForm = this.createContactForm();
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Contract Payment Mapping';  
          this.advanceTableForm.patchValue({modeOfPayment:this.advanceTable?.modeOfPayment });     
         
          
        } else 
        {
          this.dialogTitle = 'Contract Payment Mapping';
          this.advanceTable = new ContractPaymentMapping({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.contractID= data.ContractID
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      contractPaymentMappingID: [this.advanceTable?.contractPaymentMappingID],
      modeOfPaymentID: [[], Validators.required],
      contractID: [this.advanceTable?.contractID],
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
    this._generalService.getPaymentModeByContractID(this.contractID).subscribe
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
    this._generalService.getPaymentModeByContractID(this.contractID).subscribe
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
    this.advanceTableForm.patchValue({contractID:this.contractID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.dialogRef.close();
      this._generalService.sendUpdate('ContractPaymentMappingCreate:ContractPaymentMappingView:Success');//To Send Updates  
      this.saveDisabled = true;
    
  },
    error =>
    {
      this._generalService.sendUpdate('ContractPaymentMappingAll:ContractPaymentMappingView:Failure');//To Send Updates  
      this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({contractID:this.contractID});
    
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('ContractPaymentMappingUpdate:ContractPaymentMappingView:Success');//To Send Updates  
      this.saveDisabled = true;       
    },
    error =>
    {
     this._generalService.sendUpdate('ContractPaymentMappingAll:ContractPaymentMappingView:Failure');//To Send Updates  
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


