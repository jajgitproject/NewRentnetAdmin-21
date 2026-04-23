// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerPersonDrivingLicenseService } from '../../customerPersonDrivingLicense.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import { CustomerPersonDrivingLicense } from '../../customerPersonDrivingLicense.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerPersonDrivingLicenseDropDown } from '../../customerPersonDrivingLicenseDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { AllCitiesDropDown } from '../../allCitiesDropDown.model';
import { LicenseVerificationComponent } from '../license-verification/license-verification.component';
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
  advanceTable: CustomerPersonDrivingLicense;
  searchTerm : FormControl = new FormControl();
  searchCityTerm : FormControl = new FormControl();
 
  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;

  public EmployeeList?: EmployeeDropDown[]=[];

  image: any;
  fileUploadEl: any;
  addressGeoPointID: any;
  customerPersonName: any;
  issuingGeoPointID: any;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerPersonDrivingLicenseService,
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
          let expiryDate=moment(this.advanceTable.uploadEditedDate).format('DD/MM/yyyy');
          this.onBlurUploadDateEdit(expiryDate);

          var vd=this.advanceTable.verificationDate.split(' ');
          var re=/\-/gi;
          var verifyDate=vd[0].replace(re,'/');
      
          this.advanceTable.verificationDate=verifyDate;

          if (this.advanceTable.verified === 'true') {
            this.advanceTable.verifiedData = "Verified"
          }
          if (this.advanceTable.verified === 'false') {
            this.advanceTable.verifiedData = "Rejected"
          }
        } else 
        {
          this.dialogTitle = 'Driving License Details';
          this.advanceTable = new CustomerPersonDrivingLicense({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.verifiedData='N/A';
          this.advanceTable.verified='true';
          this.advanceTable.verifiedBy='N/A';
          this.advanceTable.verificationRemark='N/A';
          this.advanceTable.verificationDate=('N/A');
          this.uploadedByName();
        }
        this.advanceTableForm = this.createContactForm();
        this.customerPersonName=data.CustomerPersonName;
  }
  public ngOnInit(): void
  {
    this.InitCities();
    this.InitIssuingCity()
  }

  addressCityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { addressCityInvalid: true };
    };
  }

  issuingCityValidator(CitiesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CitiesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { issuingCityInvalid: true };
    };
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['addressCity'].setValidators([Validators.required,
          this.addressCityValidator(this.CityList)
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
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
  }
  OnAddressCitySelect(selectedAddressCity: string)
  {
    const AddressCityName = this.CityList.find(
      data => data.geoPointName === selectedAddressCity
    );
    if (selectedAddressCity) 
    {
      this.getTitle(AddressCityName.geoPointID);
    }
  }
  getTitle(geoPointId: any)
  {
    this.addressGeoPointID=geoPointId;
  }

  InitIssuingCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CitiesList=data;
        this.advanceTableForm.controls['issuingCity'].setValidators([Validators.required,
          this.issuingCityValidator(this.CitiesList)
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
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CitiesList.filter(
      city => 
      {
        return city.geoPointName.toLowerCase().includes(filteringValue);
      });
  }
  OnIssuingCitySelect(selectedIssuingCity: string)
  {
    const IssuingCityName = this.CitiesList.find(
      data => data.geoPointName === selectedIssuingCity
    );
    if (selectedIssuingCity) 
    {
      this.getTitles(IssuingCityName.geoPointID);
    }
  }
  getTitles(geoPointId: any) {
    this.issuingGeoPointID=geoPointId;
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
      customerPersonDrivingLicenseID: [this.advanceTable.customerPersonDrivingLicenseID],
      customerPersonID: [this.advanceTable.customerPersonID],
      customerPersonAddressCityID: [this.advanceTable.customerPersonAddressCityID],
      permanentAddress: [this.advanceTable.permanentAddress],
      drivingLicenseNo: [this.advanceTable.drivingLicenseNo],
      licenseImage: [this.advanceTable.licenseImage],
      reasonOfLicenseImageNonAvailblity: [this.advanceTable.reasonOfLicenseImageNonAvailblity],
      licenseIssueCityID: [this.advanceTable.licenseIssueCityID],
      licenseAuthorityName: [this.advanceTable.licenseAuthorityName],
      uploadedByID: [this.advanceTable.uploadedByID],
      uploadedBy:[this.advanceTable.uploadedBy],
      uploadEditedDate: [this.advanceTable.uploadEditedDate,[Validators.required, this._generalService.dateValidator()]],
      uploadRemark: [this.advanceTable.uploadRemark],
      activationStatus: [this.advanceTable.activationStatus],
      verified: [this.advanceTable.verified],
      verifiedBy: [this.advanceTable.verifiedBy],
      verificationRemark: [this.advanceTable.verificationRemark],
      verificationDate: [this.advanceTable.verificationDate],
      addressCity: [this.advanceTable.addressCity],
      issuingCity: [this.advanceTable.issuingCity],
      verifiedData:[this.advanceTable.verifiedData]
    });
  }

  //upload date
  onBlurUploadDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('uploadEditedDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('uploadEditedDate')?.setErrors({ invalidDate: true });
    }
  }
                 
  onBlurUploadDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.uploadEditedDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('uploadEditedDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('uploadEditedDate')?.setErrors({ invalidDate: true });
    }
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
      this.advanceTableForm.patchValue({uploadedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
    }
  );
}

  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.ImagePath="";
    this.advanceTableForm.reset();
  }
  onNoClick():void{
    this.dialogRef.close();
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({customerPersonAddressCityID:this.addressGeoPointID});
    this.advanceTableForm.patchValue({licenseIssueCityID:this.issuingGeoPointID});
    this.advanceTableForm.patchValue({customerPersonID:this.data.CustomerPersonID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonDrivingLicenseCreate:CustomerPersonDrivingLicenseView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerPersonDrivingLicenseAll:CustomerPersonDrivingLicenseView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({customerPersonAddressCityID:this.addressGeoPointID || this.advanceTable.customerPersonAddressCityID});
    this.advanceTableForm.patchValue({licenseIssueCityID:this.issuingGeoPointID || this.advanceTable.licenseIssueCityID});
    this.advanceTableForm.patchValue({customerPersonID:this.advanceTable.customerPersonID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonDrivingLicenseUpdate:CustomerPersonDrivingLicenseView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerPersonDrivingLicenseAll:CustomerPersonDrivingLicenseView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    }
  )
  }

  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {

      if (this.advanceTable.verified === 'Verified') {
        this.licenceVerification();
      }
      if (this.advanceTable.verified === 'Rejected') {
        this.Put();
      }

    }
    else {
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
          customerPersonID:this.advanceTable.customerPersonID,
          dialogRefrence:this.dialogRef
        }
    });
  }

}



