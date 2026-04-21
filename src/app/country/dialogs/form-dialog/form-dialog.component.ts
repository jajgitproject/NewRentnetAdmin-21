// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CountryService } from '../../country.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Country } from '../../country.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Address } from '@compat/google-places-shim-objects/address';
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
  advanceTable: Country;
  options: any = {
    // componentRestrictions: { country: 'IN' }
  }
  geoStringAddress:any;

  public CurrencyList?: CurrencyDropDown[] = [];
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<CurrencyDropDown[]>;
  image: any;
  fileUploadEl: any;
  currencyID: any;
  saveDisabled: boolean = true;
  constructor(public countryService: CountryService,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CountryService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Country';       
          this.advanceTable = data.advanceTable;
          
          this.ImagePath=this.advanceTable.bannerImage;
          this.ImagePath1=this.advanceTable.icon;
          this.ImagePath2=this.advanceTable.countryFlagIcon;
          var value = this.advanceTable.geoLocation.replace(
            '(',
            ''
          );
          value = value.replace(')', '');
          var lat = value.split(' ')[2];
          var long = value.split(' ')[1];

          this.advanceTable.latitude=lat;
          this.advanceTable.longitude=long;

        } else 
        {
          this.dialogTitle = 'Country';
          this.advanceTable = new Country({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitCurrencies();
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
      geoPointID: [this.advanceTable.geoPointID],
      geoLocation: [this.advanceTable.geoLocation],
      geoSearchString : [this.advanceTable.geoSearchString,[this.googlePickupValidator()]],
      geoPointName: [this.advanceTable.geoPointName],
      oldRentNetGeoPointName: [this.advanceTable.oldRentNetGeoPointName],
      countryISDCode : [this.advanceTable.countryISDCode],
      countryCurrencyID: [this.advanceTable.countryCurrencyID],
      countryISOCode : [this.advanceTable.countryISOCode],
      countryFlagIcon: [this.advanceTable.countryFlagIcon],
      currencyName:[this.advanceTable.currencyName],
      apiIntegrationCode : [this.advanceTable.apiIntegrationCode],
      bannerImage: [this.advanceTable.bannerImage],
      bannerImageAltTag : [this.advanceTable.bannerImageAltTag],
      icon: [this.advanceTable.icon],
      iconAltTag : [this.advanceTable.iconAltTag],
      latitude:[this.advanceTable.latitude],
      longitude:[this.advanceTable.longitude],
      activationStatus:[this.advanceTable.activationStatus],
      googlePlacesID:[this.advanceTable.googlePlacesID]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

AddressChange(address: Address) {
  // this.geoLat=address.geometry.location.lat();
  // this.geoLng=address.geometry.location.lng();
  this.geoStringAddress=address.formatted_address;
  this.advanceTableForm.patchValue({latitude:address.geometry.location.lat()});
  this.advanceTableForm.patchValue({longitude:address.geometry.location.lng()}); 
  this.advanceTableForm.patchValue({googlePlacesID:address.place_id}); 
    this.advanceTableForm.get('geoSearchString')?.updateValueAndValidity();
}


InitCurrencies() {
 this._generalService.GetCurrency().subscribe(
   data =>
   {
     this.CurrencyList = data;
     this.advanceTableForm.controls['currencyName'].setValidators([this.currencyValidator(this.CurrencyList)
     ]);
    //  this.advanceTableForm.controls['currencyName'].updateValueAndValidity();

     this.filteredOptions = this.advanceTableForm.controls['currencyName'].valueChanges.pipe(
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
  //     return [];   
  //   }
  return this.CurrencyList.filter(
    customer => 
    {
      return customer.currencyName.toLowerCase().includes(filterValue);
    }
  );
  
};
onCurrencySelected(selectedCurrencyName: string) {
  const selectedValue = this.CurrencyList.find(
    data => data.currencyName === selectedCurrencyName
  );  
  if (selectedValue) {
    this.getTierID(selectedValue.currencyID);
  }
}

getTierID(currencyID: any) {
  
  this.currencyID=currencyID;
}

currencyValidator(CurrencyList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
     if (!control.value) {
          return null; // No value to validate, return null (no error)
        }
    const value = control.value?.toLowerCase();
    const match = CurrencyList.some(group => group.currencyName?.toLowerCase() === value);
    return match ? null : { currencyNameInvalid: true };
  };
}
onCurrencyInputChange(event: any) {
  if(event.keyCode===8){
    this.currencyID = 0;
   }

}
  submit() 
  {
    // emppty stuff
  }
  reset(){
    this.advanceTableForm.reset();
    this.ImagePath="";
    this.ImagePath1="";
  }

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
      this.ImagePath="";
    this.ImagePath1="";
    this.ImagePath2="";
    } else {
      this.dialogRef.close();
    }
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({geoLocation:this.advanceTableForm.value.latitude
       +
        ',' +
        this.advanceTableForm.value.longitude
    });
    this.advanceTableForm.patchValue({geoSearchString:this.geoStringAddress});
    this.advanceTableForm.patchValue({countryCurrencyID:this.currencyID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {       
    if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
  this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
  this.saveDisabled = true;
}  
else{
  this.dialogRef.close();

  this._generalService.sendUpdate('CountryUpdate:CountryView:Success');//To Send Updates  
  this.saveDisabled = true;

}  
   
  },
    error =>
    {
       this._generalService.sendUpdate('CountryAll:CountryView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({geoLocation:this.advanceTableForm.value.latitude
      +
       ',' +
       this.advanceTableForm.value.longitude
   });
   this.advanceTableForm.patchValue({geoSearchString:this.geoStringAddress || this.advanceTable.geoSearchString});
   this.advanceTableForm.patchValue({countryCurrencyID:this.currencyID || this.advanceTable.countryCurrencyID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        this.saveDisabled = true;
      } 
      else{
        this.dialogRef.close();

        this._generalService.sendUpdate('CountryUpdate:CountryView:Success');//To Send Updates  
        this.saveDisabled = true;
 
      }
       
    },
    error =>
    {
     this._generalService.sendUpdate('CountryAll:CountryView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
  }
  public confirmAdd(): void 
  {
     ;
     this.saveDisabled = false;
       if(this.action=="edit")
       {
          this.Put();
          // this.dialogRef.afterClosed().subscribe((res: any) => {
          //   this.loadData();
          // })
       }
       else
       {
         ;
          this.Post();
          // this.dialogRef.afterClosed().subscribe((res: any) => {
          //   this.loadData();
          // })
       }
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  public ImagePath1: string = "";
  public ImagePath2: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({bannerImage:this.ImagePath})
  }

  public ImageUpload = (event) => 
  {
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({icon:this.ImagePath1})
  }

  public FlagIcon = (event) => 
  {
    this.response = event;
    this.ImagePath2 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({countryFlagIcon:this.ImagePath2})
  }

  onPickupTyping() {
    this.advanceTableForm.patchValue({
      latitude: null,
      longitude: null
    });
  
    this.advanceTableForm.get('geoSearchString')?.updateValueAndValidity();
  }
  
  
  googlePickupValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
  
      if (!control.parent) return null;
  
      const latitude = control.parent.get('latitude')?.value;
      const value = control.value;
  
      // Agar empty hai to required handle karega
      if (!value) return null;
  
      // Agar latitude nahi hai → dropdown select nahi hua
      if (!latitude) {
        return { invalidGeoSearchString: true };
      }
  
      return null;
    };
  }
}


