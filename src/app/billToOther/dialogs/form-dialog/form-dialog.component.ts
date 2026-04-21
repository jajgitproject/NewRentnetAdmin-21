// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BillToOtherService } from '../../billToOther.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { BillToOther } from '../../billToOther.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { Observable } from 'rxjs';
import { CountryDropDown } from 'src/app/general/countryDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogBillToOtherComponent 
{
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: BillToOther;
  reservationID: any;
  public CityLists?: CityDropDown[] = [];
  searchCityTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;

  public StateList?: CountryDropDown[] = [];
  searchStateTerm: FormControl = new FormControl();
  filteredStateOptions: Observable<CountryDropDown[]>;

  public CountryList?: CountryDropDown[] = [];
  countryOnStateID: number;
  stateOnCityID: number;

  searchTerm : FormControl = new FormControl();
  filteredCountryOptions: Observable<CountryDropDown[]>;
  public CountriesList?: CountryDropDown[] = [];
  geoPointID: any;
  geoPointStateID: any;
  geoPointCityID: any;
  payerCityID: any;
  countryNameOnStateID: string;
  constructor(
  public dialogRef: MatDialogRef<FormDialogBillToOtherComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: BillToOtherService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Bill To Other';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm = this.createContactForm();
        } else 
        {
          this.dialogTitle = 'Bill To Other';
          this.advanceTable = new BillToOther({});
          this.advanceTable.activationStatus="Active";
          this.advanceTableForm = this.createContactForm();
        }
        if(data?.advanceTable?.reservationID !== undefined) {
          this.reservationID = data?.advanceTable?.reservationID;
        } else {
          this.reservationID = data?.reservationID;
        }
        
        this.status=data?.status?.status || data?.status || data;
        if(this.status!='Changes allow'){
          this.buttonDisabled=true;
        }
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationBillToOtherID: [this.advanceTable.reservationBillToOtherID],
      reservationID: [this.advanceTable.reservationID],
      //activationStatus: [this.advanceTable.activationStatus],
      payerName: [this.advanceTable.payerName],
      payerAddress: [this.advanceTable.payerAddress],
      payerCityID: [this.advanceTable.cityID],
      city: [this.advanceTable.city],
      country:[this.advanceTable.country],
      pin: [this.advanceTable.pin],
      state:[this.advanceTable.state],
      countryID: [this.advanceTable.countryID],
      stateID: [this.advanceTable.stateID],
      gstNumber: [this.advanceTable.gstNumber],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
public ngOnInit(): void
{
  this.InitCountries();
  this.getStatesBasedOnCity();
}

InitCountries(){
  this._generalService.getCountries().subscribe(
    data=>
    {
      this.CountriesList=data;
      this.filteredCountryOptions = this.advanceTableForm.controls['country'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCountry(value || ''))
      );
    });
}
private _filterCountry(value: string): any {
  const filterValue = value.toLowerCase();
  return this.CountriesList.filter(
    customer => 
    {
      return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
    }
  );
}
getCountryID(geoPointID: any) {
  this.geoPointID=geoPointID;
  this.OnCountryChangeGetStates();
  this.advanceTableForm.controls['state'].setValue('');
    this.advanceTableForm.controls['city'].setValue('');
}
onCountryInputChange(event: any) {
  if(event.target.value.length === 0) {
    this.advanceTableForm.controls['state'].setValue('');
    this.advanceTableForm.controls['city'].setValue('');
  } 
}

OnCountryChangeGetStates(){ 
  debugger;
  this._generalService.GetStates(this.geoPointID).subscribe(
    data =>
    {
      this.StateList = data;  
      this.filteredStateOptions = this.advanceTableForm.controls['state'].valueChanges.pipe(
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
  return this.StateList.filter(
    customer => 
    {
      return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
    }
  );
}
getStateID(geoPointID: any) {
  this.geoPointStateID=geoPointID;
  this.OnStateChangeGetCity();
  this.advanceTableForm.controls['city'].setValue('');
}
onStateInputChange(event: any) {
  if(event.target.value.length === 0) {
    this.advanceTableForm.controls['city'].setValue('');
    this.OnCountryChangeGetStates();
  } 
}

OnStateChangeGetCity(){ 

  this._generalService.GetCities(this.geoPointStateID).subscribe(
    data =>
    {
      this.CityLists = data;   
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
  return this.CityLists.filter(
    customer => 
    {
      return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
    }
  );
}
getCityID(payerCityID: any) {
  this.payerCityID=payerCityID;
   this.advanceTableForm.patchValue({payerCityID:this.payerCityID});
}

// getCountryBasedOnState(){
 
//   this._generalService.GetCountryForOE(this.stateOnCityID).subscribe(
//     data =>
//     {
//       this.CountryList = data;
//       this.CountryList.forEach((ele)=>{
//         this.InitCountries();
//         for(var i=0;i<this.CountriesList.length;i++){
//           if(this.CountriesList[i].geoPointID===ele.geoPointID){
//             this.countryOnStateID=ele.geoPointID;
//             this.stateOnCityID = ele.geoPointID;
//             this.advanceTableForm.controls["countryID"].setValue(this.countryOnStateID);
//             debugger;
//             this._generalService.GetStates(this.countryOnStateID).subscribe(
//           data =>
//           {
//             debugger;
//             this.StateList = data; 
//             //console.log(this.StateList);                   
//           },
//           error=>
//           {
      
//           }
//         );
//           }
//         }
//       }) 
//     },    
//     error=>
//     {

//     }
//   );
// }

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
            this.geoPointID = ele.geoPointID;
            this.advanceTableForm.controls["countryID"].setValue(this.countryOnStateID);
            debugger;
            this._generalService.GetStates(this.countryOnStateID).subscribe(
          data =>
          {
            debugger;
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
  this._generalService.GetStateOnCity(this.advanceTable.payerCityID).subscribe(
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

  submit() 
  {
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableForm.patchValue({payerCityID:this.payerCityID});
    this.advanceTableForm.patchValue({countryID:this.geoPointID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID});
    this.advanceTableForm.patchValue({cityID:this.payerCityID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
          this.dialogRef.close(true);
          this.showNotification(
            'snackbar-success',
            'Bill To Other Create...!!!',
            'bottom',
            'center'
          );
         this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Success');//To Send Updates  
         
      },
      error =>
      {
       this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Failure');//To Send Updates 
       this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
      }
  )
  }
  public Put(): void
  { 
    this.advanceTableForm.patchValue({payerCityID:this.payerCityID ||this.advanceTable.cityID});
    this.advanceTableForm.patchValue({reservationID:this.reservationID || this.reservationID});
    this.advanceTableForm.patchValue({countryID: this.geoPointID||this.advanceTable.countryID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID ||this.advanceTable.stateID});
    this.advanceTableForm.patchValue({cityID:this.payerCityID ||this.advanceTable.cityID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue()) 
     
    .subscribe(
      response => 
      {
          this.dialogRef.close(true);
          this.showNotification(
            'snackbar-success',
            'Bill To Other UPDate...!!!',
            'bottom',
            'center'
          );
         this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Success');//To Send Updates  
         
      },
      error =>
      {
       this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Failure');//To Send Updates 
       this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
      }
  )
  }
  public confirmAdd(): void 
  {
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


