// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject, Optional } from '@angular/core';
import { DriverDrivingLicenseService } from '../../driverDrivingLicense.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DriverDrivingLicense } from '../../driverDrivingLicense.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DriverDrivingLicenseDropDown } from '../../driverDrivingLicenseDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { LicenseVerificationComponent } from '../license-verification/license-verification.component';
import { AllCitiesDropDown } from 'src/app/customerPersonDrivingLicense/allCitiesDropDown.model';
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
  advanceTable: DriverDrivingLicense;
  searchTerm : FormControl = new FormControl();
  searchCityTerm : FormControl = new FormControl();
 
  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;

  public EmployeeList?: EmployeeDropDown[]=[];
  saveDisabled:boolean=true;
  image: any;
  fileUploadEl: any;
  addressGeoPointID: any;
  customerPersonName: any;
  issuingGeoPointID: any;
  driverName: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverDrivingLicenseService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Driving License Details';       
          this.advanceTable = data.advanceTable;
          this.ImagePath=this.advanceTable.licenseImage;
          this.searchTerm.setValue(this.advanceTable.addressCity);
          this.searchCityTerm.setValue(this.advanceTable.issuingCity);
                  
            var vd=this.advanceTable.verificationDate.split(' ');
         
            var re=/\-/gi;
            var verifyDate=vd[0].replace(re,'/');
          
            this.advanceTable.verificationDate=verifyDate;
          
          if(this.advanceTable.verified==='true')
          {
            this.advanceTable.verifiedData="Verified";
          }
          if(this.advanceTable.verified==='false')
          {
            this.advanceTable.verifiedData="Rejected";
          }

          let uploadEditedDate=moment(this.advanceTable.uploadEditedDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(uploadEditedDate);
          let drivingLicenseExpiryDate=moment(this.advanceTable.drivingLicenseExpiryDate).format('DD/MM/yyyy');
          this.onBlurDrivingLicenseExpiryDateEdit(drivingLicenseExpiryDate);
              
        } else 
        {
          this.dialogTitle = 'Driving License Details';
          this.advanceTable = new DriverDrivingLicense({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.verifiedData='N/A';
          this.advanceTable.verified='true';
          this.advanceTable.verifiedBy='N/A';
          this.advanceTable.verificationRemark='N/A';
          this.advanceTable.verificationDate=('N/A');
          this.uploadedByName();
        }
        this.advanceTableForm = this.createContactForm();
        this.driverName=data.DriverName;
  }
  public ngOnInit(): void
  {
    this.InitCities();
    this.InitIssuingCity()
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['addressCity'].setValidators([Validators.required,
          this.cityTypesValidator(this.CityList)
        ]);
        this.advanceTableForm.controls['addressCity'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['addressCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.CityList.filter(customer =>
    customer.geoPointName.toLowerCase().includes(filterValue)
  );
}


  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.CityList.filter(
  //     customer => 
  //     {
  //       return customer.geoPointName.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }

  OnCitySelect(selectedCity: string)
  {
    const CityName = this.CityList.find(
      data => data.geoPointName === selectedCity
    );
    if (selectedCity) 
    {
      this.getTitle(CityName.geoPointID);
    }
  }

  getTitle(geoPointID: any) {
    this.addressGeoPointID = geoPointID;
    this.advanceTable.driverAddressCityID = geoPointID;
    this.advanceTableForm.controls['driverAddressCityID'].setValue(geoPointID);
  }

  cityTypesValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { addressCityInvalid: true };
    };
  }

  InitIssuingCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CitiesList=data;
        this.advanceTableForm.controls['issuingCity'].setValidators([Validators.required,
          this.cityTypeValidator(this.CitiesList)
        ]);
        this.advanceTableForm.controls['issuingCity'].updateValueAndValidity();

        this.filteredCityOptions = this.advanceTableForm.controls['issuingCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtering(value || ''))
        ); 
      });
  }

  private _filtering(value: string): any {
  const filteringValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filteringValue.length < 3) {
    return [];
  }

  return this.CitiesList.filter(city =>
    city.geoPointName.toLowerCase().includes(filteringValue)
  );
}

  // private _filtering(value: string): any {
  //   const filteringValue = value.toLowerCase();
  //   return this.CitiesList.filter(
  //     city => 
  //     {
  //       return city.geoPointName.toLowerCase().includes(filteringValue);
  //     }
  //   );
  // }

  OnCitySelected(selectedCity: string)
  {
    const CityName = this.CitiesList.find(
      data => data.geoPointName === selectedCity
    );
    if (selectedCity) 
    {
      this.getTitles(CityName.geoPointID);
    }
  }
  getTitles(geoPointID: any) {
    console.log(Option)
    this.issuingGeoPointID=geoPointID;
    this.advanceTableForm.controls['issuingGeoPointID'].setValue(geoPointID);
  }

  cityTypeValidator(CitiesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CitiesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { issuingCityInvalid: true };
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
      driverDrivingLicenseID: [this.advanceTable.driverDrivingLicenseID],
      driverID: [this.advanceTable.driverID],
      driverAddressCityID: [this.advanceTable.driverAddressCityID],
      permanentAddress: [this.advanceTable.permanentAddress],
      drivingLicenseNo: [this.advanceTable.drivingLicenseNo],
      licenseImage: [this.advanceTable.licenseImage],
      reasonOfLicenseImageNonAvailblity: [this.advanceTable.reasonOfLicenseImageNonAvailblity],
      licenseIssueCityID: [this.advanceTable.licenseIssueCityID],
      issuingCity: [this.advanceTable.issuingCity],
      licenseAuthorityName: [this.advanceTable.licenseAuthorityName],
      uploadedByID: [this.advanceTable.uploadedByID],
      uploadedBy:[this.advanceTable.uploadedBy],
      uploadEditedDate: [this.advanceTable.uploadEditedDate],
      drivingLicenseExpiryDate: [this.advanceTable.drivingLicenseExpiryDate],
      uploadRemark: [this.advanceTable.uploadRemark],
      activationStatus: [this.advanceTable.activationStatus],
      verified: [this.advanceTable.verified],
      verifiedBy: [this.advanceTable.verifiedBy],
      verificationRemark: [this.advanceTable.verificationRemark],
      verificationDate: [this.advanceTable.verificationDate],
      addressCity: [this.advanceTable.addressCity],
      verifiedData:[this.advanceTable.verifiedData]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

uploadedByName(){
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>{
      this.EmployeeList=data;
      this.advanceTableForm?.patchValue({uploadedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
    }
  );
}

  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({driverAddressCityID:this.addressGeoPointID});
    this.advanceTableForm.patchValue({licenseIssueCityID:this.issuingGeoPointID});
    this.advanceTableForm.patchValue({driverID:this.data.DriverID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverDrivingLicenseCreate:DriverDrivingLicenseView:Success');//To Send Updates
       this.saveDisabled = true;  
    
    },
    error =>
    {
       this._generalService.sendUpdate('DriverDrivingLicenseAll:DriverDrivingLicenseView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({driverAddressCityID:this.addressGeoPointID || this.advanceTable.driverAddressCityID});
    this.advanceTableForm.patchValue({licenseIssueCityID:this.issuingGeoPointID || this.advanceTable.licenseIssueCityID});
    this.advanceTableForm.patchValue({driverID:this.advanceTable.driverID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverDrivingLicenseUpdate:DriverDrivingLicenseView:Success');//To Send Updates
       this.saveDisabled = true;  
       
    },
    error =>
    {
     this._generalService.sendUpdate('DriverDrivingLicenseAll:DriverDrivingLicenseView:Failure');//To Send Updates
     this.saveDisabled = true;  
    }
  )
  }

  public confirmAdd(): void 
  {
    this.saveDisabled = false;
    console.log(`confirmAdd`, this.advanceTable.verified);
       if(this.action=="edit")
       {  
        if(this.advanceTable.verified==='Verified'){
          this.licenceVerification();      
        }     
        if(this.advanceTable.verified==='Rejected'){
          this.Put();      
        }    
       }
       else
       {
          this.Post();
       }
  }
//start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('uploadEditedDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('uploadEditedDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.uploadEditedDate=formattedDate
  }
  else{
    this.advanceTableForm.get('uploadEditedDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('uploadEditedDate')?.setErrors({ invalidDate: true });
}
}

//start date
onBlurDrivingLicenseExpiryDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('drivingLicenseExpiryDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('drivingLicenseExpiryDate')?.setErrors({ invalidExpDate: true });
}
}

onBlurDrivingLicenseExpiryDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.drivingLicenseExpiryDate=formattedDate
  }
  else{
    this.advanceTableForm.get('drivingLicenseExpiryDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('drivingLicenseExpiryDate')?.setErrors({ invalidExpDate: true });
}
}

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({licenseImage:this.ImagePath})
  }

  licenceVerification()
  {
    const dialogRef = this.dialog.open(LicenseVerificationComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          advanceTableForm:this.advanceTableForm,
          addressGeoPointID:this.addressGeoPointID,
          issuingGeoPointID:this.issuingGeoPointID,
          driverID:this.advanceTable.driverID,
          dialogRefrence:this.dialogRef
        }
    });
  }

}



