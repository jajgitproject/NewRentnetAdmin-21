// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, AbstractControl, ValidatorFn} from '@angular/forms';
import { Inventory } from '../../inventory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { InventoryDropDown } from '../../inventoryDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { ColorDropDown } from 'src/app/color/colorDropDown.model';
import { FuelTypeDropDown } from 'src/app/fuelType/fuelTypeDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { from, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Color } from 'src/app/color/color.model';
import { TransmissionTypeDropDown } from 'src/app/transmissionType/transmissionTypeDropDown.model';
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
  supllierDetails:any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Inventory;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  public SupplierList?: SupplierDropDown[] = [];
  public SupplierForOwnerList?: SupplierDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  public ColorList?: ColorDropDown[] = [];
  public FuelTypeList?: FuelTypeDropDown[] = [];
  public StateList?: StateDropDown[] = [];
  public SupplierForOwnershipList?: SupplierDropDown[]=[];
  public TransmissionTypeList?: TransmissionTypeDropDown[]=[];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  searchVehicle: FormControl = new FormControl();
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  searchVehicleCategory: FormControl = new FormControl();
  filteredVOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  searchOrganizationalEntity: FormControl = new FormControl();
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  searchsOrganizationalEntity: FormControl = new FormControl();
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  filteredSupplierForOwnerOptions: Observable<SupplierDropDown[]>;
  searchSupplier: FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCity: FormControl = new FormControl();
  filteredColorOptions: Observable<ColorDropDown[]>;
  searchColor: FormControl = new FormControl();

  filteredtransmissionTypeOptions: Observable<TransmissionTypeDropDown[]>;
  searchtransmissionType: FormControl = new FormControl();
 
  filteredFuelOptions: Observable<FuelTypeDropDown[]>;
  searchFuel: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  vehicleCategoryID: any;
  vehicleID: any;
  organizationalEntityID: any;
  companyID: any;
  locationHubID: any;
  supplierID: any;
  registrationCityID: any;
  colorID: any;
  fuelTypeID: any;
  registrationStateID: any;
  owned:boolean=false;
  Supplier:boolean=true; 
  transmissionTypeID: any;
  saveDisabled: boolean = true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InventoryService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Inventory';       
          this.advanceTable = data.advanceTable;
          this.searchVehicle.setValue(this.advanceTable.vehicle);
          this.searchVehicleCategory.setValue(this.advanceTable.vehicleCategory);
          this.searchOrganizationalEntity.setValue(this.advanceTable.company);
          this.searchsOrganizationalEntity.setValue(this.advanceTable.organizationalEntityName);
          this.searchSupplier.setValue(this.advanceTable.supplier);
          this.searchCity.setValue(this.advanceTable.registrationCity);
          this.searchColor.setValue(this.advanceTable.color);
          this.searchFuel.setValue(this.advanceTable.fuelType);
          
          if(this.advanceTable.ownedSupplied==='Owned')
          {
            this.owned=true;
            this.Supplier=false;
            this.InitSupplierForOwner();
          }
          if(this.advanceTable.ownedSupplied==='Supplier')
          {
            this.owned=false;
            this.Supplier=true;
            this.InitSupplier();
          }
           let registrationFromDate=moment(this.advanceTable.registrationFromDate).format('DD/MM/yyyy');
                    let registrationTillDate=moment(this.advanceTable.registrationTillDate).format('DD/MM/yyyy');
                    this.onBlurUpdateDateEdit(registrationFromDate);
                    this.onBlurUpdateEndDateEdit(registrationTillDate);
        } 
        else 
        {
          this.dialogTitle = 'Inventory';
          this.advanceTable = new Inventory({});
          //this.advanceTable.status=true;
          //this.advanceTable.status='';
        }
        this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void
  {
    this.advanceTableForm.patchValue({status:'Active'});
    this.initVehicleCategories();
    this.InitCompany();
    this.InitLocationHub();
    // this.InitSupplierForOwner();
    // this.InitSupplier();
    this.onOwnershipChange()
    this.InitCity();
    this.InitColor();
    this.InitFuelType();
    this.initTrasmissionType();
    this.advanceTableForm.get('isGPSAvailable').valueChanges.subscribe(value => {
      this.setGPSIMEIValidator(value);
    });

    // Call once to set initial state
    this.setGPSIMEIValidator(this.advanceTableForm.get('isGPSAvailable').value);
  
  }

  onOwnershipChange() {
    if (this.advanceTableForm.value.ownedSupplied === 'Owned') {
      this.owned = true;
      this.Supplier = false;
      this.InitSupplierForOwner();
    }
    if (this.advanceTableForm.value.ownedSupplied === 'Supplier') {
      this.owned = false;
      this.Supplier = true;
      this.InitSupplier();

    }
  }

  initVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
          this.vehicleCategoryValidator(this.VehicleCategoryList)]);
        this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
        this.filteredVehicleCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
  if (!value || value.length < 3) {
    return [];
  }
  const filterValue = value.toLowerCase();

  return this.VehicleCategoryList.filter(customer =>
    customer.vehicleCategory.toLowerCase().includes(filterValue)
  );
}

  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.vehicleCategory.toLowerCase().includes(filterValue);
  //     });
  // }
  OnVehicleCategorySelect(selectedVehicleCategory: string)
  {
    const VehicleCategoryName = this.VehicleCategoryList.find(
      data => data.vehicleCategory === selectedVehicleCategory
    );
    if (selectedVehicleCategory) 
    {
      this.getTitles(VehicleCategoryName.vehicleCategoryID);
    }
  }  
  getTitles(vehicleCategoryID: any)
 {
    this.vehicleCategoryID=vehicleCategoryID;
    this.initVehicle();
    this.advanceTableForm.controls['vehicle'].setValue('');
  }

  //-------------- Vehicle Category Validator -------------
  vehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryInvalid: true };
    };
  }
  initVehicle() {
    this._generalService.GetVehicles(this.vehicleCategoryID).subscribe(
      data => {
        this.VehicleList = data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,
          this.vehicleValidator(this.VehicleList)]);
        this.advanceTableForm.controls['vehicle'].updateValueAndValidity();
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterVehicle(value || ''))
        );
      }
    );
  }
  
  private _filterVehicle(value: string): any {
  if (!value || value.length < 3) {
    return [];
  }
  const filterValue = value.toLowerCase();
  return this.VehicleList.filter(customer =>
    customer.vehicle.toLowerCase().includes(filterValue)
  );
}

  // private _filterVehicle(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleList.filter(
  //     customer => 
  //     {
  //       return customer.vehicle.toLowerCase().includes(filterValue);
  //     });
  // }
  OnVehicleSelect(selectedVehicle: string)
  {
    const VehicleName = this.VehicleList.find(
      data => data.vehicle === selectedVehicle
    );
    if (selectedVehicle) 
    {
      this.getvehicleID(VehicleName.vehicleID);
    }
  } 
  getvehicleID(vehicleID: any)
  {
    this.vehicleID=vehicleID;
  }

  //-------------- Vehicle Validator -------------
  vehicleValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(group => group.vehicle.toLowerCase() === value);
      return match ? null : { vehicleInvalid: true };
    };
  }
  // InitVehicleCategory(){
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data=>{
  //       this.VehicleCategoryList=data;``
  //     }
  //   )
  // }

  // InitVehicle(){
  //   this._generalService.GetVehicle().subscribe(
  //     data=>{
  //       this.VehicleList=data;
  //     }
  //   )
  // }

  // InitCompany(){
  //   this._generalService.GetCompany().subscribe(
  //     data=>{
  //       this.OrganizationalEntityList=data;
  //     }
  //   )
  // }
  InitCompany(){
    this._generalService.GetCompany().subscribe(
      data=>
      {
        this.OrganizationalEntityList=data;
        this.advanceTableForm.controls['company'].setValidators([Validators.required,
          this.organizationalEntityNameValidator(this.OrganizationalEntityList)]);
        this.advanceTableForm.controls['company'].updateValueAndValidity();
        this.filteredVOrganizationalEntityOptions = this.advanceTableForm.controls['company'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterOrganizationalEntity(value || ''))
        ); 
      });
  }
  private _filterOrganizationalEntity(value: string): any {
  if (!value || value.length < 3) {
    return [];  
  }
  const filterValue = value.toLowerCase();

  return this.OrganizationalEntityList.filter(customer =>
    customer.organizationalEntityName.toLowerCase().includes(filterValue)
  );
}

  // private _filterOrganizationalEntity(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.OrganizationalEntityList.filter(
  //     customer => 
  //     {
  //       return customer.organizationalEntityName.toLowerCase().includes(filterValue);
  //     });
  // }
  OnCompanySelect(selectedCompany: string)
  {
    const CompanyName = this.OrganizationalEntityList.find(
      data => data.organizationalEntityName === selectedCompany
    );
    if (selectedCompany) 
    {
      this.getorganizationalEntityID(CompanyName.organizationalEntityID);
    }
  }
  getorganizationalEntityID(organizationalEntityID: any) {
    if (organizationalEntityID) {
      this.companyID = organizationalEntityID;
      
    } 
  }
  
  onvechileInputChanges(event:any){
    if(event.keyCode===8){
      this.advanceTableForm.controls['vehicle'].setValue('');
     }

  }

  //-------------- Company Validator -------------
  organizationalEntityNameValidator(OrganizationalEntityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntityList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { companyInvalid: true };
    };
  }

  // onCompanyInputChange(event: any) {
  //   if(event.target.value.length === 0) {
  //     this.advanceTableForm.controls['supplier'].setValue('');
  //   } else {
  //     this.advanceTableForm.controls['supplier'].setValue(event.target.value);
  //   }
  // }
  InitLocationHub(){
    this._generalService.GetLocationHub().subscribe(
      data=>
      {
        this.OrganizationalEntitiesList=data;
        this.advanceTableForm.controls['locationHub'].setValidators([Validators.required,
          this.locationHubValidator(this.OrganizationalEntitiesList)]);
        this.advanceTableForm.controls['locationHub'].updateValueAndValidity();
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls['locationHub'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterOrganizationalsEntity(value || ''))
        ); 
      });
  }
  private _filterOrganizationalsEntity(value: string): any {
  if (!value || value.length < 3) {
    return [];
  }
  const filterValue = value.toLowerCase();

  return this.OrganizationalEntitiesList.filter(customer =>
    customer.organizationalEntityName.toLowerCase().includes(filterValue)
  );
}

  // private _filterOrganizationalsEntity(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.OrganizationalEntitiesList.filter(
  //     customer => 
  //     {
  //       return customer.organizationalEntityName.toLowerCase().includes(filterValue);
  //     });
  // }
  OnLocationHubSelect(selectedLocationHub: string)
  {
    const LocationHubName = this.OrganizationalEntitiesList.find(
      data => data.organizationalEntityName === selectedLocationHub
    );
    if (selectedLocationHub) 
    {
      this.getlocationHubID(LocationHubName.organizationalEntityID);
    }
  }
  getlocationHubID(locationHubID: any)
  {
    this.locationHubID=locationHubID;
  }

  //-------------- LocationHub Validator -------------
  locationHubValidator(OrganizationalEntitiesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntitiesList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { locationHubInvalid: true };
    };
  }
  
  // InitLocationHub(){
  //   this._generalService.GetLocationHub().subscribe(
  //     data=>{
  //       this.OrganizationalEntitiesList=data;
  //     }
  //   )
  // }

  // InitSupplier(){
  //   this._generalService.getSuppliersForInventory().subscribe(
  //     data=>{
  //       this.SupplierList=data;
  //     }
  //   )
  // }

  supplierNameValidatorForOwner(SupplierForOwnerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierForOwnerList.some(group => group.supplierName.toLowerCase() === value);
      return match ? null : { supplierForOwnerInvalid: true };
    };
  }

  InitSupplierForOwner()
  {
    this._generalService.SupplierForInternal().subscribe(
      data=>
      {
        this.SupplierForOwnerList=data;
        this.advanceTableForm.controls['supplier'].setValidators([Validators.required,
          this.supplierNameValidatorForOwner(this.SupplierForOwnerList)]);
        this.advanceTableForm.controls['supplier'].updateValueAndValidity();
        this.filteredSupplierForOwnerOptions = this.advanceTableForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplierForOwner(value || ''))
        ); 
      });
  }
  private _filtersearchSupplierForOwner(value: string): any {
  if (!value || value.length < 3) {
    return [];
  }
  const filterValue = value.toLowerCase();

  return this.SupplierForOwnerList.filter(data =>
    data.supplierName.toLowerCase().includes(filterValue)
  );
}


  // private _filtersearchSupplierForOwner(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.SupplierForOwnerList.filter(
  //     data => 
  //     {
  //       return data.supplierName.toLowerCase().includes(filterValue);
  //     });
  // }
  OnSupplierForOwnerSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierForOwnerList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
    {
      this.getsupplierID(SupplierName.supplierID);
    }
  }
  getsupplierIDForOwner(supplierID: any)
  {
    this.supplierID=supplierID;
    this.advanceTableForm.patchValue({supplierID:this.supplierID || this.advanceTable.supplierID});
  }

  InitSupplier()
  {
    this._generalService.SupplierForExternal().subscribe(
      data=>
      {
        this.SupplierList=data;
        this.advanceTableForm.controls['supplier'].setValidators([Validators.required,
          this.supplierNameValidator(this.SupplierList)]);
        this.advanceTableForm.controls['supplier'].updateValueAndValidity();
        this.filteredSupplierOptions = this.advanceTableForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplier(value || ''))
        ); 
      });
  }

  private _filtersearchSupplier(value: string): any {
  if (!value || value.length < 3) {
    return [];  
  }
  const filterValue = value.toLowerCase();

  return this.SupplierList.filter(data =>
    data.supplierName.toLowerCase().includes(filterValue)
  );
}

  // private _filtersearchSupplier(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.SupplierList.filter(
  //     customer => 
  //     {
  //       return customer.supplierName.toLowerCase().includes(filterValue);
  //     });
  // }
  OnSupplierSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
    {
      this.getsupplierID(SupplierName.supplierID);
    }
  }
  getsupplierID(supplierID: any)
  {
    this.supplierID=supplierID;
    this.advanceTableForm.patchValue({supplierID:this.supplierID || this.advanceTable.supplierID});
  }

  //-------------- Supplier Validator -------------
  supplierNameValidator(SupplierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierList.some(group => group.supplierName.toLowerCase() === value);
      return match ? null : { supplierInvalid: true };
    };
  }

  InitSupplierForOwnership()
  {
    this._generalService.SupplierForOwnershipOfOE().subscribe(
      data=>
      {
        this.SupplierForOwnershipList=data;
        this.advanceTableForm.patchValue({supplier:this.SupplierForOwnershipList[0].supplierName});
        this.advanceTableForm.patchValue({supplierID:this.SupplierForOwnershipList[0].supplierID});
      });
  }

  // onOwnshipChange(event:any)
  // {

  //   if(event.value.toLowerCase() === 'owned')
  //   {
  //     this.advanceTableForm.controls['supplier'].setValue(this.supllierDetails?.organizationalEntityName);
  //     //console.log(this.supplierID )
  //     this.advanceTableForm.patchValue({supplierID:this.supllierDetails?.organizationalEntityID || this.advanceTable.organizationalEntityID});
  //     this.owned=true;
  //     this.supplier=false;
  //     //this.InitSupplierForOwnership();
     
  //   }
  //   if(event.value.toLowerCase() === 'supplier')
  //   {
  //     this.supplierID = '';
  //     this.owned=false;
  //     this.supplier=true;
  //     this.advanceTableForm.controls["supplier"].setValue("");
  //   }
  // }

  InitCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['registrationCity']?.setValidators([Validators.required,
          this.registrationCityValidator(this.CityList)]);
        this.advanceTableForm.controls['registrationCity']?.updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls['registrationCity']?.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
  }
  OnRegistrationCitySelect(selectedRegistrationCity: string)
  {
    const RegistrationCityName = this.CityList.find(
      data => data.geoPointName === selectedRegistrationCity
    );
    if (selectedRegistrationCity) 
    {
      this.getregistrationCityID(RegistrationCityName.geoPointID);
    }
  }
  getregistrationCityID(geoPointID: any)
  {
    this.registrationCityID=geoPointID;
    this.GetStateBasedOnCity();
  }

  //-------------- Registration City Validator -------------
  registrationCityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { registrationCityInvalid: true };
    };
  }

  // getregistrationCityID(state: any) {
  //   this.advanceTableForm.patchValue({registrationCityID: state.registrationCityID });
  //   this.advanceTableForm.patchValue({state: state.state });
  //   this.registrationCityID = state.registrationCityID;
  // }

  // getCity(option: any) {
  //   this.GetStateBasedOnCity();
  // }

  GetStateBasedOnCity()
  {
    this.advanceTableForm.patchValue({registrationCityID:this.registrationCityID});
    this._generalService.GetStateAgainstCity(this.registrationCityID).subscribe
    (
     (data: any) =>   
      {
        if(data !== null && data?.length > 0) {
          this.StateList = data;
          this.advanceTableForm.patchValue({registrationStateID: this.StateList[0].geoPointID});
        } else {
          this.StateList = [];
        } 
        // this.filteredCityOptions = this.searchCity.valueChanges.pipe(
        //   startWith(""),
        //   map(value => this._filterCity(value || ''))
        // );
      }
   );
  }
  // InitCity(){
  //   this._generalService.GetCitiessAll().subscribe(
  //     data=>
  //     {
  //       this.CityList=data;
  //     });
  // }

  // InitColor(){
  //   this._generalService.getColorsForInventory().subscribe(
  //     data=>{
  //       this.ColorList=data;
  //     }
  //   )
  // }
  InitColor(){
    this._generalService.getColorsForInventory().subscribe(
      data=>
      {
        this.ColorList=data;
        this.advanceTableForm.controls['color'].setValidators([Validators.required,
          this.colorValidator(this.ColorList)]);
        this.advanceTableForm.controls['color'].updateValueAndValidity();
        this.filteredColorOptions =this.advanceTableForm.controls['color'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterColor(value || ''))
        ); 
      });
  }
  private _filterColor(value: string): any {
  if (!value || value.length < 3) {
    return []; 
  }
  const filterValue = value.toLowerCase();

  return this.ColorList.filter(customer =>
    customer.color.toLowerCase().includes(filterValue)
  );
}

  // private _filterColor(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.ColorList.filter(
  //     customer => 
  //     {
  //       return customer.color.toLowerCase().includes(filterValue);
  //     });
  // }
  OnColorSelect(selectedColor: string)
  {
    const ColorName = this.ColorList.find(
      data => data.color === selectedColor
    );
    if (selectedColor) 
    {
      this.getcolorID(ColorName.colorID);
    }
  }
  getcolorID(colorID: any) 
  {
    this.colorID=colorID;
  }

  colorValidator(ColorList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ColorList.some(group => group.color?.toLowerCase() === value);
      return match ? null : { colorInvalid: true };
    };
  }

  InitFuelType(){
    this._generalService.getFuleTypesForInventory().subscribe(
      data=>
      {
        this.FuelTypeList=data;
        this.advanceTableForm.controls['fuelType']?.setValidators([Validators.required,
          this.fuleValidator(this.FuelTypeList)]);
        this.advanceTableForm.controls['fuelType'].updateValueAndValidity();
        this.filteredFuelOptions = this.advanceTableForm.controls['fuelType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterFuel(value || ''))
        ); 
      });
  }
  private _filterFuel(value: string): any {
    const filterValue = value.toLowerCase();
    return this.FuelTypeList.filter(
      customer => 
      {
        return customer.fuelType.toLowerCase().includes(filterValue);
      });
  }
  OnFuelTypeSelect(selectedFuelType: string)
  {
    const FuelTypeName = this.FuelTypeList.find(
      data => data.fuelType === selectedFuelType
    );
    if (selectedFuelType) 
    {
      this.getfuelTypeID(FuelTypeName.fuelTypeID);
    }
  }
  getfuelTypeID(fuelTypeID: any) 
  {
    this.fuelTypeID=fuelTypeID;
  }
  fuleValidator(FuelTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = FuelTypeList.some(group => group.fuelType?.toLowerCase() === value);
      return match ? null : { fuleInvalid: true };
    };
  }

  initTrasmissionType(){
    this._generalService.getTransmissionType().subscribe(
      data=>
      {
        this.TransmissionTypeList=data;
        this.advanceTableForm.controls['transmissionType']?.setValidators([Validators.required,
          this.transmissionTypeValidator(this.TransmissionTypeList)]);
        this.advanceTableForm.controls['transmissionType']?.updateValueAndValidity();
        this.filteredtransmissionTypeOptions =this.advanceTableForm.controls['transmissionType']?.valueChanges.pipe(
          startWith(""),
          map(value => this._filtertransmissionType(value || ''))
        ); 
      });
  }
  private _filtertransmissionType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.TransmissionTypeList.filter(
      customer => 
      {
        return customer.transmissionType.toLowerCase().includes(filterValue);
      });
  }
  OnTransmissionTypeSelect(selectedTransmissionType: string)
  {
    const TransmissionTypeName = this.TransmissionTypeList.find(
      data => data.transmissionType === selectedTransmissionType
    );
    if (selectedTransmissionType) 
    {
      this.gettransmissionType(TransmissionTypeName.transmissionTypeID);
    }
  }
  gettransmissionType(item: any)
  {
    this.transmissionTypeID = item.transmissionTypeID;
    //   //this.advanceTableForm.controls['organizationalEntityName'].setValue(item.organizationalEntityName);
  }

  transmissionTypeValidator(TransmissionTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = TransmissionTypeList.some(group => group.transmissionType?.toLowerCase() === value);
      return match ? null : { TransmissionTypeInvalid: true };
    };
  }

  // InitFuelType(){
  //   this._generalService.getFuleTypesForInventory().subscribe(
  //     data=>{
  //       this.FuelTypeList=data;
  //     }
  //   )
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
      inventoryID: [this.advanceTable?.inventoryID],
      vehicleCategoryID: [this.advanceTable?.vehicleCategoryID],
      vehicleCategory: [this.advanceTable?.vehicleCategory],
      vehicleID: [this.advanceTable?.vehicleID],
      vehicle: [this.advanceTable?.vehicle],
      company: [this.advanceTable?.company],
      locationHub:[this.advanceTable?.organizationalEntityName],
      organizationalEntityName:[this.advanceTable?.organizationalEntityName],
      registrationStateID: [this.advanceTable?.registrationStateID],
      registrationCityID: [this.advanceTable?.registrationCityID],
      registrationNumber: [this.advanceTable?.registrationNumber],
      registrationFromDate: [this.advanceTable?.registrationFromDate],
      //registrationTillDate: [this.advanceTable?.registrationTillDate],
      locationHubID: [this.advanceTable?.locationHubID],
      ownedSupplied: [this.advanceTable?.ownedSupplied],
      supplierID: [this.advanceTable?.supplierID],
      supplier: [this.advanceTable?.supplier],
      colorID: [this.advanceTable?.colorID],
      fuelTypeID: [this.advanceTable?.fuelTypeID],
      mileage: [this.advanceTable?.mileage],
      fuelType: [this.advanceTable?.fuelType],
      color: [this.advanceTable?.color],
      isAdhoc: [this.advanceTable?.isAdhoc],
      // chassisNo: [this.advanceTable?.chassisNo],
      //noOfAirbags: [this.advanceTable?.noOfAirbags],
      //transmissionType: [this.advanceTable?.transmissionType],
      modelYear: [this.advanceTable?.modelYear],
      isGPSAvailable: [this.advanceTable?.isGPSAvailable],
      //gpsimeiNo: [this.advanceTable?.gpsimeiNo],
      //purchaseDate: [this.advanceTable?.purchaseDate],
      companyID: [this.advanceTable?.companyID],
      inventoryCreatedBy: [this.advanceTable?.inventoryCreatedBy],
      //registrationCity: [this.advanceTable?.registrationCity],
      status: [this.advanceTable?.status],
      businessDivision: [this.advanceTable?.businessDivision]
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
  reset(): void 
  {
    this.advanceTableForm.reset();
    this.ImagePath=undefined;
     this.searchVehicle.reset();
      this.searchVehicleCategory.reset();
      this.searchsOrganizationalEntity.reset();
      this.searchOrganizationalEntity.reset();
      this.searchSupplier.reset();
  }
  onNoClick()
  {
    this.dialogRef.close();
    this.ImagePath="";
  }

  // GetStateBasedOnCity(){
  //   ;
  //   this._generalService.GetStateAgainstCity(this.advanceTableForm.value.registrationCityID).subscribe(
  //     data=>{
  //       this.StateList=data;
  //       this.advanceTableForm.patchValue({registrationStateID:this.StateList[0].geoPointID})
  //     }
  //   );
  // }

  public Post(): void
  { 
    this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID});
    this.advanceTableForm.patchValue({registrationCityID:this.registrationCityID});
    //this.advanceTableForm.patchValue({registrationStateID:this.registrationStateID});
    this.advanceTableForm.patchValue({colorID:this.colorID});
    this.advanceTableForm.patchValue({fuelTypeID:this.fuelTypeID});
    //this.advanceTableForm.patchValue({supplierID:this.supplierID});
    this.advanceTableForm.patchValue({locationHubID:this.locationHubID});
    this.advanceTableForm.patchValue({companyID:this.companyID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    
    .subscribe(
    response => 
    {
      
        this.dialogRef.close();
       this._generalService.sendUpdate('InventoryCreate:InventoryView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('InventoryAll:InventoryView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID ||this.advanceTable.vehicleCategoryID});
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID ||this.advanceTable.vehicleID});
    this.advanceTableForm.patchValue({registrationCityID:this.registrationCityID ||this.advanceTable.registrationCityID });
    //this.advanceTableForm.patchValue({registrationStateID:this.registrationStateID});
    this.advanceTableForm.patchValue({colorID:this.colorID ||this.advanceTable.colorID});
    this.advanceTableForm.patchValue({fuelTypeID:this.fuelTypeID ||this.advanceTable.fuelTypeID});
    //this.advanceTableForm.patchValue({supplierID:this.supplierID ||this.advanceTable.supplierID});
    this.advanceTableForm.patchValue({locationHubID:this.locationHubID ||this.advanceTable.locationHubID});
    this.advanceTableForm.patchValue({companyID:this.companyID ||this.advanceTable.companyID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('InventoryUpdate:InventoryView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('InventoryAll:InventoryView:Failure');//To Send Updates  
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
  
  onGPSAvailableChange() {
    const isGPSAvailable = this.advanceTableForm.get('isGPSAvailable').value;
    this.setGPSIMEIValidator(isGPSAvailable);
  }

  setGPSIMEIValidator(isGPSAvailable: boolean) {
    const gpsimeiNoControl = this.advanceTableForm.get('gpsimeiNo');
    // `gpsimeiNo` field is currently not part of the active form model.
    // Guard to avoid runtime errors that break dialog rendering.
    if (!gpsimeiNoControl) {
      return;
    }
    if (isGPSAvailable) {
      gpsimeiNoControl.setValidators([Validators.required]);
    } else {
      gpsimeiNoControl.clearValidators();
    }
    gpsimeiNoControl.updateValueAndValidity();
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

 //start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm?.get('startDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm?.get('startDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.registrationFromDate=formattedDate
  }
  else{
    this.advanceTableForm?.get('registrationFromDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm?.get('registrationFromDate')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm?.get('registrationTillDate')?.setValue(formattedDate);    
} else {
this.advanceTableForm?.get('registrationTillDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.registrationTillDate=formattedDate
}
else{
  this.advanceTableForm?.get('registrationTillDate')?.setValue(formattedDate);
}

} else {
this.advanceTableForm?.get('registrationTillDate')?.setErrors({ invalidDate: true });
}
  }

  // Only AlphaNumeric At Registration Number
  keyPressAlphaNumeric(event) 
  {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) 
    {
      return true;
    } 
    else 
    {
      event.preventDefault();
      return false;
    }
  }

  // Handle pasting or modifying input dynamically
  removeSpaces() 
  {
    let value = this.advanceTableForm.value.registrationNumber;
    let newValue = value.replace(/\s/g, ''); // Remove spaces
    if (value !== newValue) 
    {
      this.advanceTableForm.get('registrationNumber').setValue(newValue, { emitEvent: false }); // Update FormControl without triggering additional events
    }
  }
}



