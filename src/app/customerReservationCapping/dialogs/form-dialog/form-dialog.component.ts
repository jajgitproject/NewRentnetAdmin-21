// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerReservationCappingModel } from '../../customerReservationCapping.model';
import { CustomerReservationCappingService } from '../../customerReservationCapping.service';
import { CustomerGroupDropDown } from 'src/app/customerGroup/customerGroupDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/general/vehicleCategoryDropDown.model';

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
  advanceTable: CustomerReservationCappingModel;
  isLoading: boolean = false;

  filteredCustomerGroupOptions: Observable<CustomerGroupDropDown[]>;
  public customerGroupList?: CustomerGroupDropDown[] = [];
  customerGroupID: any;

  filteredCityOptions: Observable<CityDropDown[]>;
  public CityLists?: CityDropDown[] = [];
  cityID: any;

  public PackageList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  packageTypeID: any;

  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  vehicleCategoryID:any;
  CustomerID: any;
  CustomerName: any;
  existCityMessage: boolean;
  geoPointCityID: number;
  saveDisabled:boolean = true;

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public advanceTableService: CustomerReservationCappingService,
              private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    // Set the defaults
    this.CustomerID=data.CustomerID;
    this.CustomerName=data.CustomerName;
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Customer Reservation Capping';       
      this.advanceTable = data.advanceTable;
      this.InitCity(this.CustomerID,this.advanceTable.packageTypeID,this.advanceTable.vehicleCategoryID);
    }
    else 
    {
      this.dialogTitle = 'Customer Reservation Capping';
      this.advanceTable = new CustomerReservationCappingModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerReservationCappingID: [this.advanceTable.customerReservationCappingID],
      customerID: [this.CustomerID],
      customerName: [this.CustomerName],
      cityID: [this.advanceTable.cityID],
      city: [this.advanceTable.city],
      packageTypeID: [this.advanceTable.packageTypeID],
      packageType: [this.advanceTable.packageType],
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      vehicleCategory: [this.advanceTable.vehicleCategory],
      mondayCap: [this.formatCapValue(this.advanceTable?.mondayCap)],
      tuesdayCap: [this.formatCapValue(this.advanceTable?.tuesdayCap)],
      wednesdayCap: [this.formatCapValue(this.advanceTable?.wednesdayCap)],
      thursdayCap: [this.formatCapValue(this.advanceTable?.thursdayCap)],
      fridayCap: [this.formatCapValue(this.advanceTable?.fridayCap)],
      saturdayCap: [this.formatCapValue(this.advanceTable?.saturdayCap)],      
      sundayCap: [this.formatCapValue(this.advanceTable?.sundayCap)],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  private formatCapValue(value: any): number | null {
    return value !== '' && value !== undefined ? value : null;
  }
  
  public ngOnInit(): void
  {
    this.advanceTableForm.controls["customerName"].disable();
    //this.InitCity(this.CustomerID,this.packageTypeID,this.vehicleCategoryID);
    this.InitPackageType();
    this.InitVehicleCategory();
  }

  public noWhitespaceValidator(control: FormControl) 
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {}

  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        }
        else
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerReservationCappingCreate:CustomerReservationCappingView:Success');//To Send Updates  
          this.saveDisabled = true;
        }
      },
      error => {
        this._generalService.sendUpdate('CustomerReservationCappingAll:CustomerReservationCappingView:Failure'); // Notify failure
        this.saveDisabled = true;
      }
    );
  }
  
  public Put(): void {
    this.advanceTableForm.patchValue({cityID:this.geoPointCityID || this.advanceTable.cityID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        }
        else
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerReservationCappingUpdate:CustomerReservationCappingView:Success');//To Send Updates  
          this.saveDisabled = true;
        }
      },
      error => {
        this._generalService.sendUpdate('CustomerReservationCappingAll:CustomerReservationCappingView:Failure'); // Notify failure
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
    //---------- City ----------
    InitCity(CustomerID,packageTypeID,vehicleCategoryID) 
    {
      this.advanceTableService.GetCityForCustomerCapping(CustomerID,packageTypeID,vehicleCategoryID).subscribe(
        data => {
          if(data)
          {
            this.CityLists = data;
            this.advanceTableForm.controls['city'].setValidators([Validators.required,this.cityValidator(this.CityLists)]);
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
        error => {
          console.error('Error fetching cities:', error);
        });
    }
  
    private _filterCity(value: string): any[] {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 3) {
        return [];   
      }
      const selectedCityID = this.advanceTableForm.controls['cityID'].value;
      return this.CityLists.filter(city => 
        city.geoPointName.toLowerCase().indexOf(filterValue) === 0 &&
        city.geoPointID !== selectedCityID  // Exclude already selected city
      );
    }
  
    onCitySelected(selectedCityName: string) 
    {
      const selectedValue = this.CityLists.find(data => data.geoPointName === selectedCityName);    
      if (selectedValue) 
      {
        this.getCityID(selectedValue.geoPointID);
      }
    }
    
    getCityID(geoPointID: any) 
    {
      this.geoPointCityID = geoPointID;
      this.CityLists = this.CityLists.filter(city => city.geoPointID !== this.geoPointCityID);
    }
  
    cityValidator(CityLists: any[]) 
    {
      return (control: AbstractControl) => {
        const cityName = control.value;
        const cityExists = CityLists.some(city => city.geoPointName === cityName);
        return cityExists ? null : { invalidCitySelection: true };
      };
    }

    //---------- Package Type ----------
    packageTypeValidator(PackageList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PackageList.some(group => group.packageType.toLowerCase() === value);
        return match ? null : { packageTypeInvalid: true };
      };
    }
    InitPackageType()
    {
      this._generalService.GetPackgeType().subscribe(
      data=>
      {
        this.PackageList=data;
        this.advanceTableForm.controls['packageType'].setValidators([Validators.required,this.packageTypeValidator(this.PackageList)]);
        this.advanceTableForm.controls['packageType'].updateValueAndValidity();  
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
    }    
    private _filterPackageType(value: string): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 3) {
        return [];   
      }
      return this.PackageList.filter(
        data => 
        {
          return data.packageType.toLowerCase().includes(filterValue);
        }
      );
    }
    onPackageTypeSelected(selectedPackageType: string) 
    {
      const selectedPackage = this.PackageList.find(data => data.packageType === selectedPackageType);    
      if (selectedPackageType) 
      {
        this.getPackageTypeID(selectedPackage.packageTypeID);
      }
    }    
    getPackageTypeID(packageTypeID: any)
    {
      this.packageTypeID=packageTypeID;
      this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
      this.InitCity(this.CustomerID,this.packageTypeID,this.vehicleCategoryID);
    }

    //---------- Package Type ----------
    vehicleCategoryTypeValidator(VehicleCategoryList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = VehicleCategoryList.some(group => group.vehicleCategory.toLowerCase() === value);
        return match ? null : { vehicleCategoryTypeInvalid: true };
      };
    }
    InitVehicleCategory()
    {
      this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,this.vehicleCategoryTypeValidator(this.VehicleCategoryList)]);
        this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
        this.filteredVehicleCategoryOptions = this.advanceTableForm.controls["vehicleCategory"].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
    }    
    private _filter(value: string): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 3) {
        return [];   
      }
      return this.VehicleCategoryList.filter(
        data => 
        {
          return data.vehicleCategory.toLowerCase().includes(filterValue);
        }
      );
    }
    onVehicleCategorySelected(selectedVehicleCategory: string) 
    {
      const selectedValue = this.VehicleCategoryList.find(data => data.vehicleCategory === selectedVehicleCategory);    
      if (selectedValue) 
      {
        this.getVehicleCategoryID(selectedValue.vehicleCategoryID);
      }
    }
    getVehicleCategoryID(vehicleCategoryID: any) 
    {     
      this.vehicleCategoryID=vehicleCategoryID;
      this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
      this.InitCity(this.CustomerID,this.packageTypeID,this.vehicleCategoryID);
    }
}


