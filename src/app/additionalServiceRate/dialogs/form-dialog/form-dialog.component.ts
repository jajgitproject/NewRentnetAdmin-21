// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { AdditionalServiceRateService } from '../../additionalServiceRate.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AdditionalServiceRate } from '../../additionalServiceRate.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { AdditionalServiceRateDropDown } from '../../additionalServiceRateDropDown.model';
// import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import moment from 'moment';
import { CityDropDown } from '../../cityDropDown.model';
import { UomDropDown } from 'src/app/additionalService/uomDropDown.model';
import { ServiceTypeDropDown } from 'src/app/general/serviceTypeDropDown.model';
import { AdditionalServiceDropDown } from 'src/app/general/additionalServiceDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { ServiceTypeDropDown } from 'src/app/serviceType/serviceTypeDropDown.model';
// import { CityDropDown } from 'src/app/general/cityDropDown.model';
// import { CityDropDown } from 'src/app/city/cityDropDown.model';

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
  advanceTable: AdditionalServiceRate;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean=true;
 
  public CityList?: CityDropDown[] = [];
  filteredCityOptions: Observable<CityDropDown[]>;
  searchCityTerm: FormControl = new FormControl();

  public uomList?: UomDropDown[] = [];
  public additionalList?: AdditionalServiceDropDown[] = [];

  image: any;
  fileUploadEl: any;
  UOMID: any;
  ServiceID: any;
  service: string;
  geoPointCityID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AdditionalServiceRateService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          debugger;
          this.dialogTitle ='Additional Service Rate';       
          this.advanceTable = data.advanceTable;
          this.searchCityTerm.setValue(this.advanceTable.geoPointName);
          
          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(startDate);
          this.onBlurUpdateEndDateEdit(endDate);
          //this.ImagePath=this.advanceTable.flagIcon;
        } else 
        {
          this.dialogTitle = 'Additional Service Rate';
          this.advanceTable = new AdditionalServiceRate({});
          this.advanceTable.activationStatus= true;

        }
        this.advanceTableForm = this.createContactForm();
         this.UOMID=data.uomID;
         //.log(this.UOMID)
         this.ServiceID=data.serviceTypeID
         
  }
  public ngOnInit(): void
  {
    this._generalService.GetCitiessAll().subscribe
    (
      data =>   
      {
        this.CityList = data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
          this.cityTypeValidator(this.CityList)
        ]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        );
        
      }
    );
    this.getUom();
    this.getseviceName();
  }

  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCitySelected(selectedCityName: string) {
    const selectedValue = this.CityList.find(
      data => data.geoPointName === selectedCityName
    );  
    if (selectedValue) {
      this.getCityID(selectedValue.geoPointID);
    }
  }
  getCityID(geoPointID: any) {
    this.geoPointCityID=geoPointID;
 
  }

  cityTypeValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { cityTypeInvalid: true };
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
      additionalServiceRateID: [this.advanceTable.additionalServiceRateID],
      additionalServiceID: [this.advanceTable.additionalServiceID,],
      serviceTypeName : [this.advanceTable.serviceTypeName,],
      serviceType : [this.advanceTable.serviceType,],
      cityID:[this.advanceTable.cityID,],
      city:[this.advanceTable.geoPointName,],
      uom:[this.advanceTable.uom,],
      rate:[this.advanceTable.rate,],
      startDate:[this.advanceTable.startDate,[Validators.required, this._generalService.dateValidator()]],
      activationStatus: [this.advanceTable.activationStatus],
      endDate: [this.advanceTable.endDate],
 
    });
  }

//   public noWhitespaceValidator(control: FormControl) {
//     const isWhitespace = (control.value || '').trim().length === 0;
//     const isValid = !isWhitespace;
//     return isValid ? null : { 'whitespace': true };
// }

  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.value.startDate=new Date("01/02/2025");
    this.advanceTableForm.value.endDate=moment(this.advanceTableForm.value.endDate).format('DD-MMM-YYYY');
    this.advanceTableForm.patchValue({additionalServiceID:this.ServiceID ||this.ServiceID })
    this.advanceTableForm.patchValue({cityID:this.geoPointCityID || this.geoPointCityID})
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.dialogRef.close();
       this._generalService.sendUpdate('AdditionalServiceRateCreate:AdditionalServiceRateView:Success');//To Send Updates  
       this.saveDisabled = true;
    
  },
    error =>
    {
       this._generalService.sendUpdate('AdditionalServiceRateAll:AdditionalServiceRateView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    ;
    this.advanceTableForm.value.startDate=moment(this.advanceTableForm.value.startDate).format('DD-MM-YYYY');
    this.advanceTableForm.value.endDate=moment(this.advanceTableForm.value.endDate).format('DD-MMM-YYYY');
    this.advanceTableForm.patchValue({cityID:this.geoPointCityID || this.advanceTable.cityID})
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('AdditionalServiceRateUpdate:AdditionalServiceRateView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('AdditionalServiceRateAll:AdditionalServiceRateView:Failure');//To Send Updates 
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
  // OnAdditionalServiceRateChangeGetcurrencies()
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
  getUom(){
    this._generalService.getUOM(this.UOMID).subscribe(
      data=>{
       this.uomList=data;
       this.advanceTableForm.patchValue({uom:this.uomList[0].uom});
      }
    )
  }

  getseviceName(){
    this._generalService.getSeviceName(this.ServiceID).subscribe(
      data=>{
       this.additionalList=data;
       this.service= this.additionalList[0].additionalService;
      
      }
    )
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

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;
  // 

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //   
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



