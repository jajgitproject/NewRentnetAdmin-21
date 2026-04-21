// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject ,OnInit} from '@angular/core';
import { StateService } from '../../state.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { State } from '../../state.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { StateDropDown } from '../../stateDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import moment from 'moment';
import { GeoCountryDropDown } from 'src/app/general/geoCountryDropDown.model';
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
  advanceTable: State;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public CurrencyList?: CurrencyDropDown[] = [];
  public GeoPointList?: GeoCountryDropDown[] = [];
  filteredSpotInCityOptions: Observable<GeoCountryDropDown[]>;
  searchSpotInCity: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  geoStringAddress: string;
  geoPointParentID: any;
  saveDisabled:boolean=true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: StateService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit State';       
          this.dialogTitle ='State';
          this.advanceTable = data.advanceTable;
          this.ImagePath=this.advanceTable.bannerImage;
          this.ImagePath1=this.advanceTable.icon;
          var value = this.advanceTable.geoLocation.replace(
            '(',
            ''
          );
          value = value.replace(')', '');
          var lat = value.split(' ')[2];
          var long = value.split(' ')[1];

          this.advanceTable.latitude=lat;
          this.advanceTable.longitude=long;
          this.advanceTable.country=this.advanceTable.parent;
        } else 
        {
          //this.dialogTitle = 'Create State';
          this.dialogTitle = 'State';
          this.advanceTable = new State({});
          this.advanceTable.activationStatus= true;
        }
        this.advanceTableForm = this.createContactForm();
  }
 
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  options: any = {
    // componentRestrictions: { country: 'IN' }
  }  
  handleAddressChange(address: Address) {
    this.geoStringAddress=address.formatted_address;
    this.advanceTableForm.patchValue({latitude:address.geometry.location.lat()});
    this.advanceTableForm.patchValue({longitude:address.geometry.location.lng()});
    this.advanceTableForm.patchValue({googlePlacesID:address.place_id});
       this.advanceTableForm.get('geoSearchString')?.updateValueAndValidity(); 
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
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  public ngOnInit(): void
  {
    this.InitGeoPointTypes();
  }

  InitGeoPointTypes(){
    this._generalService.GetGeoPoint().subscribe(
      data=>
      {
        this.GeoPointList=data;
        this.advanceTableForm.controls['country'].setValidators([Validators.required,
          this.countryNameValidator(this.GeoPointList)
        ]);
        this.advanceTableForm.controls['country'].updateValueAndValidity();
        this.filteredSpotInCityOptions = this.advanceTableForm.controls["country"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSpotInCity(value || ''))
        ); 
      });
  }
  
  private _filterSpotInCity(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.GeoPointList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  } 

  onCountrySelected(selectedCountryName: string) {
    const selectedCountry = this.GeoPointList.find(
      country => country.geoPointName === selectedCountryName
    );
  
    if (selectedCountry) {
      this.geoPointParentID = selectedCountry.geoPointID; // Directly assigning the ID
    }
}
  
  getTitles(item: any) {
    this.geoPointParentID = item.geoPointID;
  }

  countryNameValidator(GeoPointList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = GeoPointList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { countryNameInvalid: true };
    };
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      geoPointID: [this.advanceTable.geoPointID],
      geoPointParentID: [this.advanceTable.geoPointParentID,],
      geoLocation : [this.advanceTable.geoLocation],
      geoSearchString : [this.advanceTable.geoSearchString, this.googlePickupValidator()],
      geoPointName : [this.advanceTable.geoPointName],
      stateGSTCode:[this.advanceTable.stateGSTCode],
      apiIntegrationCode : [this.advanceTable.apiIntegrationCode],
      bannerImage : [this.advanceTable.bannerImage],
      bannerImageAltTag : [this.advanceTable.bannerImageAltTag],
       oldRentNetGeoPointName: [this.advanceTable.oldRentNetGeoPointName],
      icon:[this.advanceTable.icon],
      activationStatus: [this.advanceTable.activationStatus],
      iconAltTag: [this.advanceTable.iconAltTag],
      latitude: [this.advanceTable.latitude],
      longitude: [this.advanceTable.longitude],
      geoPoint_1: [this.advanceTable.geoPoint_1],
      country: [this.advanceTable.country],
      googlePlacesID:[this.advanceTable.googlePlacesID]
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
  onNoClick(): void 
  {
   
    if(this.action==='add'){
      this.ImagePath1="";
      this.ImagePath="";
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
   
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({ geoPointParentID: this.geoPointParentID });
    this.advanceTableForm.patchValue({geoLocation:this.advanceTableForm.value.latitude
      +
       ',' +
      
       this.advanceTableForm.value.longitude
   });
   this.advanceTableForm.patchValue({geoSearchString:this.geoStringAddress});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        this.saveDisabled = true;
    } 
    else
    {
      this.dialogRef.close();
       this._generalService.sendUpdate('StateCreate:StateView:Success');//To Send Updates
       this.saveDisabled = true;  
    }
       
    
  },
    error =>
    {
       this._generalService.sendUpdate('StateAll:StateView:Failure');//To Send Updates
       this.saveDisabled = true;   
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({ geoPointParentID: this.geoPointParentID ||this.advanceTable.geoPointParentID });
    this.advanceTableForm.patchValue({geoLocation:this.advanceTableForm.value.latitude
      +
       ',' +
      
       this.advanceTableForm.value.longitude
   });

   this.advanceTableForm.patchValue({geoSearchString:this.geoStringAddress || this.advanceTable.geoSearchString});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        this.saveDisabled = true;
    } 
    else
    {
      this.dialogRef.close();
       this._generalService.sendUpdate('StateUpdate:StateView:Success');//To Send Updates 
       this.saveDisabled = true; 

    }
        
       
    },
    error =>
    {
     this._generalService.sendUpdate('StateAll:StateView:Failure');//To Send Updates 
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
  // OnStateChangeGetcurrencies()
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
  public ImagePath1: string = "";
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({bannerImage:this.ImagePath})
  }

  public uploadICon = (event) => 
  {
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({icon:this.ImagePath1})
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
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



