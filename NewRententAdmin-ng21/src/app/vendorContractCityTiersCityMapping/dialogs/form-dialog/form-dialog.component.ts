// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { VendorContractCityTiersCityMappingService } from '../../vendorContractCityTiersCityMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { VendorContractCityTiersCityMappingModel } from '../../vendorContractCityTiersCityMapping.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
  advanceTable: VendorContractCityTiersCityMappingModel;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  CityList: any[] = [];
  filteredCityOptions: Observable<any[]>;
  existCityMessage: boolean = false;
  searchCityTerm: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  SupplierName: any;
  VendorContractCityTiersID!:number;
  VendorContractCityTier:string;
  vendorContractName:string;
  geoPointCityID: any;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>,   
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VendorContractCityTiersCityMappingService,
  private fb: FormBuilder,
  private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.VendorContractCityTiersID= data.vendorContractCityTiersID,
    this.VendorContractCityTier =data.vendorContractCityTier,
    this.vendorContractName =data.vendorContractName,
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='City Mapping';       
      this.advanceTable = data.advanceTable;
      this.searchCityTerm.setValue(this.advanceTable.city); 
    } 
    else 
    {
      this.dialogTitle = 'City Mapping';
      this.advanceTable = new VendorContractCityTiersCityMappingModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }


  public ngOnInit(): void
  {
    this.InitCities();    
  }


  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);


  getErrorMessage() 
  {
    return this.formControl.hasError('required') ? 'Required field'
      : this.formControl.hasError('email') ? 'Not a valid email'
      : '';
  }

  InitCities() 
  {
    this._generalService.GetCitiessAlls(this.VendorContractCityTiersID).subscribe(
    data => {
      if(data)
        {
          this.CityList = data;
          this.advanceTableForm.controls['city'].setValidators([Validators.required,this.cityValidator(this.CityList)]);
          this.advanceTableForm.controls['city'].updateValueAndValidity();
          this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
            startWith(''),
            map(value => this._filterCity(value || ''))
          );
        }
        else
        {
          this.existCityMessage=true;
          this.advanceTableForm.controls['city'];
        }
      },
      error => 
      {
        console.error('Error fetching cities:', error);
      }
    );
  }
  private _filterCity(value: string): any[] {
    const filterValue = value.toLowerCase();
    const selectedCityID = this.advanceTableForm.controls['cityID'].value;
    // if (!value || value.length < 3) {
    //     return [];   
    //   }
    // Filter out the already selected city and match based on the search value
    return this.CityList.filter(city => 
      city.geoPointName.toLowerCase().includes(filterValue) &&
      city.geoPointID !== selectedCityID  // Exclude already selected city
    );
  }
  onCitySelected(selectedCityName: string) 
  {
    const selectedValue = this.CityList.find(data => data.geoPointName === selectedCityName);  
    if (selectedValue) 
    {
      this.getCityID(selectedValue.geoPointID);
    }
  }
  getCityID(geoPointID: any) 
  {
    this.geoPointCityID = geoPointID;
    this.CityList = this.CityList.filter(city => city.geoPointID !== this.geoPointCityID);
  }

  cityValidator(CityList: any[]) {
    return (control: AbstractControl) => {
      const cityName = control.value;
      const cityExists = CityList.some(city => city.geoPointName === cityName);
      return cityExists ? null : { invalidCitySelection: true };
    };
  }
 
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vendorContractCityTiersCityMappingID: [this.advanceTable.vendorContractCityTiersCityMappingID],
      vendorContractCityTiersID: [this.advanceTable.vendorContractCityTiersID],
      cityID: [this.advanceTable.cityID],
      city:[this.advanceTable.city],
      vendorContractCityTiers: [this.advanceTable.vendorContractCityTiers],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) 
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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
    this.advanceTableForm.patchValue({geoPointID: this.geoPointCityID})
    this.advanceTableForm.patchValue({vendorContractCityTiersID:this.data.vendorContractCityTiersID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorContractCityTiersCityMappingCreate:VendorContractCityTiersCityMappingView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
      this._generalService.sendUpdate('VendorContractCityTiersCityMappingAll:VendorContractCityTiersCityMappingView:Failure');//To Send Updates 
      this.saveDisabled = true; 
    })
  }


  public Put(): void
  {
    this.advanceTableForm.patchValue({vendorContractCityTiersID:this.advanceTable.vendorContractCityTiersID});
    this.advanceTableForm.patchValue({cityID:this.geoPointCityID || this.advanceTable.cityID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorContractCityTiersCityMappingUpdate:VendorContractCityTiersCityMappingView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('VendorContractCityTiersCityMappingAll:VendorContractCityTiersCityMappingView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    })
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


