// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { DriverDocumentService } from '../../driverDocument.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DriverDocument } from '../../driverDocument.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DriverDocumentDropDown } from '../../driverDocumentDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { AllCitiesDropDown } from '../../allCitiesDropDown.model';
import { LicenseVerificationComponent } from '../license-verification/license-verification.component';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
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
  dataSource: DriverDocument[] | null;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverDocument;
  searchTerm : FormControl = new FormControl();
  searchCityTerm : FormControl = new FormControl();
  searchDocumentNumber: string = '';
  searchDocumentIssuingAuthority: string = '';
  searchAddress: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  public DocumentList?: DocumentDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;

  public EmployeeList?: EmployeeDropDown[]=[];
 saveDisabled:boolean = true;
  image: any;
  fileUploadEl: any;
  addressGeoPointID: any;
  DriverName: string;
  DriverID!: number;
  driverDocumentService: any;
  searchAddressCity: string = '';
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverDocumentService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.DriverID= data.driverID,
    this.DriverName =data.driverName,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
        
          this.dialogTitle ='Document Details';       
          this.advanceTable = data.advanceTable;
         
          this.ImagePath=this.advanceTable.documentImage;
          this.searchTerm.setValue(this.advanceTable.addressCity);
          var vd=this.advanceTable.verificationDate.split(' ');
          this.advanceTable.verificationDate=vd[0];
          // if(this.advanceTable.verified==='true'){
          //   this.advanceTable.verifiedData="Verified";
          // }

          // if(this.advanceTable.verified==='false'){
          //   this.advanceTable.verifiedData="Rejected";
          // }
          if (this.advanceTable.verified === 'true') {
            this.advanceTable.verifiedData = "Verified"
          }
          if (this.advanceTable.verified === 'false') {
            this.advanceTable.verifiedData = "Rejected"
            
          }
        this.advanceTable = data.advanceTable;
                let documentExpiry=moment(this.advanceTable.documentExpiry).format('DD/MM/yyyy');
                
                  this.onBlurUpdateDateEdit(documentExpiry);
        } else 
        {
          this.dialogTitle = 'Document Details';
          this.advanceTable = new DriverDocument({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.verifiedData='N/A';
          this.advanceTable.verified='true';
          this.advanceTable.verifiedBy='N/A';
          this.advanceTable.verificationRemark='N/A';
          this.advanceTable.verificationDate=('N/A');
          this.uploadedByName();
        }
        this.advanceTableForm = this.createContactForm();
        //this.customerPersonName=data.CustomerPersonName;
        //this.CustomerPersonName =data.customerPersonName,
  }
  public ngOnInit(): void
  {
    this.InitCities();
    this.InitIssuingCity()
    this.intDocument();
  }

  intDocument(){
    this._generalService.getDocumentRequiredforDriver().subscribe
    (
      data =>   
      {
        this.DocumentList = data;
        
      }
    );
  }
  
  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        // this.advanceTableForm.controls['addressCity'].setValidators([Validators.required,
        //   this.cityTypeValidator(this.CityList)
        // ]);
        // this.advanceTableForm.controls['addressCity'].updateValueAndValidity();

        this.filteredOptions = this.advanceTableForm.controls['addressCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

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

  getTitle(geoPointId: any) {
    this.addressGeoPointID=geoPointId;
  }
  cityTypeValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { cityTypeInvalid: true };
    };
  }
  InitIssuingCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CitiesList=data;
        this.filteredCityOptions = this.advanceTableForm.controls['addressCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtering(value || ''))
        ); 
      });
  }

  private _filtering(value: string): any {
    const filteringValue = value.toLowerCase();
    return this.CitiesList.filter(
      city => 
      {
        return city.geoPointName.toLowerCase().indexOf(filteringValue)===0;
      }
    );
  }

  // getTitles(geoPointId: any) {
  //   this.issuingGeoPointID=geoPointId;
  // }

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
      driverDocumentID: [this.advanceTable.driverDocumentID],
      driverID: [this.advanceTable.driverID],
      documentID: [this.advanceTable.documentID],
      documentNumber: [this.advanceTable?.documentNumber],
      documentIssuingAuthority: [this.advanceTable?.documentIssuingAuthority],
      documentImage: [this.advanceTable?.documentImage],
      documentImageNonAvailabilityReason: [this.advanceTable?.documentImageNonAvailabilityReason],
      addressCityID: [this.advanceTable?.addressCityID],
      documentExpiry: [this.advanceTable.documentExpiry],
      activationStatus: [this.advanceTable.activationStatus],
      verifiedData: [this.advanceTable.verifiedData],
      verified: [this.advanceTable.verified],
      verifiedBy: [this.advanceTable.verifiedBy],
      verificationRemark: [this.advanceTable.verificationRemark],
      verificationDate: [this.advanceTable.verificationDate],
      address: [this.advanceTable?.address],
      addressCity: [this.advanceTable.addressCity],
      pin: [this.advanceTable?.pin],
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
    this.advanceTableForm.reset();
  }
  onNoClick(){
    this.dialogRef.close();
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({addressCityID:this.addressGeoPointID});
    //this.advanceTableForm.patchValue({licenseIssueCityID:this.issuingGeoPointID});
    this.advanceTableForm.patchValue({driverID:this.data.driverID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverDocumentCreate:DriverDocumentView:Success');//To Send Updates 
       this.saveDisabled = true;
    
    },
    error =>
    {
       this._generalService.sendUpdate('DriverDocumentAll:DriverDocumentView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({addressCityID:this.addressGeoPointID || this.advanceTable.addressCityID});
    //this.data.advanceTableForm.patchValue({licenseIssueCityID:this.data.issuingGeoPointID || this.data.advanceTable.licenseIssueCityID});
    this.advanceTableForm.patchValue({driverID:this.advanceTable.driverID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverDocumentUpdate:DriverDocumentView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('DriverDocumentAll:DriverDocumentView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    }
  )
  }

  // public confirmAdd(): void 
  // {
  //      if(this.action=="edit")
  //      {
  //       if(this.advanceTable.verified==='Verified'){
  //         this.licenceVerification();
  //       }
  //       if(this.advanceTable.verified==='Rejected'){
  //         this.Put();
  //       } 
  //      }
  //      else
  //      {
  //         this.Post();
  //      }

  // }

  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {

      if (this.advanceTable.verified === 'Verified') {
        this.licenceVerification();
      }
      if (this.advanceTable.verified === 'Rejected') {
        this.Put();
      }
      if (this.advanceTable.verified === 'Unverified') {
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
    this.advanceTableForm.patchValue({documentImage:this.ImagePath})
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
          //issuingGeoPointID:this.issuingGeoPointID,
          driverID:this.advanceTable.driverID,
          dialogRefrence:this.dialogRef
        }
    });
  }

//start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('documentExpiry')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('documentExpiry')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.documentExpiry=formattedDate
  }
  else{
    this.advanceTableForm.get('documentExpiry')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('documentExpiry')?.setErrors({ invalidDate: true });
}
}

}



