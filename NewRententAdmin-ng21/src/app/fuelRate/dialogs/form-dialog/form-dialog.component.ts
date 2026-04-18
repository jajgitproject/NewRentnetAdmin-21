// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { FuelRateModel, FuelTypeDropDwonModel } from '../../fuelRate.model';
import { FuelRateService } from '../../fuelRate.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SpotInCityDropDown } from 'src/app/spotInCity/spotInCityDropDown.model';
import moment from 'moment';
import { StateDropDown } from 'src/app/state/stateDropDown.model';

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
  advanceTable: FuelRateModel;

  public FuelTypeList?: FuelTypeDropDwonModel[] = [];
  filteredFuelTypeOptions: Observable<FuelTypeDropDwonModel[]>;
  fuelTypeID: any;

  public StateList?: StateDropDown[] = [];
  filteredStateOptions: Observable<StateDropDown[]>;
  stateID: any;
  saveDisabled: boolean = true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: FuelRateService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Fuel Rate';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.fuelRateStartDate).format('DD/MM/yyyy');
          this.onBlurUpdateStartDateEdit(startDate);
          let endDate=moment(this.advanceTable.fuelRateEndDate).format('DD/MM/yyyy');
          this.onBlurUpdateEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Fuel Rate';
          this.advanceTable = new FuelRateModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }

  ngOnInit()
  {
    this.InitFuelType();
    this.InitState();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      fuelRateID: [this.advanceTable.fuelRateID],
      fuelTypeID: [this.advanceTable.fuelTypeID],
      fuelType: [this.advanceTable.fuelType],
      fuelRate: [
        this.advanceTable.fuelRate != null && this.advanceTable.fuelRate.toString().trim() !== ''
          ? parseFloat(this.advanceTable.fuelRate.toString().trim())
          : null
      ],
      stateID: [this.advanceTable.stateID],
      stateName: [this.advanceTable.stateName],
      fuelRateStartDate: [this.advanceTable.fuelRateStartDate],
      fuelRateEndDate: [this.advanceTable.fuelRateEndDate],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() {}

  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
private getPayload(): any {
  const raw = this.advanceTableForm.getRawValue();

  return {
    ...raw,
    // Ensure numeric fields are proper numbers
    fuelRate: raw.fuelRate != null && raw.fuelRate.toString().trim() !== ''
      ? parseFloat(raw.fuelRate.toString().trim())
      : null,
    
    // You can handle other numeric fields similarly if needed
    // e.g., fuelTypeID, stateID, etc. if backend expects numbers
  };
}

 public Post(): void {
  this.advanceTableService.add(this.getPayload())
    .subscribe(
      response => {
        this.dialogRef.close();
        this._generalService.sendUpdate('FuelRateCreate:FuelRateView:Success');
        this.saveDisabled = true;
      },
      error => {
        this._generalService.sendUpdate('FuelRateAll:FuelRateView:Failure');
        this.saveDisabled = true;
      }
    );
}



public Put(): void {
  this.advanceTableService.update(this.getPayload())
    .subscribe(
      response => {
        this.dialogRef.close();
        this._generalService.sendUpdate('FuelRateUpdate:FuelRateView:Success');
        this.saveDisabled = true;
      },
      error => {
        this._generalService.sendUpdate('FuelRateAll:FuelRateView:Failure');
        this.saveDisabled = true;
      }
    );
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

//---------- Fuel Type ----------
  fuelTypeValidator(FuelTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = FuelTypeList.some(group => group.fuelType.toLowerCase() === value);
    return match ? null : { fuelTypeInvalid: true };
    };
  }
  
  InitFuelType()
  {
    this._generalService.GetFuelType().subscribe(
    data=>
    {
      this.FuelTypeList=data;
      console.log(this.FuelTypeList)
      this.advanceTableForm.controls['fuelType'].setValidators([Validators.required,
        this.fuelTypeValidator(this.FuelTypeList)
        ]);
      this.advanceTableForm.controls['fuelType'].updateValueAndValidity();
      this.filteredFuelTypeOptions = this.advanceTableForm.controls['fuelType'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterFuelType(value || ''))
        ); 
      });
    }
  
  private _filterFuelType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.FuelTypeList.filter(
    data => 
    {
      return data.fuelType.toLowerCase().includes(filterValue);
    });
  }
  OnFuelTypeSelect(selectedFuelType: string)
  {
    const FuelType = this.FuelTypeList.find(
    data => data.fuelType === selectedFuelType);
    if (FuelType) 
    {
      this.getFuelTypeID(FuelType.fuelTypeID);
    }
  }
  getFuelTypeID(fuelTypeID: any) 
  {
    this.fuelTypeID=fuelTypeID;
    this.advanceTableForm.patchValue({fuelTypeID:this.fuelTypeID})
  }

//---------- City ----------
  InitState()
  {
    this._generalService.getStateForInterstateTax().subscribe(
    data=>
      {
        this.StateList=data;
        this.advanceTableForm.controls['stateName'].setValidators([Validators.required,
          this.stateValidator(this.StateList)
        ]);
        this.advanceTableForm.controls['stateName'].updateValueAndValidity();
        this.filteredStateOptions = this.advanceTableForm.controls['stateName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterState(value || ''))
      );  
    });
  }
  private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.StateList?.filter(
      data => 
      {
        return data.geoPointName.toLowerCase().indexOf(filterValue)===0;
      });
  }
  OnStateSelect(selectedState: string)
  {
    const StateName = this.StateList.find(
      data => data.geoPointName === selectedState);
    if (selectedState) 
    {
      this.getStateID(StateName.geoPointID);
    }
  }
  getStateID(stateID: any) 
  {
    this.stateID=stateID;
    this.advanceTableForm.patchValue({stateID:this.stateID})
  }

stateValidator(StateLists: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = StateLists.some(group => group.geoPointName?.toLowerCase() === value);
    return match ? null : { stateNameInvalid: true };
  };
}

  //---------- Start Date ----------
  onBlurUpdateStartDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('fuelRateStartDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('fuelRateStartDate')?.setErrors({ invalidDate: true });
    }
  }
  
  onBlurUpdateStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.fuelRateStartDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('fuelRateStartDate')?.setValue(formattedDate);
      }
      
    }
    else 
    {
     this.advanceTableForm.get('fuelRateStartDate')?.setErrors({ invalidDate: true });
    }
  }
  
  
  //---------- End Date ----------
  onBlurUpdateEndDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
     const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
     this.advanceTableForm.get('fuelRateEndDate')?.setValue(formattedDate);    
    } 
    else 
    {
      this.advanceTableForm.get('fuelRateEndDate')?.setErrors({ invalidDate: true });
    }
  }
  
  onBlurUpdateEndDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.fuelRateEndDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('fuelRateEndDate')?.setValue(formattedDate);
      }
    }
    else 
    {
      this.advanceTableForm.get('fuelRateEndDate')?.setErrors({ invalidDate: true });
    }
  }

}



