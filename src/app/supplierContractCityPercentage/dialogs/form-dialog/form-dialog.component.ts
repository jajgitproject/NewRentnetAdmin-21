// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { SupplierContractCityPercentageService } from '../../supplierContractCityPercentage.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { SupplierContractCityPercentage } from '../../supplierContractCityPercentage.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponentHolder {
  employeeID: number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public CityList?: CityDropDown[] = [];
  searchCity: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;
  image: any;
  advanceTable: SupplierContractCityPercentage;
  applicableFrom: any;
  applicableTo: any;
  supplierName: any;
  cityID: any;
  isLoading: boolean = false;
 
  // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: SupplierContractCityPercentageService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'City Percentage For';
      this.advanceTable = data.advanceTable;
      this.searchCity.setValue(this.advanceTable.city);

      let fromDate = moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
      let toDate = moment(this.advanceTable.toDate).format('DD/MM/yyyy');
      this.onBlurUpdateDateFromEdit(fromDate);
      this.onBlurUpdateDateToEdit(toDate);
    } else {
      this.dialogTitle = 'City Percentage For';
      this.advanceTable = new SupplierContractCityPercentage({});
      this.advanceTable.activationStatus = true;

    }
    this.advanceTableForm = this.createContactForm();
    this.applicableFrom = data.ApplicableFrom;
    this.applicableTo = data.ApplicableTo;
    this.supplierName = data.SupplierName;
  }
  public ngOnInit(): void {
    this.InitCities();
    // {
    //   this._generalService.GetCitiessAl().subscribe
    //   (
    //     data =>   
    //     {
    //       this.CityList = data;
    //       console.log(this.CityList)

    //     }
    //   );

    // }
  }

  //----------- Package Validation --------------
  cityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(employee => employee.geoPointName.toLowerCase() === value);
      return match ? null : { cityInvalid: true };
    };
  }

  InitCities() {
    this._generalService.GetCitiessAl().subscribe(
      data => {
        ;
        this.CityList = data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
        this.cityValidator(this.CityList)]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
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
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CityList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

  onCitySelected(selectedCityName: string) {
    const selectedCity = this.CityList.find(
      city => city.geoPointName === selectedCityName
    );

    if (selectedCity) {
      this.getTitlesID(selectedCity.geoPointID);
    }
  }

  getTitlesID(cityID: any) {
    this.cityID = cityID;
  }
  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        supplierContractCityPercentageID: [this.advanceTable.supplierContractCityPercentageID],
        supplierContractID: [this.advanceTable.supplierContractID],
        cityID: [this.advanceTable.cityID],
        city: [this.advanceTable.city],
        fromDate: [this.advanceTable.fromDate, [Validators.required, this._generalService.dateValidator()]],
        toDate: [this.advanceTable.toDate, [Validators.required, this._generalService.dateValidator()]],
        supplierPercentage: [this.advanceTable.supplierPercentage,],
        activationStatus: [this.advanceTable.activationStatus],
      });
  }

    //start date
      onBlurUpdateDateFrom(value: string): void {
          value= this._generalService.resetDateiflessthan12(value);
        
        const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
        if (validDate) {
          const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
            this.advanceTableForm.get('fromDate')?.setValue(formattedDate);    
        } else {
          this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
        }
      }
      
      
      onBlurUpdateDateFromEdit(value: string): void {  
        const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
        if (validDate) {
          const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
          if(this.action==='edit')
          {
            this.advanceTable.fromDate=formattedDate
          }
          else{
            this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
          }
          
        } else {
          this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
        }
      }
      
      
      //end date
      onBlurUpdateDateTo(value: string): void {
        value= this._generalService.resetDateiflessthan12(value);
      
      const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
          this.advanceTableForm.get('toDate')?.setValue(formattedDate);    
      } else {
        this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
      }
      }
      
      onBlurUpdateDateToEdit(value: string): void {  
      const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        if(this.action==='edit')
        {
          this.advanceTable.toDate=formattedDate
        }
        else{
          this.advanceTableForm.get('toDate')?.setValue(formattedDate);
        }
        
      } else {
        this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
      }
      }
  

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();

    }
    else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }
  public Post(): void {
    this.isLoading = true;
  
    this.advanceTableForm.patchValue({ supplierContractID: this.data.SupplierContractID });
    this.advanceTableForm.patchValue({ cityID: this.cityID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          //debugger;
          this.dialogRef.close();

          this._generalService.sendUpdate('SupplierContractCityPercentageCreate:SupplierContractCityPercentageView:Success');//To Send Updates  
          if (this.data.lastid) {
            this.showNotification(
              'snackbar-success',
              'Supplier Contract City Percentage Created...!!!',
              'bottom',
              'center'
            );
          }

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCityPercentageAll:SupplierContractCityPercentageView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.advanceTable.supplierContractID });
    this.advanceTableForm.patchValue({ cityID: this.cityID || this.advanceTable.cityID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractCityPercentageUpdate:SupplierContractCityPercentageView:Success');//To Send Updates 

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCityPercentageAll:SupplierContractCityPercentageView:Failure');//To Send Updates  
        }
      )
  }
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");

          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "SupplierContractCityPercentageCreate") {
              if (this.MessageArray[1] == "SupplierContractCityPercentageView") {
                if (this.MessageArray[2] == "Success") {
                  //debugger;

                  this.showNotification(
                    'snackbar-success',
                    'Supplier Contract City Percentage Created Successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }

          }
        }
      );
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
}



