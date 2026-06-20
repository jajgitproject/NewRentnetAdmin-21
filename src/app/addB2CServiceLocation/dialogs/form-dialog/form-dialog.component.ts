
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AddB2CServiceLocationService } from '../../addB2CServiceLocation.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { AddB2CServiceLocation } from '../../addB2CServiceLocation.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, Observable, startWith } from 'rxjs';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AddB2CServiceLocation;
  saveDisabled:boolean=true;

  public CityLists?: CityDropDown[] = [];
  searchCityTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;
  ecoCityID: any;

  public ServiceLocationLists?: OrganizationalEntityDropDown[] = [];
  searchServiceLocationTerm: FormControl = new FormControl();
  filteredSLOptions: Observable<OrganizationalEntityDropDown[]>;
  ecoServiceLocationID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AddB2CServiceLocationService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='AddB2CServiceLocation';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'AddB2CServiceLocation';
          this.advanceTable = new AddB2CServiceLocation({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }

  ngOnInit(): void
  {
    this.InitCity();
    this.InitServiceLocation();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      b2CServiceLocationID: [this.advanceTable.b2CServiceLocationID],
      b2CCityName: [this.advanceTable.b2CCityName],
      ecoCityID: [this.advanceTable.ecoCityID],
      ecoCityName: [this.advanceTable.ecoCityName],
      ecoServiceLocationID: [this.advanceTable.ecoServiceLocationID],
      ecoServiceLocation: [this.advanceTable.ecoServiceLocation],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
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
   
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('AddB2CServiceLocationCreate:AddB2CServiceLocationView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
  },
    error =>
    {
       this._generalService.sendUpdate('AddB2CServiceLocationAll:AddB2CServiceLocationView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
   
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('AddB2CServiceLocationUpdate:AddB2CServiceLocationView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('AddB2CServiceLocationAll:AddB2CServiceLocationView:Failure');//To Send Updates 
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


  // Eco City
  InitCity() {
      this._generalService.GetCitiessAll().subscribe(
        data => {
          this.CityLists = data;
          this.advanceTableForm.controls['ecoCityName'].setValidators([Validators.required,
          this.cityNameValidator(this.CityLists)
          ]);
          this.advanceTableForm.controls['ecoCityName'].updateValueAndValidity();
          this.filteredCityOptions = this.advanceTableForm.controls["ecoCityName"].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCity(value || ''))
          );
        },
        error => {
  
        }
      );
  }

  private _filterCity(value: string): any {
      const filterValue = value.toLowerCase();
      // if (filterValue.length < 3) {
      //   return [];
      // }
      return this.CityLists.filter(
        customer => {
          return customer.geoPointName.toLowerCase().includes(filterValue);
        });
  }

  cityNameValidator(CityLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityLists.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { ecoCityNameInvalid: true };
    };
  }

  OnCitySelect(selectedCity: string)
  {
    const CityName = this.CityLists.find(
      data => data.geoPointName === selectedCity);
    if (selectedCity) 
    {
      this.getCityID(CityName.geoPointID);
    }
  }

  getCityID(geoPointID: any)
  {
    this.ecoCityID = geoPointID;
    this.advanceTableForm.patchValue({ ecoCityID: this.ecoCityID });
  }


  // Eco ServiceLocation
  InitServiceLocation() {
      this._generalService.GetLocation().subscribe(
        data => {
          this.ServiceLocationLists = data;
          this.advanceTableForm.controls['ecoServiceLocation'].setValidators([Validators.required,
          this.serviceLocationNameValidator(this.ServiceLocationLists)
          ]);
          this.advanceTableForm.controls['ecoServiceLocation'].updateValueAndValidity();
          this.filteredSLOptions = this.advanceTableForm.controls["ecoServiceLocation"].valueChanges.pipe(
            startWith(""),
            map(value => this._filterServiceLocation(value || ''))
          );
        },
        error => {
  
        }
      );
  }

  private _filterServiceLocation(value: string): any {
      const filterValue = value.toLowerCase();
      // if (filterValue.length < 3) {
      //   return [];
      // }
      return this.ServiceLocationLists.filter(
        customer => {
          return customer.organizationalEntityName.toLowerCase().includes(filterValue);
        });
  }

  serviceLocationNameValidator(ServiceLocationLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ServiceLocationLists.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { ecoServiceLocationNameInvalid: true };
    };
  }

  OnSLSelect(selectedServiceLocation: string)
  {
    const ServiceLocationName = this.ServiceLocationLists.find(
      data => data.organizationalEntityName === selectedServiceLocation);
    if (selectedServiceLocation) 
    {
      this.getSLID(ServiceLocationName.organizationalEntityID);
    }
  }

  getSLID(organizationalEntityID: any)
  {
    this.ecoServiceLocationID = organizationalEntityID;
    this.advanceTableForm.patchValue({ ecoServiceLocationID: this.ecoServiceLocationID });
  }
}


