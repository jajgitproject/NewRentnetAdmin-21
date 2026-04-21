// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

import { ContractPackageTypeMapping } from '../../contractPackageTypeMapping.model';
import { ContractPackageTypeMappingService } from '../../contractPackageTypeMapping.service';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
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
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ContractPackageTypeMapping;
  packageTypeID: any;
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  packageType: FormControl = new FormControl();
  public PackageTypeList?:PackageTypeDropDown[]=[];
  contractID:number;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ContractPackageTypeMappingService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Contract Package Type Mapping';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Contract Package Type Mapping';
          this.advanceTable = new ContractPackageTypeMapping({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.contractID= data.ContractID
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      contractPackageTypeMappingID: [this.advanceTable.contractPackageTypeMappingID],
      packageTypeID: [this.advanceTable.packageTypeID],
      contractID: [this.advanceTable.contractID],
      packageType: [this.advanceTable.packageType],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }


  ngOnInit() {  
    this.InitPackageType();
  }

  packageTypeValidator(PackageTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageTypeList.some(group => group.packageType.toLowerCase() === value);
      return match ? null : { packageTypeInvalid: true };
    };
  }
   //------------ Type -----------------
   InitPackageType(){
    this._generalService.GetPackageType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
        this.advanceTableForm.controls['packageType'].setValidators([Validators.required,
          this.packageTypeValidator(this.PackageTypeList)
        ]);
        this.advanceTableForm.controls['packageType'].updateValueAndValidity();
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }

  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.PackageTypeList?.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().includes(filterValue);
      });
  }
  OnPackageTypeSelect(selectedPackageType: string)
  {
    const PackageTypeName = this.PackageTypeList.find(
      data => data.packageType === selectedPackageType
    );
    if (selectedPackageType) 
    {
      this.getPackageTypeID(PackageTypeName.packageTypeID);
    }
  }
  getPackageTypeID(packageTypeID: any)
  {
    this.packageTypeID=packageTypeID;
    this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
    
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
      this._generalService.sendUpdate('ContractPackageTypeMappingCreate:ContractPackageTypeMappingView:Success');//To Send Updates 
      this.saveDisabled = true; 
    
  },
    error =>
    {
      this._generalService.sendUpdate('ContractPackageTypeMappingAll:ContractPackageTypeMappingView:Failure');//To Send Updates  
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
      this._generalService.sendUpdate('ContractPackageTypeMappingUpdate:ContractPackageTypeMappingView:Success');//To Send Updates  
      this.saveDisabled = true; 
    },
    error =>
    {
     this._generalService.sendUpdate('ContractPackageTypeMappingAll:ContractPackageTypeMappingView:Failure');//To Send Updates 
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


