// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CurrencyExchangeRateService } from '../../currencyExchangeRate.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CurrencyExchangeRate } from '../../currencyExchangeRate.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyExchangeRateDropDown } from '../../currencyExchangeRateDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import moment from 'moment';
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
  advanceTable: CurrencyExchangeRate;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled :boolean= true;
 
  public CurrencyList?: CurrencyDropDown[] = [];
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<CurrencyDropDown[]>;
  image: any;
  fileUploadEl: any;
  currencyID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CurrencyExchangeRateService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Currency Exchange Rate';       
          this.advanceTable = data.advanceTable;
          this.searchTerm.setValue(this.advanceTable.currencyName); 
          let startDate=moment(this.advanceTable.applicableFrom).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.applicableTo).format('DD/MM/yyyy');
          this.onBlurFromDateEdit(startDate);
          this.onBlurToDateEdit(endDate);
          //this.ImagePath=this.advanceTable.flagIcon;
        } else 
        {
          this.dialogTitle = 'Currency Exchange Rate';
          this.advanceTable = new CurrencyExchangeRate({});
          this.advanceTable.activationStatus= true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this._generalService.GetCurrencies().subscribe
    (
      data =>   
      {
        this.CurrencyList = data;
        this.advanceTableForm.controls['currencyName'].setValidators([this.currencyValidator(this.CurrencyList)
        ]);
        this.advanceTableForm.controls['currencyName'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['currencyName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
        
      }
    );
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CurrencyList.filter(
      data => 
      {
        return data.currencyName.toLowerCase().includes(filterValue);
      }
    );
  };

  OnCurrencySelect(selectedCurrency: string)
  {
    const selectedCountry = this.CurrencyList.find(
      currency => currency.currencyName === selectedCurrency
    );
    if (selectedCurrency) 
    {
      this.getTierID(selectedCountry.currencyID);
    }
  }

  getTierID(currencyID: any) 
  {  
    this.currencyID=currencyID;
  }

  currencyValidator(CurrencyList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CurrencyList.some(group => group.currencyName?.toLowerCase() === value);
      return match ? null : { currencyNameInvalid: true };
    };
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
      currencyExchangeRateID: [this.advanceTable.currencyExchangeRateID],
      currencyID: [this.advanceTable.currencyID,],
      exchangeDate : "2022-12-10 00:00:00.000",
      exchangeRate : [this.advanceTable.exchangeRate],
      currencyName:[this.advanceTable.currencyName],
      source : [this.advanceTable.source],
      applicableFrom:[this.advanceTable.applicableFrom,[Validators.required, this._generalService.dateValidator()]],
      activationStatus: [this.advanceTable.activationStatus],
      applicableTo: [this.advanceTable.applicableTo,[Validators.required, this._generalService.dateValidator()]],
 
    });
  }

    //from date
    onBlurFromDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);    
      const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) 
      {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('applicableFrom')?.setValue(formattedDate);    
      }
      else
      {
        this.advanceTableForm.get('applicableFrom')?.setErrors({ invalidDate: true });
      }
    }
    
    onBlurFromDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) 
      {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        if(this.action==='edit')
        {
          this.advanceTable.applicableFrom=formattedDate
        }
        else
        {
          this.advanceTableForm.get('applicableFrom')?.setValue(formattedDate);
        }  
      } 
      else 
      {
        this.advanceTableForm.get('applicableFrom')?.setErrors({ invalidDate: true });
      }
    }
    
    //to date
    onBlurToDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);  
      const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) 
      {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('applicableTo')?.setValue(formattedDate);    
      }
      else 
      {
        this.advanceTableForm.get('applicableTo')?.setErrors({ invalidDate: true });
      }
    }
    
    onBlurToDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) 
      {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        if(this.action==='edit')
        {
          this.advanceTable.applicableTo=formattedDate
        }
        else{
          this.advanceTableForm.get('applicableTo')?.setValue(formattedDate);
        }
        
      } else {
        this.advanceTableForm.get('applicableTo')?.setErrors({ invalidDate: true });
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
  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({currencyID:this.currencyID});
    this.advanceTableForm.value.applicableFrom=moment(this.advanceTableForm.value.applicableFrom).format('DD-MM-YYYY');
    this.advanceTableForm.value.applicableTo=moment(this.advanceTableForm.value.applicableTo).format('DD-MMM-YYYY');
   
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.dialogRef.close();
       this._generalService.sendUpdate('CurrencyExchangeRateCreate:CurrencyExchangeRateView:Success');//To Send Updates
       this.saveDisabled = true;  
    
  },
    error =>
    {
       this._generalService.sendUpdate('CurrencyExchangeRateAll:CurrencyExchangeRateView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({currencyID:this.currencyID || this.advanceTable.currencyID});
    this.advanceTableForm.value.applicableTo=moment(this.advanceTableForm.value.applicableTo).format('DD-MM-YYYY hh:mm:ss');
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('CurrencyExchangeRateUpdate:CurrencyExchangeRateView:Success');//To Send Updates
       this.saveDisabled = true;  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CurrencyExchangeRateAll:CurrencyExchangeRateView:Failure');//To Send Updates  
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
  // OnCurrencyExchangeRateChangeGetcurrencies()
  // {
  //   this._generalService.GetCurrencies(this.advanceTableForm.get("nativeCurrencyID").value).subscribe(
  //     data =>
  //      {
  //       this.CurrencyList = data;
  //      },
  //      error =>
  //      {
  //      }
  //   );
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

  //   console.log(`files: `, files);

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     console.log('onloaded', contents);
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
keyPressNumbersDecimal(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}

// Only AlphaNumeric
keyPressAlphaNumeric(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

}



