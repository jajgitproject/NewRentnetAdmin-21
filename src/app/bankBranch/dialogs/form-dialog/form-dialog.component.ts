// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BankBranchService } from '../../bankBranch.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { BankBranch } from '../../bankBranch.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { BankDropDown } from 'src/app/bank/bankDropDown.model';
// import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { CountryDropDown } from 'src/app/general/countryDropDown.model';
import { CityDropDown } from '../../cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
// import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  advanceTable: BankBranch;
  existingCountryID: number;
  saveDisabled:boolean=true;

  public BankList?: BankDropDown[] = [];
  filteredOptions: Observable<BankDropDown[]>;
  searchTerm:  FormControl = new FormControl();

  public CityLists?: CityDropDown[] = [];
  searchCityTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;

  public StateList?: CountryDropDown[] = [];
  searchStateTerm: FormControl = new FormControl();
  filteredStateOptions: Observable<CountryDropDown[]>;

  public CountryList?: CountryDropDown[] = [];

  searchCountryTerm : FormControl = new FormControl();
  filteredCountryOptions: Observable<CountryDropDown[]>;
  public CountriesList?: CountryDropDown[] = [];

  countryOnStateID: number;
  stateOnCityID: number;
  bankID: any;
  geoPointID: any;
  geoPointStateID: any;
  geoPointCityID: any;
  countryNameOnStateID: string;
  // stateOnCityID:number;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: BankBranchService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Bank Branch';       
          this.advanceTable = data.advanceTable;
          
          this.searchTerm.setValue(this.advanceTable.bank);
          this.searchCountryTerm.setValue(this.advanceTable.country)
          this.searchStateTerm.setValue(this.advanceTable.stateName)
          this.searchCityTerm.setValue(this.advanceTable.city)
          //this.getStatesBasedOnCity();
        } else 
        {
          this.dialogTitle = 'Bank Branch';
          this.advanceTable = new BankBranch({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void
  {
    this.InitBank();
    //this.OnCountryChangeGetStates();
     //this.OnStateChangeGetCity();
     this.InitCountries();
     this.getStatesBasedOnCity();
     
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      bankBranchID: [this.advanceTable.bankBranchID],
      bankBranch: [this.advanceTable.bankBranch,],
      bankID: [this.advanceTable.bankID],
      bank: [this.advanceTable.bank],
      countryID: [this.advanceTable.countryID],
      country: [this.advanceTable.country],
      stateID: [this.advanceTable.stateID],
      stateName: [this.advanceTable.stateName],
      bankBranchCityID: [this.advanceTable.bankBranchCityID],
      city: [this.advanceTable.city],
      bankBranchAddress: [this.advanceTable.bankBranchAddress],
      bankBranchIFSCCode: [this.advanceTable.bankBranchIFSCCode],
      bankBranchSwiftCode: [this.advanceTable.bankBranchSwiftCode],
      bankBranchIBanNumber: [this.advanceTable.bankBranchIBanNumber],
      bankBranchRoutingCode: [this.advanceTable.bankBranchRoutingCode],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      //updateDateTime: [this.advanceTable.updateDateTime,[this.noWhitespaceValidator]],
    });
  }

//   public noWhitespaceValidator(control: FormControl) {
//     const isWhitespace = (control.value || '').trim().length === 0;
//     const isValid = !isWhitespace;
//     return isValid ? null : { 'whitespace': true };
// }

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
    this.advanceTableForm.patchValue({bankID:this.bankID});
    this.advanceTableForm.patchValue({countryID:this.geoPointID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID});
    this.advanceTableForm.patchValue({bankBranchCityID:this.geoPointCityID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('BankBranchCreate:BankBranchView:Success');//To Send Updates  
       this.saveDisabled = true;
    
  },
    error =>
    {
       this._generalService.sendUpdate('BankBranchAll:BankBranchView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({bankID:this.bankID || this.advanceTable.bankID});
    this.advanceTableForm.patchValue({countryID:this.geoPointID || this.advanceTable.countryID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID || this.advanceTable.stateID});
    this.advanceTableForm.patchValue({bankBranchCityID:this.geoPointCityID || this.advanceTable.bankBranchCityID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('BankBranchUpdate:BankBranchView:Success');//To Send Updates
       this.saveDisabled = true;  
       
    },
    error =>
    {
     this._generalService.sendUpdate('BankBranchAll:BankBranchView:Failure');//To Send Updates 
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

  InitCountries(){
    this._generalService.getCountries().subscribe(
      data=>
      {
        this.CountriesList=data;
        this.advanceTableForm.controls['country'].setValidators([Validators.required,
          this.countryNameValidator(this.CountriesList)
        ]);
        this.advanceTableForm.controls['country'].updateValueAndValidity();

        this.filteredCountryOptions = this.advanceTableForm.controls['country'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountry(value || ''))
        );
      });
  }
  private _filterCountry(value: string): any {
    const filterValue = value?.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CountriesList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCountrySelected(selectedCountryName: string) {
    const selectedCountry = this.CountriesList.find(
      data => data.geoPointName === selectedCountryName
    );
  
    if (selectedCountry) {
      this.getCountryID(selectedCountry.geoPointID);
    }
  }
  getCountryID(geoPointID: any) {
    this.geoPointID=geoPointID;
    this.OnCountryChangeGetStates();
    this.advanceTableForm.controls['stateName'].setValue('');
    this.advanceTableForm.controls['city'].setValue('');
  }

  onCountryInputChanges(event:any){
    if(event.keyCode===8){
      this.advanceTableForm.controls['stateName'].setValue('');
      this.advanceTableForm.controls['city'].setValue('');
     }

  }

  countryNameValidator(CountriesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountriesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { countryNameInvalid: true };
    };
  }

// -------------------------------------BankAuto Complete-------------------
  InitBank() {
    this._generalService.GetBank().subscribe(
      data =>
      {
        this.BankList = data;
        this.advanceTableForm.controls['bank'].setValidators([Validators.required,
          this.bankTypeValidator(this.BankList)
        ]);
        this.advanceTableForm.controls['bank'].updateValueAndValidity();

        this.filteredOptions = this.advanceTableForm.controls['bank'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      },
      error =>
      {
       
      }
    );
   }

   private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.BankList.filter(
      customer => 
      {
        return customer.bank.toLowerCase().includes(filterValue);
      }
    );
  }
  onBankSelected(selectedBankName: string) {
    const selectedBank = this.BankList.find(
      data => data.bank === selectedBankName
    );
  
    if (selectedBank) {
      this.getBankID(selectedBank.bankID);
    }
  }
  getBankID(bankID: any) {
    this.bankID=bankID;
  }
  bankTypeValidator(BankList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = BankList.some(group => group.bank?.toLowerCase() === value);
      return match ? null : { bankInvalid: true };
    };
  }

  // -------------------------------------End-------------------
   OnCountryChangeGetStates(){ 
    this._generalService.GetStates(this.geoPointID).subscribe(
      data =>
      {
        this.StateList = data; 
        this.advanceTableForm.controls['stateName'].setValidators([Validators.required,
          this.stateNameValidator(this.StateList)
        ]);
        this.advanceTableForm.controls['stateName'].updateValueAndValidity(); 
        this.filteredStateOptions = this.advanceTableForm.controls['stateName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        ); 
                        
      },
      error=>
      {
  
      }
    );
  
  }
  private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.StateList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  onStateSelected(selectedStateName: string) {
    const selectedState = this.StateList.find(
      data => data.geoPointName === selectedStateName
    );
  
    if (selectedState) {
      this.getStateID(selectedState.geoPointID);
    }
  }
  getStateID(geoPointID: any) {
    this.geoPointStateID=geoPointID;
    this.OnStateChangeGetCity();
  this.advanceTableForm.controls['city'].setValue('');
  }

  onStateInputChanges(event:any){
    if(event.keyCode===8){
     this.advanceTableForm.controls['city'].setValue('');
    }
   }

   stateNameValidator(StatesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = StatesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { stateNameInvalid: true };
    };
  }
  OnStateChangeGetCity(){ 
    this._generalService.GetCities(this.geoPointStateID).subscribe(
      data =>
      {
        this.CityLists = data;   
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
          this.cityNameValidator(this.CityLists)
        ]);
        this.advanceTableForm.controls['city'].updateValueAndValidity(); 
        this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        );                   
      },
      error=>
      {
  
      }
    );
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityLists.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCitySelected(selectedCityName: string) {
    const selectedCity = this.CityLists.find(
      data => data.geoPointName === selectedCityName
    );
  
    if (selectedCity) {
      this.getCityID(selectedCity.geoPointID);
    }
  }
  getCityID(geoPointID: any) {
    this.geoPointCityID=geoPointID;
  
  }
  cityNameValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityNameInvalid: true };
    };
  }
  
  getCountryBasedOnState(){
    this._generalService.GetCountryForOE(this.stateOnCityID).subscribe(
      data =>
      {
        this.CountryList = data;
        this.CountryList.forEach((ele)=>{
          this.InitCountries();
          for(var i=0;i<this.CountriesList.length;i++){
            if(this.CountriesList[i].geoPointID===ele.geoPointID){
              this.countryOnStateID=ele.geoPointID;
              this.countryNameOnStateID=ele.geoPointName;
              this.geoPointID = ele.geoPointID;
              this.advanceTableForm.controls["countryID"].setValue(this.countryNameOnStateID);
              this._generalService.GetStates(this.countryOnStateID).subscribe(
            data =>
            {
              this.StateList = data; 
                                 
            },
            error=>
            {
        
            }
          );
            }
          }
        }) 
      },    
      error=>
      {
  
      }
    );
  }

  getStatesBasedOnCity(){ 
    this._generalService.GetStateOnCity(this.advanceTable.bankBranchCityID).subscribe(
      data =>
      {
        this.StateList = data;  
        this.StateList.forEach((ele)=>{         
              this.stateOnCityID=ele.geoPointID;
              this.getCountryBasedOnState();
              this.advanceTableForm.controls["stateID"].setValue(this.stateOnCityID);  
              this._generalService.GetCities(this.stateOnCityID).subscribe(
                data =>
                {
                  this.CityLists = data;                     
                },
                error=>
                {
            
                }
              );    
        })                  
      },
      error=>
      {
  
      }
    );
  
  }
   
}


