// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CardService } from '../../card.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Card } from '../../card.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { PaymentNetworkDropDown } from 'src/app/paymentNetwork/paymentNetworkDropDown.model';
import { CardTypeDropDown } from 'src/app/cardType/cardTypeDropDown.model';
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
  advanceTable: Card;
  public PaymentNetworkList?: PaymentNetworkDropDown[] = [];
  filteredOptions: Observable<PaymentNetworkDropDown[]>;
  searchTerm:  FormControl = new FormControl();
  filteredCardOptions: Observable<CardTypeDropDown[]>;
  searchCardTerm:  FormControl = new FormControl();
  public CardTypeList?: CardTypeDropDown[] = [];
  paymentNetworkID: any;
  cardTypeID: any;
  saveDisabled:boolean=true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CardService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Card';       
          this.advanceTable = data.advanceTable;
          this.searchCardTerm.setValue(this.advanceTable.cardType);
          this.searchTerm.setValue(this.advanceTable.paymentNetwork);
        } else 
        {
          this.dialogTitle = 'Card';
          this.advanceTable = new Card({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void
  {
    this._generalService.GetPaytmentNetwork().subscribe
    (
      data =>   
      {
        this.PaymentNetworkList = data;
        this.advanceTableForm.controls['paymentNetwork'].setValidators([Validators.required,
          this.paymentNetworkTypeValidator(this.PaymentNetworkList)
        ]);
        this.advanceTableForm.controls['paymentNetwork'].updateValueAndValidity();

        this.filteredOptions = this.advanceTableForm.controls['paymentNetwork'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
     
      }
    );

    this._generalService.GetCarType().subscribe
    (
      data =>   
      {
        this.CardTypeList = data;
        this.advanceTableForm.controls['cardType'].setValidators([Validators.required,
          this.cardTypeTypeValidator(this.CardTypeList)
        ]);
        this.advanceTableForm.controls['cardType'].updateValueAndValidity();
        this.filteredCardOptions = this.advanceTableForm.controls['cardType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCard(value || ''))
        );
     
      }
    );
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.PaymentNetworkList.filter(
      customer => 
      {
        return customer.paymentNetwork.toLowerCase().includes(filterValue);
      }
    );
  }
  onPaymentNetworkSelected(selectedPaymentNetworkName: string) {
    const selectedValue = this.PaymentNetworkList.find(
      data => data.paymentNetwork === selectedPaymentNetworkName
    );
  
    if (selectedValue) {
      this.getCardID(selectedValue.paymentNetworkID);
    }
  }
  getCardID(paymentNetworkID: any) {
    this.paymentNetworkID=paymentNetworkID;
  }

  paymentNetworkTypeValidator(PaymentNetworkList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PaymentNetworkList.some(group => group.paymentNetwork?.toLowerCase() === value);
      return match ? null : { paymentNetworkTypeInvalid: true };
    };
  }
  private _filterCard(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CardTypeList.filter(
      customer => 
      {
        return customer.cardType.toLowerCase().includes(filterValue);
      }
    );
  }

  onCardTypeSelected(selectedCardTypeName: string) {
    const selectedValue = this.CardTypeList.find(
      data => data.cardType === selectedCardTypeName
    );
  
    if (selectedValue) {
      this.getCardTypeID(selectedValue.cardTypeID);
    }
  }

  getCardTypeID(cardTypeID: any) {
   
    this.cardTypeID=cardTypeID;
  }

  cardTypeTypeValidator(CardTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CardTypeList.some(group => group.cardType?.toLowerCase() === value);
      return match ? null : { cardTypeInvalid: true };
    };
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      cardID: [this.advanceTable.cardID],
      card: [this.advanceTable.card,[this.noWhitespaceValidator]],
      paymentNetworkID: [this.advanceTable.paymentNetworkID],
      cardTypeID: [this.advanceTable.cardTypeID],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      paymentNetwork:[this.advanceTable.paymentNetwork],
     cardType:[this.advanceTable.cardType],
      updateDateTime: [this.advanceTable.updateDateTime]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
  // console.log(this.advanceTableForm.value);
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
    this.advanceTableForm.patchValue({paymentNetworkID:this.paymentNetworkID});
    this.advanceTableForm.patchValue({cardTypeID:this.cardTypeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
       
          this.dialogRef.close();
         this._generalService.sendUpdate('CardCreate:CardView:Success');//To Send Updates  
         this.saveDisabled = true;
      
    },
    error =>
    {
       this._generalService.sendUpdate('CardAll:CardView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({paymentNetworkID:this.paymentNetworkID || this.advanceTable.paymentNetworkID});
    this.advanceTableForm.patchValue({cardTypeID:this.cardTypeID || this.advanceTable.cardTypeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
       
          this.dialogRef.close();
         this._generalService.sendUpdate('CardUpdate:CardView:Success');//To Send Updates 
         this.saveDisabled = true; 
      
    },
    error =>
    {
     this._generalService.sendUpdate('CardAll:CardView:Failure');//To Send Updates 
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


