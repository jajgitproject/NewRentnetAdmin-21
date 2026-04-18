// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { BankChargeConfigService } from '../../bankChargeConfig.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { BankChargeConfig } from '../../bankChargeConfig.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { BankDropDown } from '../../bankDropDown.model';
import { BankBranchDropDown } from '../../bankBranchDropDown.model';
import { CardDropDown } from '../../cardDropDown.model';
import { CardProcessingChargeDropDown } from '../../cardProcessingChargeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

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
  advanceTable: BankChargeConfig;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean=true;
  public BankList?: BankDropDown[] = [];
  filteredOptions: Observable<BankDropDown[]>;
  searchTerm:  FormControl = new FormControl();

  public BankBranchList?: BankBranchDropDown[] = [];
  searchBranchTerm:  FormControl = new FormControl();
  filteredBranchOptions: Observable<BankBranchDropDown[]>;

  public CardList?: CardDropDown[] = [];
  searchCardTerm:  FormControl = new FormControl();
  filteredCardOptions: Observable<CardDropDown[]>;

  public CardProcessingChargeList?: CardProcessingChargeDropDown[] = [];
  searchChargeTerm:  FormControl = new FormControl();
  filteredChargeOptions: Observable<CardDropDown[]>;

  image: any;
  fileUploadEl: any;
  bankID: any;
  bankBranchID: any;
  cardID: any;
  cardProcessingChargeID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: BankChargeConfigService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Bank Charge Config';       
          this.advanceTable = data.advanceTable;
          this.searchTerm.setValue(this.advanceTable.bank);
          this.searchBranchTerm.setValue(this.advanceTable.bankBranch);
          this.searchCardTerm.setValue(this.advanceTable.card);
          this.searchChargeTerm.setValue(this.advanceTable.cardProcessingCharge);
          let startDate=moment(this.advanceTable.bankChargeConfigStartDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.bankChargeConfigEndDate).format('DD/MM/yyyy');
          this.onBlurStartDateEdit(startDate);
          this.onBlurEndDateEdit(endDate);
        }
        else 
        {
          this.dialogTitle = 'Bank Charge Config';
          this.advanceTable = new BankChargeConfig({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitBank();
    this.InitCard();
    this.InitCardProcessingCharge();
    
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      bankChargeConfigID: [this.advanceTable.bankChargeConfigID],
      cardID: [this.advanceTable.cardID],
      bankID: [this.advanceTable.bankID],
      bank: [this.advanceTable.bank],
      bankBranchID: [this.advanceTable.bankBranchID],
      card:[this.advanceTable.card],
      bankBranch:[this.advanceTable.bankBranch],
      cardProcessingCharge:[this.advanceTable.cardProcessingCharge],
      cardProcessingChargeID:[this.advanceTable.cardProcessingChargeID],
      bankChargePercentage: [this.advanceTable.bankChargePercentage],
      bankChargeConfigStartDate: [this.advanceTable.bankChargeConfigStartDate,[Validators.required, this._generalService.dateValidator()]],
      bankChargeConfigEndDate: [this.advanceTable.bankChargeConfigEndDate,[Validators.required, this._generalService.dateValidator()]],
      bankChargeConfigCGSTRate:[this.advanceTable.bankChargeConfigCGSTRate],
      bankChargeConfigSGSTRate: [this.advanceTable.bankChargeConfigSGSTRate],
      bankChargeConfigIGSTRate: [this.advanceTable.bankChargeConfigIGSTRate],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  //start date
  onBlurStartDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('bankChargeConfigStartDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('bankChargeConfigStartDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurStartDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.bankChargeConfigStartDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('bankChargeConfigStartDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('bankChargeConfigStartDate')?.setErrors({ invalidDate: true });
    }
  }

  //end date
  onBlurEndDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) 
  {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('bankChargeConfigEndDate')?.setValue(formattedDate);    
  }
  else 
  {
    this.advanceTableForm.get('bankChargeConfigEndDate')?.setErrors({ invalidDate: true });
  }
}

  onBlurEndDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) 
  {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if(this.action==='edit')
    {
      this.advanceTable.bankChargeConfigEndDate=formattedDate
    }
    else{
      this.advanceTableForm.get('bankChargeConfigEndDate')?.setValue(formattedDate);
    }
    
  } else {
    this.advanceTableForm.get('bankChargeConfigEndDate')?.setErrors({ invalidDate: true });
  }
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
  reset(){
    this.advanceTableForm.reset();
  }
  onNoClick():void{
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({bankID:this.bankID});
    this.advanceTableForm.patchValue({bankBranchID:this.bankBranchID});
    this.advanceTableForm.patchValue({cardID:this.cardID});
    this.advanceTableForm.patchValue({cardProcessingChargeID:this.cardProcessingChargeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('BankChargeConfigCreate:BankChargeConfigView:Success');//To Send Updates
       this.saveDisabled = true;
  
    
    },
    error =>
    {
       this._generalService.sendUpdate('BankChargeConfigAll:BankChargeConfigView:Failure');//To Send Updates
       this.saveDisabled = true;
  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({bankID:this.bankID || this.advanceTable.bankID});
    this.advanceTableForm.patchValue({bankBranchID:this.bankBranchID || this.advanceTable.bankBranchID});
    this.advanceTableForm.patchValue({cardID:this.cardID || this.advanceTable.cardID});
    this.advanceTableForm.patchValue({cardProcessingChargeID:this.cardProcessingChargeID || this.advanceTable.cardProcessingChargeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('BankChargeConfigUpdate:BankChargeConfigView:Success');//To Send Updates  
       this.saveDisabled = true;

       
    },
    error =>
    {
     this._generalService.sendUpdate('BankChargeConfigAll:BankChargeConfigView:Failure');//To Send Updates 
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

  InitBank() {
    this._generalService.GetBank().subscribe(
      data =>
      {
         ;
        this.BankList = data;
        this.advanceTableForm.controls['bank'].setValidators([Validators.required,
          this.bankTypeValidator(this.BankList)
        ]);
        this.advanceTableForm.controls['bank'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['bank'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      },
      error =>
      {
       
      }
    );
   }

   private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.BankList.filter(
      customer => 
      {
        return customer.bank.toLowerCase().includes(filterValue);
      }
    );
  }

  onBankSelected(selectedBankName: string) {
    const selectedBank = this.BankList.find(
      data => data.bank === selectedBankName
    );
  
    if (selectedBank) {
      this.getBankID(selectedBank.bankID);
    }
  }

  getBankID(bankID:number)
  {
    this.bankID=bankID;
    this.InitBankBranch();
  }

  bankTypeValidator(BankList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = BankList.some(group => group.bank?.toLowerCase() === value);
      return match ? null : { bankInvalid: true };
    };
  }
  
 InitBankBranch(){
  this._generalService.GetBankBranches(this.bankID).subscribe(
    data=>{
      this.BankBranchList=data;

      this.advanceTableForm.controls['bankBranch'].setValidators([Validators.required,
        this.bankBranchTypeValidator(this.BankBranchList)
      ]);
      this.advanceTableForm.controls['bankBranch'].updateValueAndValidity();
     
      this.filteredBranchOptions = this.advanceTableForm.controls['bankBranch'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterBranch(value || ''))
      );
     
    }
  );
 }
 private _filterBranch(value: string): any {
  const filterValue = value.toLowerCase();
  return this.BankBranchList?.filter(
    customer => 
    {
      return customer.bankBranch.toLowerCase().includes(filterValue);
    }
  );
}
onBranchSelected(selectedBranchName: string) {
  const selectedValue = this.BankBranchList.find(
    data => data.bankBranch === selectedBranchName
  );

  if (selectedValue) {
    this.getBranchID(selectedValue.bankBranchID);
  }
}
getBranchID(bankBranchID: any) {
  this.bankBranchID=bankBranchID;
}

bankBranchTypeValidator(BankBranchList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = BankBranchList.some(group => group.bankBranch?.toLowerCase() === value);
    return match ? null : { bankBranchInvalid: true };
  };
}

 InitCard(){
  this._generalService.GetCard().subscribe(
    data=>{
      this.CardList=data;
      this.advanceTableForm.controls['card'].setValidators([Validators.required,
        this.cardTypeValidator(this.CardList)
      ]);
      this.advanceTableForm.controls['card'].updateValueAndValidity();
      this.filteredCardOptions = this.advanceTableForm.controls['card'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCard(value || ''))
      );
    }
  );
 }

 private _filterCard(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3) {
  //     return [];   
  //   }
  return this.CardList.filter(
    customer => 
    {
      return customer.card.toLowerCase().includes(filterValue);
    }
  );
}
onCardSelected(selectedCardName: string) {
  const selectedValue = this.CardList.find(
    data => data.card === selectedCardName
  );

  if (selectedValue) {
    this.getCardID(selectedValue.cardID);
  }
}
getCardID(cardID: any) {
  this.cardID=cardID;
}

cardTypeValidator(CardList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = CardList.some(group => group.card?.toLowerCase() === value);
    return match ? null : { cardInvalid: true };
  };
}

 InitCardProcessingCharge(){
  this._generalService.GetCardProcessingCharge().subscribe(
    data=>{
      this.CardProcessingChargeList=data;
      this.advanceTableForm.controls['cardProcessingCharge'].setValidators([Validators.required,
        this.cardProcessingChargTypeValidator(this.CardProcessingChargeList)
      ]);
      this.advanceTableForm.controls['cardProcessingCharge'].updateValueAndValidity();
      this.filteredChargeOptions = this.advanceTableForm.controls['cardProcessingCharge'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCharge(value || ''))
      );
    }
  );
 }

 private _filterCharge(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3) {
  //     return [];   
  //   }
  return this.CardProcessingChargeList.filter(
    customer => 
    {
      return customer.cardProcessingCharge.toLowerCase().includes(filterValue);
    }
  );
}
onChargeSelected(selectedChargeName: string) {
  const selectedValue = this.CardProcessingChargeList.find(
    data => data.cardProcessingCharge === selectedChargeName
  );
  if (selectedValue) {
    this.getChargeID(selectedValue.cardProcessingChargeID);
  }
}

getChargeID(cardProcessingChargeID: any) {
 
  this.cardProcessingChargeID=cardProcessingChargeID;
}

cardProcessingChargTypeValidator(CardProcessingChargeList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = CardProcessingChargeList.some(group => group.cardProcessingCharge?.toLowerCase() === value);
    return match ? null : { cardProcessingChargeInvalid: true };
  };
}

}



