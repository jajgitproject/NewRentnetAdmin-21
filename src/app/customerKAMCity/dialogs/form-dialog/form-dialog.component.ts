// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerKAMCity } from '../../customerKAMCity.model';
import { CustomerKAMCityService } from '../../customerKAMCity.service';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  advanceTable: CustomerKAMCity;
  filteredCityOptions: Observable<CityDropDown[]>;
  public CityLists?: CityDropDown[] = [];
  cityID: any;
  customerKeyAccountManagerID: any;
  saveDisabled:boolean=true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerKAMCityService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer KAM City';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Customer KAM City';
          this.advanceTable = new CustomerKAMCity({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.customerKeyAccountManagerID=data.customerKeyAccountManagerID;
     
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerKAMCityID: [this.advanceTable.customerKAMCityID],
      city: [this.advanceTable.city],
      cityID: [this.advanceTable.cityID],
      customerKeyAccountManagerID: [this.advanceTable.customerKeyAccountManagerID],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
public ngOnInit(): void
{
 
this.InitCity();
}


cityNameValidator(CityLists: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = CityLists.some(group => group.geoPointName.toLowerCase() === value);
    return match ? null : { cityNameInvalid: true };
  };
}

  InitCity() {
    this._generalService.GetCitiessAll().subscribe(
      data => {
        this.CityLists = data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
        this.cityNameValidator(this.CityLists)
        ]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls["city"].valueChanges.pipe(
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
    return this.CityLists.filter(
      customer => {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
  }
  OnCitySelect(selectedCity: string)
  {
    const CityName = this.CityLists.find(
      data => data.geoPointName === selectedCity
    );
    if (selectedCity) 
    {
      this.getCityID(CityName.geoPointID);
    }
  }
  getCityID(geoPointID: any)
  {
    this.cityID = geoPointID;
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
    this.advanceTableForm.patchValue({customerKeyAccountManagerID:this.customerKeyAccountManagerID});
    this.advanceTableForm.patchValue({cityID:this.cityID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerKAMCityCreate:CustomerKAMCityView:Success');//To Send Updates  
       this.saveDisabled = true;
    
  },
    error =>
    {
       this._generalService.sendUpdate('CustomerKAMCityAll:CustomerKAMCityView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({customerKeyAccountManagerID:this.customerKeyAccountManagerID});
    this.advanceTableForm.patchValue({cityID:this.cityID || this.advanceTable.cityID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerKAMCityUpdate:CustomerKAMCityView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerKAMCityAll:CustomerKAMCityView:Failure');//To Send Updates 
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


