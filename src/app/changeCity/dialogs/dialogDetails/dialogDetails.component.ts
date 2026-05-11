
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from 'src/app/general/general.service';
import { ModeOfPaymentDropDown } from 'src/app/supplierContract/modeOfPaymentDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from 'ng2-charts';
import { ChangeCityService } from '../../changeCity.service';
import { ChangeCityModel, CitiesDropDown } from '../../changeCity.model';
import Swal from 'sweetalert2';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-dialogDetails',
  templateUrl: './dialogDetails.component.html',
  styleUrls: ['./dialogDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentForCity
{
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ChangeCityModel;
  paymentModeID: any;
  reservationID: any;
  previousModeOfPaymentID: number;
  previousModeOfPayment: string;
  PickupDate: any;
  
  CustomerID: any;
  pickupCityID:number;
  vehicleCategoryID:number;
  vehicleID:number
  packageTypeID:number;
  packageID:number;
  checkCityOrVehicleAvilable:any;
  packageType:any;

  public CityList?: CitiesDropDown[] = [];
  filteredCitiesOptions: Observable<CitiesDropDown[]>;
  ReservationID:any;
  PackageTypeID:any;
  ContractID: any;
  cityID: any;
  noCityMessage: boolean;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentForCity>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ChangeCityService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.PickupDate = data.pickupDate;
        this.CustomerID = data.customerID;
        this.ReservationID = data.reservationID;
        this.PackageTypeID = data.packageTypeID;
        console.log("Data received in dialog: ", data);
        
        if (this.action === 'edit') 
        {              
          this.dialogTitle ='Change City';
          this.advanceTable = data.advanceTable;

        } 
        else 
        {
          
          this.dialogTitle = 'Change City';
          this.advanceTable = new ChangeCityModel({});
          //this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        this.status= data.verifyDutyStatusAndCacellationStatus || data?.status?.status || data?.status;
        // if(this.status !== 'Changes allow'){
        //   this.buttonDisabled=true;
        // }
                  if(this.status === 'Changes allow'){
          this.buttonDisabled = false;  // Save button enable
      } else {
          this.buttonDisabled = true;   // Save button disable
      }

  }

  ngOnInit()
  {
    this.onPickupDateChange();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      pickupCityID: [this.advanceTable?.pickupCityID || null],
      pickupCity: [this.advanceTable?. pickupCity || ''],
      reservationID:[this.advanceTable?.reservationID || null]
    });
  }

  public noWhitespaceValidator(control: FormControl) 
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  //------------Pickup City -----------------
    InitCity()
    {
      debugger
      console.log(this.ContractID,this.PackageTypeID);
      this.advanceTableService.GetCityAvailable(this.ContractID,this.PackageTypeID).subscribe(
      data=>
      {
        debugger
        this.CityList=data;
        console.log(this.CityList);
        this.advanceTableForm.controls['pickupCity'].setValidators([Validators.required,this.PCValidator(this.CityList)]);
        this.filteredCitiesOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
          );
      });
    }
  
    private _filterCity(value: string): any {
      const filterValue = value.toLowerCase();
      return this.CityList?.filter(
        data => 
        {
          return data.pickupCity?.toLowerCase()?.includes(filterValue)|| [];;
        }
      );
    }
    
    PCValidator(CityList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = CityList.some(data =>(data.pickupCity.toLowerCase()) === value);
        return match ? null : { pickupCityInvalid: true };
      };
    }
  
    onCitySelected(selectedCityName: string) 
    {
      const selectedCity = this.CityList.find( data => data.pickupCity === selectedCityName);    
      if (selectedCity) 
      {
        this.getCityID(selectedCity.pickupCityID);
      }
    }
  
    getCityID(cityID: any) 
    {
      this.cityID=cityID;
      this.advanceTableForm.patchValue({pickupCityID:this.cityID});
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

    showNotification(colorName, text, placementFrom, placementAlign)
    {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName
      });
    }

    public Put(): void
    {      
      this.advanceTableForm.patchValue({reservationID:this.reservationID});
      this.advanceTableService.update(this.advanceTableForm.getRawValue())  
      .subscribe(
        response => 
          {
            this.dialogRef.close();
            this.showNotification(
              'snackbar-success',
              'City Updated...!!!',
              'bottom',
              'center'
            );  
          },
      error =>
      {
      this._generalService.sendUpdate('ChangeCityAll:ChangeCityView:Failure');//To Send Updates  
      })
    }


    onPickupDateChange() 
    {
      this._generalService.GetContractIDBasedOnDate(this.CustomerID, this.PickupDate).subscribe(
      data => 
      {
        if(data) 
        {
          this.ContractID = data;
          this.noCityMessage = false;
          console.log("Contract ID based on pickup date: ", this.ContractID);
          this.InitCity();
        } 
        else
        {
          this.noCityMessage = true;
        }
      }
    );
  }
  
  
  
}


