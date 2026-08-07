// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, AbstractControl, ValidatorFn} from '@angular/forms';
import { Inventory } from '../../inventory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { GeneralService } from '../../../general/general.service';
import { InventoryDropDown } from '../../inventoryDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import {
  filterSuppliersByDisplay,
  formatSupplierDisplay,
  supplierMatchesDisplay,
} from 'src/app/supplier/supplier-display.util';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { ColorDropDown } from 'src/app/color/colorDropDown.model';
import { FuelTypeDropDown } from 'src/app/fuelType/fuelTypeDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { from, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Color } from 'src/app/color/color.model';
import { TransmissionTypeDropDown } from 'src/app/transmissionType/transmissionTypeDropDown.model';
import moment from 'moment';

export const INVENTORY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ...provideMomentDateAdapter(INVENTORY_DATE_FORMATS),
  ]
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
  public _generalService:GeneralService,
  private snackBar: MatSnackBar)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Inventory';       
          this.advanceTable = data.advanceTable;
          if (this.advanceTable?.registrationNumber) {
            this.advanceTable.registrationNumber = String(this.advanceTable.registrationNumber)
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, '');
          }
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
           let registrationFromDate=moment(this.advanceTable.registrationFromDate).format('DD/MM/YYYY');
                    let registrationTillDate=moment(this.advanceTable.registrationTillDate).format('DD/MM/YYYY');
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
        this.VehicleCategoryList = data || [];
        const categoryCtrl = this.advanceTableForm.controls['vehicleCategoryID'];
        categoryCtrl.setValidators([Validators.required]);
        categoryCtrl.updateValueAndValidity();
        const currentId = categoryCtrl.value || this.advanceTable?.vehicleCategoryID;
        if (currentId) {
          const match = this.VehicleCategoryList.find((item) => item.vehicleCategoryID === Number(currentId));
          if (match) {
            this.vehicleCategoryID = match.vehicleCategoryID;
            categoryCtrl.setValue(match.vehicleCategoryID, { emitEvent: false });
            this.advanceTableForm.patchValue({ vehicleCategory: match.vehicleCategory }, { emitEvent: false });
            this.initVehicle(true);
          }
        }
      });
  }

  onVehicleCategoryChange(vehicleCategoryID: number) {
    this.getTitles(vehicleCategoryID);
    const match = this.VehicleCategoryList?.find((item) => item.vehicleCategoryID === Number(vehicleCategoryID));
    if (match) {
      this.advanceTableForm.patchValue({ vehicleCategory: match.vehicleCategory });
    }
  }

  getTitles(vehicleCategoryID: any)
 {
    this.vehicleCategoryID=vehicleCategoryID;
    this.advanceTableForm.patchValue({ vehicleID: null, vehicle: '' }, { emitEvent: false });
    this.vehicleID = null;
    this.initVehicle(false);
  }

  initVehicle(preserveSelection: boolean = false) {
    if (!this.vehicleCategoryID) {
      this.VehicleList = [];
      return;
    }
    this._generalService.GetVehicles(this.vehicleCategoryID).subscribe(
      data => {
        this.VehicleList = data || [];
        const vehicleCtrl = this.advanceTableForm.controls['vehicleID'];
        vehicleCtrl.setValidators([Validators.required]);
        vehicleCtrl.updateValueAndValidity();
        if (preserveSelection) {
          const currentId = vehicleCtrl.value || this.advanceTable?.vehicleID;
          if (currentId) {
            const match = this.VehicleList.find((item) => item.vehicleID === Number(currentId));
            if (match) {
              this.vehicleID = match.vehicleID;
              vehicleCtrl.setValue(match.vehicleID, { emitEvent: false });
              this.advanceTableForm.patchValue({ vehicle: match.vehicle }, { emitEvent: false });
            }
          }
        }
      }
    );
  }

  onVehicleChange(vehicleID: number) {
    this.getvehicleID(vehicleID);
    const match = this.VehicleList?.find((item) => item.vehicleID === Number(vehicleID));
    if (match) {
      this.advanceTableForm.patchValue({ vehicle: match.vehicle });
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
        this.OrganizationalEntityList = data || [];
        const companyControl = this.advanceTableForm.controls['companyID'];
        companyControl.setValidators([Validators.required]);
        companyControl.updateValueAndValidity();

        // Ensure edit value matches option type (number)
        const currentCompanyID = companyControl.value || this.advanceTable?.companyID;
        if (currentCompanyID) {
          const matched = this.OrganizationalEntityList.find(
            c => Number(c.organizationalEntityID) === Number(currentCompanyID)
          );
          if (matched) {
            companyControl.setValue(matched.organizationalEntityID, { emitEvent: false });
            this.companyID = matched.organizationalEntityID;
            this.advanceTableForm.patchValue(
              { company: matched.organizationalEntityName },
              { emitEvent: false }
            );
          }
        }
      });
  }

  onCompanyChange(companyID: any) {
    this.getorganizationalEntityID(companyID);
    const selected = this.OrganizationalEntityList?.find(
      c => Number(c.organizationalEntityID) === Number(companyID)
    );
    this.advanceTableForm.patchValue(
      { company: selected?.organizationalEntityName || '' },
      { emitEvent: false }
    );
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
        this.OrganizationalEntitiesList = data || [];
        const locationCtrl = this.advanceTableForm.controls['locationHubID'];
        locationCtrl.setValidators([Validators.required]);
        locationCtrl.updateValueAndValidity();
        const currentId = locationCtrl.value || this.advanceTable?.locationHubID;
        if (currentId) {
          const match = this.OrganizationalEntitiesList.find(
            (item) => item.organizationalEntityID === Number(currentId)
          );
          if (match) {
            this.locationHubID = match.organizationalEntityID;
            locationCtrl.setValue(match.organizationalEntityID, { emitEvent: false });
            this.advanceTableForm.patchValue({
              locationHub: match.organizationalEntityName,
              organizationalEntityName: match.organizationalEntityName
            }, { emitEvent: false });
          }
        }
      });
  }

  onLocationHubChange(locationHubID: number) {
    this.getlocationHubID(locationHubID);
    const match = this.OrganizationalEntitiesList?.find(
      (item) => item.organizationalEntityID === Number(locationHubID)
    );
    if (match) {
      this.advanceTableForm.patchValue({
        locationHub: match.organizationalEntityName,
        organizationalEntityName: match.organizationalEntityName
      });
    }
  }

  getlocationHubID(locationHubID: any)
  {
    this.locationHubID=locationHubID;
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
      const match = SupplierForOwnerList.some(group => supplierMatchesDisplay(group, control.value));
      return match ? null : { supplierForOwnerInvalid: true };
    };
  }

  formatSupplierDisplay = formatSupplierDisplay;

  private syncSupplierDisplayFromId(list: SupplierDropDown[], supplierId: number): void {
    const match = list?.find((item) => item.supplierID === supplierId);
    if (match) {
      this.advanceTableForm.patchValue({ supplier: formatSupplierDisplay(match) });
    }
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
        this.syncSupplierDisplayFromId(this.SupplierForOwnerList, this.advanceTable?.supplierID);
        this.filteredSupplierForOwnerOptions = this.advanceTableForm.controls['supplier'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplierForOwner(value || ''))
        ); 
      });
  }
  private _filtersearchSupplierForOwner(value: string): any {
  const filterValue = value.toLowerCase();

  return filterSuppliersByDisplay(this.SupplierForOwnerList, filterValue);
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
      data => supplierMatchesDisplay(data, selectedSupplier)
    );
    if (SupplierName) 
    {
      this.getsupplierIDForOwner(SupplierName.supplierID);
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
        this.syncSupplierDisplayFromId(this.SupplierList, this.advanceTable?.supplierID);
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

  return filterSuppliersByDisplay(this.SupplierList, filterValue);
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
      data => supplierMatchesDisplay(data, selectedSupplier)
    );
    if (SupplierName) 
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
      const match = SupplierList.some(group => supplierMatchesDisplay(group, control.value));
      return match ? null : { supplierInvalid: true };
    };
  }

  InitSupplierForOwnership()
  {
    this._generalService.SupplierForOwnershipOfOE().subscribe(
      data=>
      {
        this.SupplierForOwnershipList=data;
        this.advanceTableForm.patchValue({supplier:formatSupplierDisplay(this.SupplierForOwnershipList[0])});
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
        const registrationCityCtrl = this.advanceTableForm.get('registrationCity');
        if (!registrationCityCtrl) {
          return;
        }
        registrationCityCtrl.setValidators([Validators.required,
          this.registrationCityValidator(this.CityList)]);
        registrationCityCtrl.updateValueAndValidity();
        this.filteredCityOptions = registrationCityCtrl.valueChanges.pipe(
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
        this.ColorList = data || [];
        const colorCtrl = this.advanceTableForm.controls['colorID'];
        colorCtrl.setValidators([Validators.required]);
        colorCtrl.updateValueAndValidity();
        const currentId = colorCtrl.value || this.advanceTable?.colorID;
        if (currentId) {
          const match = this.ColorList.find((item) => item.colorID === Number(currentId));
          if (match) {
            this.colorID = match.colorID;
            colorCtrl.setValue(match.colorID, { emitEvent: false });
            this.advanceTableForm.patchValue({ color: match.color }, { emitEvent: false });
          }
        }
      });
  }

  onColorChange(colorID: number) {
    this.getcolorID(colorID);
    const match = this.ColorList?.find((item) => item.colorID === Number(colorID));
    if (match) {
      this.advanceTableForm.patchValue({ color: match.color });
    }
  }

  getcolorID(colorID: any) 
  {
    this.colorID=colorID;
  }

  InitFuelType(){
    this._generalService.getFuleTypesForInventory().subscribe(
      data=>
      {
        this.FuelTypeList = data || [];
        const fuelCtrl = this.advanceTableForm.controls['fuelTypeID'];
        fuelCtrl.setValidators([Validators.required]);
        fuelCtrl.updateValueAndValidity();
        const currentId = fuelCtrl.value || this.advanceTable?.fuelTypeID;
        if (currentId) {
          const match = this.FuelTypeList.find((item) => item.fuelTypeID === Number(currentId));
          if (match) {
            this.fuelTypeID = match.fuelTypeID;
            fuelCtrl.setValue(match.fuelTypeID, { emitEvent: false });
            this.advanceTableForm.patchValue({ fuelType: match.fuelType }, { emitEvent: false });
          }
        }
      });
  }

  onFuelTypeChange(fuelTypeID: number) {
    this.getfuelTypeID(fuelTypeID);
    const match = this.FuelTypeList?.find((item) => item.fuelTypeID === Number(fuelTypeID));
    if (match) {
      this.advanceTableForm.patchValue({ fuelType: match.fuelType });
    }
  }

  getfuelTypeID(fuelTypeID: any) 
  {
    this.fuelTypeID=fuelTypeID;
  }

  initTrasmissionType(){
    this._generalService.getTransmissionType().subscribe(
      data=>
      {
        this.TransmissionTypeList=data;
        const transmissionTypeCtrl = this.advanceTableForm.get('transmissionType');
        if (!transmissionTypeCtrl) {
          return;
        }
        transmissionTypeCtrl.setValidators([Validators.required,
          this.transmissionTypeValidator(this.TransmissionTypeList)]);
        transmissionTypeCtrl.updateValueAndValidity();
        this.filteredtransmissionTypeOptions = transmissionTypeCtrl.valueChanges.pipe(
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

  /** Matches template `activationStatus` (Active=true / Deleted=false); supports API camelCase or PascalCase. */
  private initialActivationStatus(): boolean {
    const t = this.advanceTable as any;
    if (!t) {
      return true;
    }
    if (typeof t.activationStatus === 'boolean') {
      return t.activationStatus;
    }
    if (typeof t.ActivationStatus === 'boolean') {
      return t.ActivationStatus;
    }
    const st = t.status ?? t.Status;
    if (typeof st === 'string' && st.toLowerCase() === 'deactive') {
      return false;
    }
    return true;
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      inventoryID: [this.advanceTable?.inventoryID],
      vehicleCategoryID: [this.advanceTable?.vehicleCategoryID || null, Validators.required],
      vehicleCategory: [this.advanceTable?.vehicleCategory],
      vehicleID: [this.advanceTable?.vehicleID || null, Validators.required],
      vehicle: [this.advanceTable?.vehicle],
      company: [this.advanceTable?.company],
      companyID: [this.advanceTable?.companyID || null, Validators.required],
      locationHub:[this.advanceTable?.organizationalEntityName || this.advanceTable?.locationHub],
      organizationalEntityName:[this.advanceTable?.organizationalEntityName || this.advanceTable?.locationHub],
      registrationStateID: [this.advanceTable?.registrationStateID],
      registrationCityID: [this.advanceTable?.registrationCityID],
      registrationNumber: [
        this.advanceTable?.registrationNumber
          ? String(this.advanceTable.registrationNumber).toUpperCase().replace(/[^A-Z0-9]/g, '')
          : '',
        [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]
      ],
      registrationFromDate: [this.advanceTable?.registrationFromDate],
      //registrationTillDate: [this.advanceTable?.registrationTillDate],
      locationHubID: [this.advanceTable?.locationHubID || null, Validators.required],
      ownedSupplied: [this.advanceTable?.ownedSupplied],
      supplierID: [this.advanceTable?.supplierID],
      supplier: [this.advanceTable?.supplier],
      colorID: [this.advanceTable?.colorID || null, Validators.required],
      fuelTypeID: [this.advanceTable?.fuelTypeID || null, Validators.required],
      mileage: [this.advanceTable?.mileage],
      fuelCardNo: [this.advanceTable?.fuelCardNo ?? this.advanceTable?.FuelCardNo ?? ''],
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
      inventoryCreatedBy: [this.advanceTable?.inventoryCreatedBy],
      //registrationCity: [this.advanceTable?.registrationCity],
      status: [this.advanceTable?.status],
      businessDivision: [this.advanceTable?.businessDivision],
      inventoryRemark: [this.advanceTable?.inventoryRemark ?? (this.advanceTable as any)?.InventoryRemark ?? ''],
      activationStatus: [this.initialActivationStatus()]
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
    this.advanceTableForm.patchValue({
      vehicleCategoryID: this.advanceTableForm.value.vehicleCategoryID || this.vehicleCategoryID
    });
    this.advanceTableForm.patchValue({
      vehicleID: this.advanceTableForm.value.vehicleID || this.vehicleID
    });
    this.advanceTableForm.patchValue({registrationCityID:this.registrationCityID});
    this.advanceTableForm.patchValue({
      colorID: this.advanceTableForm.value.colorID || this.colorID
    });
    this.advanceTableForm.patchValue({
      fuelTypeID: this.advanceTableForm.value.fuelTypeID || this.fuelTypeID
    });
    this.advanceTableForm.patchValue({
      locationHubID: this.advanceTableForm.value.locationHubID || this.locationHubID
    });
    this.advanceTableForm.patchValue({
      companyID: this.companyID || this.advanceTableForm.value.companyID
    });
    this.advanceTableForm.patchValue({
      fuelCardNo: (this.advanceTableForm.value.fuelCardNo || '').toString().trim()
    });
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
       const message = error?.error || 'Save failed';
       if (typeof message === 'string' && message.toLowerCase().includes('duplicate')) {
         this.advanceTableForm.get('registrationNumber')?.setErrors({ duplicate: true });
         this.advanceTableForm.get('registrationNumber')?.markAsTouched();
         this.snackBar.open('Registration Number already exists', '', {
           duration: 3000,
           verticalPosition: 'bottom',
           horizontalPosition: 'center',
           panelClass: 'snackbar-danger'
         });
       }
       this._generalService.sendUpdate('InventoryAll:InventoryView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({
      vehicleCategoryID: this.advanceTableForm.value.vehicleCategoryID || this.vehicleCategoryID || this.advanceTable.vehicleCategoryID
    });
    this.advanceTableForm.patchValue({
      vehicleID: this.advanceTableForm.value.vehicleID || this.vehicleID || this.advanceTable.vehicleID
    });
    this.advanceTableForm.patchValue({registrationCityID:this.registrationCityID ||this.advanceTable.registrationCityID });
    this.advanceTableForm.patchValue({
      colorID: this.advanceTableForm.value.colorID || this.colorID || this.advanceTable.colorID
    });
    this.advanceTableForm.patchValue({
      fuelTypeID: this.advanceTableForm.value.fuelTypeID || this.fuelTypeID || this.advanceTable.fuelTypeID
    });
    this.advanceTableForm.patchValue({
      locationHubID: this.advanceTableForm.value.locationHubID || this.locationHubID || this.advanceTable.locationHubID
    });
    this.advanceTableForm.patchValue({
      companyID: this.companyID || this.advanceTableForm.value.companyID || this.advanceTable.companyID
    });
    this.advanceTableForm.patchValue({
      fuelCardNo: (this.advanceTableForm.value.fuelCardNo || '').toString().trim()
    });
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
     const message = error?.error || 'Save failed';
     if (typeof message === 'string' && message.toLowerCase().includes('duplicate')) {
       this.advanceTableForm.get('registrationNumber')?.setErrors({ duplicate: true });
       this.advanceTableForm.get('registrationNumber')?.markAsTouched();
       this.snackBar.open('Registration Number already exists', '', {
         duration: 3000,
         verticalPosition: 'bottom',
         horizontalPosition: 'center',
         panelClass: 'snackbar-danger'
       });
     }
     this._generalService.sendUpdate('InventoryAll:InventoryView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
  }
  public confirmAdd(): void 
  {
    this.onRegistrationNumberInput();
    if (this.advanceTableForm.get('registrationNumber')?.invalid) {
      this.advanceTableForm.get('registrationNumber')?.markAsTouched();
      return;
    }
    this.saveDisabled = false;
    this.checkRegistrationNumberDuplicate(true);
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
    this.advanceTableForm?.get('registrationFromDate')?.setValue(formattedDate);
    this.advanceTableForm?.get('registrationFromDate')?.setErrors(null);
} else {
  this.advanceTableForm?.get('registrationFromDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTable.registrationFromDate = formattedDate;
  this.advanceTableForm?.get('registrationFromDate')?.setValue(formattedDate);
  this.advanceTableForm?.get('registrationFromDate')?.setErrors(null);
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

  onRegistrationNumberInput() 
  {
    const control = this.advanceTableForm?.get('registrationNumber');
    if (!control) {
      return;
    }
    const value = control.value == null ? '' : String(control.value);
    const newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value !== newValue) {
      control.setValue(newValue, { emitEvent: false });
    }
    this.clearRegistrationNumberDuplicateError();
  }

  checkRegistrationNumberDuplicate(saveAfterCheck: boolean = false) 
  {
    this.onRegistrationNumberInput();
    const control = this.advanceTableForm?.get('registrationNumber');
    const registrationNumber = control?.value;
    if (!registrationNumber || control?.hasError('pattern') || control?.hasError('required')) {
      if (saveAfterCheck) {
        this.saveDisabled = true;
      }
      return;
    }

    const excludeInventoryID = this.action === 'edit'
      ? (this.advanceTable?.inventoryID || 0)
      : 0;

    this.advanceTableService.checkRegistrationNumberDuplicate(registrationNumber, excludeInventoryID)
      .subscribe({
        next: (exists) => {
          if (exists) {
            control.setErrors({ ...(control.errors || {}), duplicate: true });
            control.markAsTouched();
            this.snackBar.open('Registration Number already exists', '', {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-danger'
            });
            if (saveAfterCheck) {
              this.saveDisabled = true;
            }
            return;
          }
          this.clearRegistrationNumberDuplicateError();
          if (saveAfterCheck) {
            if (this.action === 'edit') {
              this.Put();
            } else {
              this.Post();
            }
          }
        },
        error: () => {
          if (saveAfterCheck) {
            this.saveDisabled = true;
            this._generalService.sendUpdate('InventoryAll:InventoryView:Failure');
          }
        }
      });
  }

  private clearRegistrationNumberDuplicateError() 
  {
    const control = this.advanceTableForm?.get('registrationNumber');
    if (!control?.hasError('duplicate')) {
      return;
    }
    const errors = { ...(control.errors || {}) };
    delete errors['duplicate'];
    control.setErrors(Object.keys(errors).length ? errors : null);
  }
}



