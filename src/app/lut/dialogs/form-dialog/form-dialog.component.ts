// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LutService } from '../../lut.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Lut } from '../../lut.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { PaymentNetworkDropDown } from 'src/app/paymentNetwork/paymentNetworkDropDown.model';
import { BankDropDown } from 'src/app/bank/bankDropDown.model';
import { BankBranchDropDown } from 'src/app/bankChargeConfig/bankBranchDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import moment from 'moment';
// import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogLutComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Lut;
  public BranchList?: BankBranchDropDown[] = [];

  public BankList?: BankDropDown[] = [];
  filteredBankOptions: Observable<BankDropDown[]>;
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredBankBranchOptions: Observable<BankBranchDropDown[]>;
  searchBank: FormControl = new FormControl();

  searchBankBranch: FormControl = new FormControl();
  bankID: any;
  bankBranchID: any;
  companyBranchID: any;
  organizationalEntityID: any;
  organizationalEntityName: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogLutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: LutService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    this.organizationalEntityID = data.organizationalEntityID;
    this.organizationalEntityName = data.organizationalEntityName;
    console.log(this.organizationalEntityName)
    // Set the defaults
    this.action = data?.action;
    if (this.action === 'edit')
      {
      //this.dialogTitle ='Edit Lut';       
      this.dialogTitle = 'LUT';
      this.advanceTable = data.advanceTable;
      this.ImagePath=this.advanceTable.scannedImage;
        let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
                let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
                this.onBlurUpdateDateEdit(startDate);
                this.onBlurUpdateEndDateEdit(endDate);
      // this.advanceTableForm?.controls['organizationalEntityID'].setValue(this.organizationalEntityID);
      // this.advanceTableForm?.controls['organizationalEntityName'].setValue(this.organizationalEntityName);
    } 
    else 
    {
      //this.dialogTitle = 'Create Lut';
      this.dialogTitle = 'LUT';
      this.advanceTable = new Lut({});
      this.advanceTable.activationStatus = true;
      // this.advanceTableForm?.controls['organizationalEntityID'].setValue(this.organizationalEntityID);
      // this.advanceTableForm?.controls['organizationalEntityName'].setValue(this.organizationalEntityName);
    }
    this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void
  {
    this.advanceTableForm.patchValue({organizationalEntityName:this.organizationalEntityName});
    this.advanceTableForm.patchValue({organizationalEntityID:this.organizationalEntityID});
    // this.InitBank();
    // this.InitBranch();

  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        lutID: [this.advanceTable.lutID],
        // bankID: [this.advanceTable.bankID],
        // bank: [this.advanceTable.bank],
        lutNo: [this.advanceTable.lutNo, [this.noWhitespaceValidator]],
        organizationalEntityID: [this.advanceTable?.organizationalEntityID],
        organizationalEntityName: [this.advanceTable.organizationalEntityName],
        scannedImage: [this.advanceTable.scannedImage,[Validators.required]],
        startDate: [this.advanceTable.startDate],
        endDate: [this.advanceTable.endDate],
        activationStatus: [this.advanceTable.activationStatus],
        updatedBy: [this.advanceTable.updatedBy],
        updateDateTime: [this.advanceTable.updateDateTime]
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() { }

  onNoClick(): void {
    this.dialogRef.close();
    this.ImagePath = "";
  }

  reset(): void {
    this.advanceTableForm.reset();
    this.ImagePath = undefined;
    this.searchBank.reset();
    this.searchBankBranch.reset();
  }
  public Post(): void {
    // this.advanceTableForm.patchValue({bankID:this.bankID});
    //this.advanceTableForm.controls['organizationalEntityID'].setValue(this.organizationalEntityID);
    this.advanceTableForm.controls['organizationalEntityID'].setValue(this.organizationalEntityID);
    console.log(this.organizationalEntityID)
    console.log(this.advanceTableForm.getRawValue());
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('LutCreate:LutView:Success');//To Send Updates  

        },
        error => {
          this._generalService.sendUpdate('LutAll:LutView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.advanceTableForm.controls['organizationalEntityID'].setValue(this.organizationalEntityID || this.advanceTable.organizationalEntityID);
    console.log(this.advanceTableForm.getRawValue());
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('LutUpdate:LutView:Success');//To Send Updates  

        },
        error => {
          this._generalService.sendUpdate('LutAll:LutView:Failure');//To Send Updates  
        }
      )
  }
 
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }

  public response: { dbPath: '' };
  public ImagePath: string = "";
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({scannedImage:this.ImagePath})
  }

  InitBank() {
    this._generalService.GetBank().subscribe(
      data => {
        this.BankList = data;
        this.advanceTableForm.controls['bank']?.setValidators([Validators.required,
        this.bankTypeValidator(this.BankList)
        ]);
        this.advanceTableForm.controls['bank'].updateValueAndValidity();
        this.filteredBankOptions = this.advanceTableForm.controls['bank'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.BankList.filter(
      customer => {
        return customer.bank.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  getTitles(bankID: any) {
    this.bankID = bankID;
  }

  bankTypeValidator(BankList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = BankList.some(group => group.bank?.toLowerCase() === value);
      return match ? null : { bankInvalid: true };
    };
  }

  InitBranch() {
    this._generalService.GetOrganizationalBranch().subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls['organizationalEntityName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterBankBranch(value || ''))
        );
      });
  }

  private _filterBankBranch(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.OrganizationalEntityList.filter(
      customer => {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  getcompanyBranchID(item:any) {
    // console.log(item)
    // if(this.organizationalEntityID === undefined || this.organizationalEntityID===null)
    //   {
    //   this.organizationalEntityID = item.organizationalEntityID;
    //   //this.advanceTableForm.controls['organizationalEntityName'].setValue(item.organizationalEntityName);
    
    // }
    this.organizationalEntityID = item.organizationalEntityID;
    this.advanceTableForm.patchValue({organizationalEntityID:this.organizationalEntityID || this.advanceTable.organizationalEntityID})
    // console.log('Form after setting value:', this.advanceTableForm.value);
   
  }

  //start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('startDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.startDate=formattedDate
  }
  else{
    this.advanceTableForm.get('startDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm.get('endDate')?.setValue(formattedDate);    
} else {
this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.endDate=formattedDate
}
else{
  this.advanceTableForm.get('endDate')?.setValue(formattedDate);
}

} else {
this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
}
}
 
}



